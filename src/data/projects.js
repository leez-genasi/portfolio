import initSqlJs from 'sql.js';
import sqlWasmUrl from 'sql.js/dist/sql-wasm.wasm?url';

async function queryProjects(query, parameters = []) {
    const [SQL, response] = await Promise.all([
        initSqlJs({ locateFile: () => sqlWasmUrl }),
        fetch(`${import.meta.env.BASE_URL}project.db`),
    ]);

    if (!response.ok) {
        throw new Error(`Database request failed (${response.status}).`);
    }

    const database = new SQL.Database(new Uint8Array(await response.arrayBuffer()));

    try {
        const [result] = database.exec(query, parameters);
        return result
            ? result.values.map((values) => Object.fromEntries(
                result.columns.map((column, index) => [column, values[index]]),
            ))
            : [];
    } finally {
        database.close();
    }
}

export function getProjects() {
    return queryProjects('SELECT * FROM projectList WHERE "order" IS NOT NULL ORDER BY "order", id');
}

export function getMiscProjects() {
    return queryProjects('SELECT * FROM miscProjects ORDER BY "order", id');
}

export async function getProjectById(id) {
    // Bind the selected project ID instead of interpolating it into the SQL string.
    const [project] = await queryProjects('SELECT * FROM projectList WHERE id = ?', [id]);
    return project ?? null;
}