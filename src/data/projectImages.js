const projectImages = import.meta.glob(['../assets/*', '../assets/**/*'], {
    eager: true,
    query: '?url',
    import: 'default',
});

function parseImageList(imageList) {
    if (Array.isArray(imageList)) return imageList;
    if (typeof imageList !== 'string' || !imageList.trim()) return [];

    const value = imageList.trim();

    if (value.startsWith('[')) {
        try {
            const parsed = JSON.parse(value);
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            const jsonCompatibleValue = value.replace(/'([^']*)'/g, (_, filename) => JSON.stringify(filename));

            try {
                const parsed = JSON.parse(jsonCompatibleValue);
                return Array.isArray(parsed) ? parsed : [];
            } catch {
                return [];
            }
        }
    }

    return value.split(/[,;\n|]/);
}

export function getProjectImage(filename) {
    if (typeof filename !== 'string' || !filename.trim()) return null;

    const requestedPath = filename.trim()
        .replaceAll('\\', '/')
        .replace(/^(\.\.\/)?assets\//, '')
        .replace(/^\/+/, '');
    const requestedWithoutExtension = requestedPath.replace(/\.[^.]+$/, '');
    const requestedBasename = requestedWithoutExtension.split('/').pop();
    const matchingPath = Object.keys(projectImages).find((path) => {
        const relativePath = path.slice('../assets/'.length);
        const pathWithoutExtension = relativePath.replace(/\.[^.]+$/, '');

        return pathWithoutExtension === requestedWithoutExtension
            || (!requestedPath.includes('/') && pathWithoutExtension.split('/').pop() === requestedBasename);
    });

    return matchingPath ? projectImages[matchingPath] : null;
}

export function getProjectImageList(imageList) {
    return parseImageList(imageList)
        .map((filename) => ({
            filename: typeof filename === 'string' ? filename.trim() : '',
            src: getProjectImage(filename),
        }))
        .filter(({ src }) => src);
}
