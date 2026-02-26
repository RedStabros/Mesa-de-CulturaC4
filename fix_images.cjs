const fs = require('fs');
const path = require('path');

const profilesDir = path.join(__dirname, 'src', 'content', 'profiles');

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            walkDir(fullPath);
        } else if (file.endsWith('.md') || file.endsWith('.mdx')) {
            cleanBadImagesFromDocs(fullPath);
        } else if (file.endsWith('.jpg') || file.endsWith('.png') || file.endsWith('.jpeg')) {
            if (stat.size < 1024) {
                const content = fs.readFileSync(fullPath, 'utf8');
                if (content.includes('Error. Page cannot be displayed')) {
                    fs.unlinkSync(fullPath);
                    console.log(`Deleted corrupted image: ${file}`);
                }
            }
        }
    }
}

function cleanBadImagesFromDocs(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    // Remove markdown image syntax that points to images/
    const imageRegex = /!\[.*?\]\(images\/[^\)]+\)/g;
    let newContent = content.replace(imageRegex, '<!-- Imagen original no se pudo descargar del servidor local -->');

    if (content !== newContent) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`Cleaned image refernce in: ${filePath}`);
    }
}

walkDir(profilesDir);
console.log('Image Cleanup finished.');
