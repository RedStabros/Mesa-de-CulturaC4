const fs = require('fs');

const content = fs.readFileSync('D:/APP_development/Mesa_de_CulturaC4/softsql_v2.sql', 'utf8');

const targets = [
    'Antes de 1900', '1910 - 1900', '1910-1900', '1920 - 1910', '1920-1910',
    '1930 - 1920', '1930-1920', '1940 - 1930', '1940-1930', '1950 - 1940', '1950-1940',
    '1960 - 1950', '1960-1950', '1970 - 1960', '1970-1960', '1980 - 1970', '1980-1970',
    '1990 - 1980', '1990-1980', '2000 - 1990', '2000-1990', '2010 - 2000', '2010-2000',
    '2020 - 2010', '2020-2010', 'actualidad'
];

let res = {};

for (const t of targets) {
    let idx = 0;
    while ((idx = content.indexOf("'" + t + "'", idx)) !== -1) {

        const start = Math.max(0, idx - 8000);
        const end = Math.min(content.length, idx + 100);
        let chunk = content.substring(start, end);

        const images = chunk.match(/https?:\/\/[a-zA-Z0-9.\-\/_]+?\.(jpg|jpeg|png|webp)/gi) || [];
        const wpImages = chunk.match(/wp-content\/uploads\/[0-9]{4}\/[0-9]{2}\/[a-zA-Z0-9_\-.]+(jpg|jpeg|png|webp)/gi) || [];

        const allImgs = Array.from(new Set([...images, ...wpImages]));

        let words = chunk.substring(Math.max(0, chunk.length - 3000), chunk.length);
        words = words.replace(/\\r\\n/g, ' ').replace(/<[^>]+>/g, '');
        words = words.replace(/\\"/g, '"').replace(/\\\\/g, '\\');
        words = words.substring(words.length - 2000, words.length);

        if (allImgs.length > 0 || words.length > 50) {
            if (!res[t]) res[t] = [];
            res[t].push({ snippet: words.trim(), images: allImgs });
        }

        idx++;
    }
}
fs.writeFileSync('timeline_data_v2.json', JSON.stringify(res, null, 2), 'utf8');
console.log('Saved data to timeline_data_v2.json');
