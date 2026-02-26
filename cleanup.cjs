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
            cleanFile(fullPath);
        }
    }
}

function cleanFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Remove WordPress shortcodes like \[ngg ... \] or \[table ... \] or \[something \]
    // Note: the exporter sometimes escapes the brackets as \[ and \]
    const regex = /\\?\[.*?\\?\]/g;

    // We need to be careful not to remove Markdown links [text](url) or images ![alt](url)
    // But shortcodes usually stand alone or have specific plugins (ngg, tablepress)
    // Let's target specific known shortcodes from the output to be safe.

    const safeRegex = /\\?\[(ngg|tablepress[^\]]*)\\?\]/g;

    let newContent = content.replace(safeRegex, '');

    // Also clean up any escaped brackets that are empty or have stray shortcode attributes 
    // like \[ngg src="galleries" ids="29" display="basic\_thumbnail" thumbnail\_crop="0"\]
    const specificRegex = /\\?\[(ngg|tablepress).*?\\?\]/g;
    newContent = newContent.replace(specificRegex, '');

    if (content !== newContent) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`Cleaned: ${filePath}`);
    }
}

walkDir(profilesDir);
console.log('Cleanup finished.');
