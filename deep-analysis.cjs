const fs = require('fs');

const data = JSON.parse(fs.readFileSync('timeline_data_v2.json', 'utf8'));

let output = '--- DEEP ANALYSIS OF DECADES ---\n';
let totalRecovered = 0;

for (const [decade, items] of Object.entries(data)) {
    if (!items || items.length === 0) continue;

    // We want to find all unique content blocks within this decade.
    const uniqueBlocks = [];

    for (const item of items) {
        if (item.snippet.includes('¡Aún no tenemos historias para esta década!')) continue;
        if (item.snippet.includes('Politica de privacidad')) continue;

        let t = item.snippet;
        // Basic cleanup
        t = t.replace(/<[^>]*>?/gm, ''); // Remove tags
        t = t.replace(/\\n/g, '\n').replace(/\s+/g, ' '); // Fix spaces

        // Find actual content
        // Try multiple markers usually before content
        let startIdx = t.indexOf('Anterior');
        if (startIdx !== -1) t = t.substring(startIdx + 8);
        else {
            // Remove some visual builder junk if "Anterior" is not there
            t = t.replace(/.*?\s+([^a-z0-9\-\=_"']{10,})/i, '$1');
            // the text before the actual title is usually CSS/HTML attributes
        }

        // Let's grab everything before "Leer más"
        let leerMasIdx = t.indexOf('Leer más');
        if (leerMasIdx !== -1) {
            t = t.substring(0, leerMasIdx);
        }
        t = t.trim();

        if (t.length > 30) {
            // The first sentence often is the title. Let's just find uniqueness.
            // Check if we already have this text to avoid duplicates (the SQL has many revisions of the same post)
            // Just check the first 50 chars to avoid slight revision differences
            const cleanT = t.replace(/[^a-zA-Z0-9]/g, '');
            const isDuplicate = uniqueBlocks.some(b => b.comparison.substring(0, 50) === cleanT.substring(0, 50));

            if (!isDuplicate) {
                // Collect images associated with this snippet
                const localImages = item.images.filter(img => !img.includes('Logo-Medellin') && !img.includes('Estampilla') && !img.includes(decade.replace(/ /g, '')));
                uniqueBlocks.push({
                    text: t,
                    comparison: cleanT,
                    imagesFound: localImages
                });
            }
        }
    }

    if (uniqueBlocks.length > 0) {
        output += `\n\n📌 DECADE: ${decade}\n`;
        output += `Found ${uniqueBlocks.length} unique text block(s).\n`;

        uniqueBlocks.forEach((block, idx) => {
            output += `\n  --- Block ${idx + 1} ---\n`;
            // Limit text preview to 200 chars to avoid huge file
            output += `  TEXT PREVIEW: ${block.text.substring(0, 200).replace(/\n/g, ' ')}...\n`;

            const uniqueImages = [...new Set(block.imagesFound)];
            if (uniqueImages.length > 0) {
                output += `  ASSOCIATED IMAGES:\n`;
                uniqueImages.forEach(img => {
                    const filename = img.split('/').pop();
                    output += `    - ${filename}\n`;
                });
            } else {
                output += '  [No specific associated images found in this snippet]\n';
            }
        });
        totalRecovered += uniqueBlocks.length;
    }
}

output += `\n=> Total Unique Historical Blocks Recovered: ${totalRecovered}\n`;
fs.writeFileSync('deep-analysis.txt', output, 'utf8');
