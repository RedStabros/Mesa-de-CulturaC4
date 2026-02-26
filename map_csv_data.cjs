const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, '1-Caracterizacion-Sector-Artistico-y-Cultural-C4-2026-02-26.csv');
const profilesDir = path.join(__dirname, 'src', 'content', 'profiles');

function parseCSVLine(line) {
    const fields = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"' && line[i + 1] === '"') {
            current += '"';
            i++;
        } else if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ';' && !inQuotes) {
            fields.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    fields.push(current);
    return fields;
}

function processCSV() {
    const csvData = fs.readFileSync(csvPath, 'utf8');
    const lines = csvData.split('\n');
    let updatedCount = 0;

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const fields = parseCSVLine(line);
        if (fields.length < 2) continue;

        const logoHtml = fields[0];
        const nameHtml = fields[1];

        // Extract Image URL
        const imgMatch = logoHtml.match(/src="([^"]+)"/);
        let imgUrl = imgMatch ? imgMatch[1] : '';
        if (imgUrl) {
            // Convert to relative path
            imgUrl = imgUrl.replace(/^https?:\/\/[^\/]+/, '');
        }

        // Extract Name
        const nameMatch = nameHtml.match(/>([^<]+)<\/a>/);
        let name = nameMatch ? nameMatch[1].trim() : nameHtml.trim().replace(/"/g, '');

        if (!name) continue;

        // Let's normalize name to try and find the file
        const normalName = name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').trim();

        // Search in content/profiles
        const files = fs.readdirSync(profilesDir);
        let matchedFile = null;

        for (const file of files) {
            if (file === normalName || file.includes(normalName) || normalName.includes(file)) {
                matchedFile = path.join(profilesDir, file, 'index.md');
                if (fs.existsSync(matchedFile)) break;

                matchedFile = path.join(profilesDir, `${file}.md`);
                if (fs.existsSync(matchedFile)) break;

                matchedFile = null;
            }
        }

        if (matchedFile && imgUrl) {
            let mdContent = fs.readFileSync(matchedFile, 'utf8');
            if (mdContent.includes('coverImage:')) continue; // Already has it

            // Add to frontmatter
            mdContent = mdContent.replace(/^---\r?\n/m, `---\ncoverImage: "${imgUrl}"\n`);
            fs.writeFileSync(matchedFile, mdContent);
            console.log(`Updated: ${name} with image ${imgUrl}`);
            updatedCount++;
        } else if (!matchedFile) {
            console.log(`Could not find markdown for: ${name} (normalized: ${normalName})`);
        }
    }
    console.log(`Successfully updated ${updatedCount} profiles with images.`);
}

processCSV();
