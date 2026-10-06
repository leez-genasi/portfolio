const projectImages = import.meta.glob('../assets/*', {
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

    const basename = filename.trim().replaceAll('\\', '/').split('/').pop();
    const exactImage = projectImages[`../assets/${basename}`];
    if (exactImage) return exactImage;

    const extensionlessImage = Object.keys(projectImages).find((path) =>
        path.slice('../assets/'.length).replace(/\.[^.]+$/, '') === basename,
    );

    return extensionlessImage ? projectImages[extensionlessImage] : null;
}

export function getProjectImageList(imageList) {
    return parseImageList(imageList)
        .map((filename) => ({
            filename: typeof filename === 'string' ? filename.trim() : '',
            src: getProjectImage(filename),
        }))
        .filter(({ src }) => src);
}
