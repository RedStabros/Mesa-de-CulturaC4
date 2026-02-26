const fs = require('fs');

const data = JSON.parse(fs.readFileSync('timeline_data_v2.json', 'utf8'));

let output = '# Historias Recuperadas Sin Asignar (Borradores Encontrados)\n\n';
output += 'Estos son fragmentos de texto reales encontrados en la base de datos `softsql_v2` que no fueron asignados automáticamente a la línea de tiempo principal, ya sea porque eran variaciones, borradores sueltos o su ubicación nos resultaba dudosa.\n\n---\n\n';

for (const [decade, items] of Object.entries(data)) {
    if (!items || items.length === 0) continue;

    const uniqueBlocks = [];

    for (const item of items) {
        if (item.snippet.includes('¡Aún no tenemos historias para esta década!')) continue;
        if (item.snippet.includes('Politica de privacidad')) continue;

        let t = item.snippet;
        t = t.replace(/<[^>]*>?/gm, '');
        t = t.replace(/\\n/g, '\n').replace(/\s+/g, ' ');

        let startIdx = t.indexOf('Anterior');
        if (startIdx !== -1) t = t.substring(startIdx + 8);
        else {
            t = t.replace(/.*?\s+([^a-z0-9\-\=_"']{10,})/i, '$1');
            t = t.replace(/^.*?position-relative">/i, '');
        }

        let leerMasIdx = t.indexOf('Leer más');
        if (leerMasIdx !== -1) t = t.substring(0, leerMasIdx);
        t = t.trim();

        if (t.length > 50) { // filter out small garbage chunks
            const cleanT = t.replace(/[^a-zA-Z0-9]/g, '');
            if (!uniqueBlocks.some(b => b.comparison.substring(0, 100) === cleanT.substring(0, 100))) {

                // Which images are associated uniquely with this snippet?
                const localImages = item.images
                    .filter(img => !img.includes('Logo-Medellin') && !img.includes('Estampilla') && !img.includes(decade.replace(/ /g, '')))
                    .map(img => img.split('/').pop());

                uniqueBlocks.push({
                    text: t,
                    comparison: cleanT,
                    imagesFound: [...new Set(localImages)]
                });
            }
        }
    }

    if (uniqueBlocks.length > 0) {
        uniqueBlocks.forEach((block, idx) => {
            // Exclude the ones we ALREADY hardcoded into the process-timeline-v3 script
            if (block.comparison.includes('HahaceumpocoenAntioquiasedecaqueelpuebloeracatlico')) return; // Antes de 1900
            if (block.comparison.includes('DetrsdeungranhombrehayunagranmujerGiulianaScalaberni')) return; // 1920
            if (block.comparison.includes('ElparquedeAranjuezBerlnsellamaParqueAlfonsoLpez')) return; // 1930
            if (block.comparison.includes('Conunadonacinde50000pesoshechaporelseorCarlosPel')) return; // 1940
            if (block.comparison.includes('LaBibliotecaPblicaPilotodeMedellnparaAmricaLatina')) return; // 1950
            if (block.comparison.includes('PedroNelGmezesunodelosartistasmsdestacadosdeColom')) return; // 1960
            if (block.comparison.includes('HeronaCrdobanaciel19deabrilde1955yllegaMoraviaconsu')) return; // 1970
            if (block.comparison.includes('1939Medelln2022Lasparterasylosparteros')) return; // 1980
            if (block.comparison.includes('AnaDeliaTamayoCadavidnacinMedelln')) return; // 1990
            if (block.comparison.includes('Enmediodelastendenciasdelamodernidad')) return; // 2000
            if (block.comparison.includes('CinemangaEnelao2019larutaCineporlos')) return; // 2010 A
            if (block.comparison.includes('puentedelaMadreLaura')) return; // 2010 B
            if (block.text.includes('INSERT INTO') || block.text.includes('char(32) DEFAULT NULL')) return; // database junk

            output += `### Posible Borrador / Variante encontrado en: [${decade}]\n\n`;

            if (block.imagesFound.length > 0) {
                output += `\n**Imágenes que estaban adjuntas cerca de este texto en la base de datos:** \n`;
                block.imagesFound.forEach(img => {
                    output += `- \`${img}\`\n`;
                });
            }

            output += `\n> ${block.text} \n\n---\n\n`;
        });
    }
}

const outputPath = 'src/pages/textos-recuperados.md';
fs.writeFileSync(outputPath, output, 'utf8');
console.log('Created markdown page with recovered unused texts');
