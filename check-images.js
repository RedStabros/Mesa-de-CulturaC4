const fs = require('fs');
const path = require('path');
const csv = require('fs'); // Just read as string

const profilesDir = path.join(__dirname, 'src', 'content', 'profiles');
const dirs = fs.readdirSync(profilesDir);
const missingImages = [];

for (const dir of dirs) {
    const indexFile = path.join(profilesDir, dir, 'index.md');
    if (fs.existsSync(indexFile)) {
        const content = fs.readFileSync(indexFile, 'utf8');
        const imageMatch = content.match(/coverImage:\s*(.*)\r?\n/);
        if (!imageMatch || !imageMatch[1] || imageMatch[1] === '""' || imageMatch[1] === "''") {
            missingImages.push(dir);
        }
    }
}

console.log('Perfiles sin coverImage o vacia: ' + missingImages.length);
console.log(missingImages.join('\n'));

// Now cross reference with CSV
const csvFile = path.join(__dirname, '1-Caracterizacion-Sector-Artistico-y-Cultural-C4-2026-02-26.csv');
const csvContent = fs.readFileSync(csvFile, 'utf8');
const lines = csvContent.split('\n');
console.log('\n--- Buscando en el CSV ---');

const missingWithURLs = [];
for (const missing of missingImages) {
    // Try to find the missing dir name fuzzy in the CSV line
    const matchStr = missing.replace(/-/g, ' ').toLowerCase();

    for (const line of lines) {
        if (line.toLowerCase().includes(matchStr.substring(0, 5))) {
            // Look for a URL that ends in jpg/png/jpeg near the end of the line
            const urlMatch = line.match(/https?:\/\/[^\s]+?\.(jpg|jpeg|png|webp)/i);
            if (urlMatch) {
                missingWithURLs.push(`${missing} => Encontrado URL en CSV: ${urlMatch[0]}`);
                break;
            }
        }
    }
}

console.log('Resultados de cruce de URL:');
console.log(missingWithURLs.join('\n'));
