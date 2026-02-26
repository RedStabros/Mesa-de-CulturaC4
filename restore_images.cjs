const fs = require('fs');
const path = require('path');

const originalOutputDir = path.join(__dirname, 'output', 'pages');
const contentDir = path.join(__dirname, 'src', 'content', 'profiles');

function findUploadPath(imageFilename) {
    // recursively search public/wp-content
    function searchForImage(dir) {
        if (!fs.existsSync(dir)) return null;
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const p = path.join(dir, file);
            if (fs.statSync(p).isDirectory()) {
                const found = searchForImage(p);
                if (found) return found;
            } else if (file === imageFilename) {
                return p;
            }
        }
        return null;
    }
    const uploadsRes = searchForImage(path.join(__dirname, 'public', 'wp-content', 'uploads'));
    if (uploadsRes) return uploadsRes.split('public')[1].replace(/\\/g, '/');

    const galleryRes = searchForImage(path.join(__dirname, 'public', 'wp-content', 'gallery'));
    if (galleryRes) return galleryRes.split('public')[1].replace(/\\/g, '/');

    return null;
}

function processProfile(profileName) {
    const mdPath = path.join(contentDir, profileName, 'index.md');
    if (!fs.existsSync(mdPath)) return;

    let originalMdPath = path.join(originalOutputDir, '2025', profileName, 'index.md');
    if (!fs.existsSync(originalMdPath)) {
        originalMdPath = path.join(originalOutputDir, '2023', profileName, 'index.md');
    }
    if (!fs.existsSync(originalMdPath)) return;

    const originalContent = fs.readFileSync(originalMdPath, 'utf8');
    const match = originalContent.match(/!\[.*?\]\(images\/([^\)]+)\)/);

    if (match && match[1]) {
        const publicPath = findUploadPath(match[1]);
        if (publicPath) {
            let content = fs.readFileSync(mdPath, 'utf8');
            // prepend image right after H1
            if (!content.includes(publicPath)) {
                content = content.replace(/(# .*?\n)/, `$1\n![](${publicPath})\n`);
                fs.writeFileSync(mdPath, content, 'utf8');
                console.log(`Re-injected image for ${profileName}: ${publicPath}`);
            }
        } else {
            console.log(`Missing image in public for: ${match[1]}`);
        }
    }
}

fs.readdirSync(contentDir).forEach(profileName => {
    if (fs.statSync(path.join(contentDir, profileName)).isDirectory()) {
        processProfile(profileName);
    }
});
