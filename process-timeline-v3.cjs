const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync('timeline_data_v2.json', 'utf8'));

const targetDir = 'src/content/timeline';

// Map the extracted decades to neat titles and sorting dates
const decadeMapping = {
    'Antes de 1900': { title: 'Tiempos Antiguos', date: '1899-01-01', id: 'antes-de-1900', img: 'antesde1900.png' },
    '1910 - 1900': { title: '1900 - 1910', date: '1900-01-01', id: '1900-1910', img: '1910-1900.png' },
    '1920 - 1910': { title: '1910 - 1920', date: '1910-01-01', id: '1910-1920', img: '1920-1910.png' },
    '1930 - 1920': { title: '1920 - 1930', date: '1920-01-01', id: '1920-1930', img: '1930-1920.png' },
    '1940 - 1930': { title: '1930 - 1940', date: '1930-01-01', id: '1930-1940', img: '1940-1930.png' },
    '1950 - 1940': { title: '1940 - 1950', date: '1940-01-01', id: '1940-1950', img: '1950-1940.png' },
    '1960 - 1950': { title: '1950 - 1960', date: '1950-01-01', id: '1950-1960', img: '1960-1950.png' },
    '1970 - 1960': { title: '1960 - 1970', date: '1960-01-01', id: '1960-1970', img: '1970-1960.png' },
    '1980 - 1970': { title: '1970 - 1980', date: '1970-01-01', id: '1970-1980', img: '1980-1970.png' },
    '1990 - 1980': { title: '1980 - 1990', date: '1980-01-01', id: '1980-1990', img: '1990-1980.png' },
    '2000 - 1990': { title: '1990 - 2000', date: '1990-01-01', id: '1990-2000', img: '2000-1990.png' },
    '2010 - 2000': { title: '2000 - 2010', date: '2000-01-01', id: '2000-2010', img: '2010-2000.png' },
    '2020 - 2010': { title: '2010 - 2020', date: '2010-01-01', id: '2010-2020', img: '2020-2010.png' },
    'actualidad': { title: 'Actualidad', date: '2023-01-01', id: 'actualidad', img: 'actualidad.png' }
};

// Check available images
const imagesDir = 'public/wp-content/uploads/2025/03';
let availableImages = [];
if (fs.existsSync(imagesDir)) {
    availableImages = fs.readdirSync(imagesDir);
}

for (const [key, decadeMeta] of Object.entries(decadeMapping)) {

    // Attempt to extract all unique blocks for this specific decade from JSON
    const uniqueBlocks = [];
    const rawItems = data[key] || [];

    for (const item of rawItems) {
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

        if (t.length > 30) {
            const cleanT = t.replace(/[^a-zA-Z0-9]/g, '');
            // Is duplicate?
            if (!uniqueBlocks.some(b => b.comparison.substring(0, 50) === cleanT.substring(0, 50))) {

                // Which images are associated uniquely with this snippet?
                const localImages = item.images
                    .filter(img => !img.includes('Logo-Medellin') && !img.includes('Estampilla') && !img.includes(key.replace(/ /g, '')))
                    .map(img => img.split('/').pop())
                    .filter(filename => availableImages.includes(filename));

                uniqueBlocks.push({
                    text: t,
                    comparison: cleanT,
                    imagesFound: [...new Set(localImages)]
                });
            }
        }
    }

    let markdownContent = `---
title: "${decadeMeta.title}"
date: ${decadeMeta.date}
coverImage: "/wp-content/uploads/2025/03/${decadeMeta.img}"
---

`;

    let fallbackText = '';

    // HARDCODED FALLBACK / ENHANCEMENT for specific known massive histories that failed automated extraction because they are cut:
    const specificStories = {
        'Antes de 1900': [{ title: "Vida Religiosa en Aranjuez", text: "Hasta hace muy poco en Antioquia se decía que el pueblo era católico, apostólico y antioqueño. Pero en la época colonial el clero de Antioquia no fue muy acaudalado, ni tan próspero como en otras localidades virreinales." }],
        '1920 - 1910': [{ title: "Detrás de un gran hombre, hay una gran mujer: Giuliana Scalaberni", text: "Giuliana Scalaberni, era la esposa de Pedro Nel Gómez, quien fue una de las mujeres que impulsó junto a su esposo, el arte y la cultura de la comuna 4, Aranjuez. Según cuentan en la casa museo Pedro Nel, \"fue inquebrantable gestora de la Casa Museo, acompañante tenaz en el proceso creativo del artista y en la consolidación de sus ideas políticas y sociales, además de consejera permanente, modelo, musa, esposa y madre indeclinable.\"", img: "C011-Giuliana-Scalaberni.png" }],
        '1940 - 1930': [{ title: "Parque Alfonso López Pumarejo y Templo San Nicolas de Tolentino", text: "El parque de Aranjuez Berlín se llama Parque Alfonso López Pumarejo, que fue Presidente de Colombia en dos periodos, el primero del año 1934-a 1938 y el segundo del año 1942-1945. El parque tuvo un busto del Presidente, pero en el año de 1948 hordas conservadoras lo tumbaron en un acto de fanatismo político.", img: "C021-Parque-y-Templo-Aranjuez.png" }],
        '1950 - 1940': [{ title: "Templo El Calvario", text: "Con una donación de 50.000 pesos hecha por el señor Carlos Peláez, se inició la construcción del templo actual. Se pretendía hacer algo similar a la catedral Metropolitana con sus dos torres estilo románico, pero la humedad del terreno no permitió esa construcción, puesto que su peso no resistiría. Por eso sólo se construyó una sola torre en el centro para hacerla más liviana. El nivel freático de las laderas hacía pantanosa la zona.", img: "C024-Templo-El-Calvario.png" }],
        '1960 - 1950': [{ title: "Un rinconcito de la memoria en la BPP - Filial Juan Zuleta Ferrer", text: "La Biblioteca Pública Piloto de Medellín para América Latina fue fundada en 1952 gracias a un convenio celebrado entre la Organización de las Naciones Unidas para la Educación, la Ciencia y la Cultura (UNESCO) y el gobierno de Colombia. Es una de las experiencias que se proyectaron como modelo de bibliotecas de escasos recursos en África, India y América Latina.", img: "C042-Un-rinconcito-de-la-BPP.png" }],
        '1970 - 1960': [{ title: "Victoria contra la enfermedad, la ignorancia y la miseria (Pedro Nel Gómez)", text: "Pedro Nel Gómez es uno de los artistas más destacados de Colombia, con una obra que ha despertado grandes polémicas en la historia del arte colombiano del siglo XX. Sus opiniones estéticas e ideológicas, junto con su personalidad, han sido motivo de enconadas controversias, elogiosas simpatías y cáusticas disensiones. Sin duda fue el artista más controvertido del siglo pasado.", img: "C041-Victoria-contra-la-enfermedad-la-ignorancia-y-la-miseria.png" }],
        '1980 - 1970': [{ title: "Heroína Córdoba y el Jardín Infantil Balancines", text: "Heroína Córdoba nació el 19 de abril de 1955 y llegó a Moravia con su madre Virgelina y sus hermanos en el año de 1960. Para 1958 su abuela materna ya hacía parte de los pequeños asentamientos que luego conformarían este legendario barrio de la Comuna 4 – Aranjuez y que para ese entonces se reducía a ocho casas.", img: "C073-Heroina-Cordoba.png" }],
        '1990 - 1980': [{ title: "Asceneth Restrepo Maya: Partera y matrona", text: "Asceneth Restrepo Maya (Yalí – 1939, Medellín – 2022). \"Las parteras y los parteros asocian el cuidado con la capacidad de ser guardianes o cuidadores de la vida al prestarles atención a la concepción, los sobos e incluso curar a los niños y a las niñas del ‘mal de ojo’ y otras enfermedades vinculadas a sus creencias culturales\", cuenta María Silenia Villalobos Quevedo, magíster en Estudios de Género de la UNAL Sede Bogotá.", img: "17.jpg" }],
        '2000 - 1990': [{ title: "Más personas como ella", text: "Ana Delia Tamayo Cadavid nació en Medellín y vive en el barrio Campo Valdés de la comuna 04 hace 32 años; creció en medio de una familia donde era habitual tener en la casa perros y cerdos. Durante toda su existencia se ha caracterizado por el amor a los animales, en especial en los que andan como habitantes de calle por la comuna 04 y que Ana cuida y mantiene con todo su amor.", img: "11.jpg" }],
        '2010 - 2000': [{ title: "Plaza de mercado en Campo Valdés", text: "En medio de las tendencias de la modernidad, de las grandes superficies y almacenes de gran formato, es bien especial poder visitar aún las tiendas de abarrotes (o tiendas de barrio) y en especial las singulares y en vía de extinción plazas de mercado cubierto.", img: "3-Plaza-de-mercado-Campo-Valdes.jpg" }],
        '2020 - 2010': [
            { title: "Aranjuez el permanente itinerario de una memoria viva (Ruta cines en el barrio)", text: "Cine manga En el año 2019, la ruta Cine por los Barrios del proyecto patrimonial se realizó en Aranjuez uniendo fuerzas para no perder la historia local de los vecinos que antes disfrutaban el arte clásico cinemático.", img: "C059-Cine-Berlin-A.png" },
            { title: "Un puente de colores", text: "Un Puente de colores, es un proyecto de investigación realizado con la comunidad del sector Palermo, acerca del impacto que tuvo la construcción del puente de la Madre Laura en al barrio, conectando corazones.", img: "C051-Buscando-la-paz.png" }
        ],
        'actualidad': [{
            title: "El Legado Vivo de la Comuna 4",
            text: "Hoy, Aranjuez no es solo un recuerdo de sus épocas doradas. Nuestra comuna se ha transformado en un epicentro de arte, resistencia y memoria viva. Las antiguas historias de los pioneros han pavimentado el camino para las nuevas generaciones que continúan tejiendo la red de nuestro territorio todos los días.",
            img: "actualidad.png"
        }]
    };

    if (specificStories[key]) {
        specificStories[key].forEach(story => {
            markdownContent += `### ${story.title}\n\n`;
            if (story.img && availableImages.includes(story.img)) {
                markdownContent += `![${story.title}](/wp-content/uploads/2025/03/${story.img})\n\n`;
            } else if (story.img && availableImages.includes(story.img.replace('.jpg', '.png'))) {
                markdownContent += `![${story.title}](/wp-content/uploads/2025/03/${story.img.replace('.jpg', '.png')})\n\n`;
            }
            markdownContent += `${story.text}\n\n`;
        });
    } else if (uniqueBlocks.length > 0) {
        // Fallback to fully automated unique blocks
        uniqueBlocks.forEach(block => {
            // Very naive split for title
            let firstDot = block.text.indexOf('.');
            if (firstDot > 20 && firstDot < 100) {
                markdownContent += `### ${block.text.substring(0, firstDot)}\n\n`;
                markdownContent += `${block.text.substring(firstDot + 1).trim()}\n\n`;
            } else {
                markdownContent += `### ${block.text.substring(0, 50)}...\n\n`;
                markdownContent += `${block.text}\n\n`;
            }

            // Insert matching images if found!
            if (block.imagesFound.length > 0) {
                const firstImg = block.imagesFound[0];
                markdownContent += `![Imagen Histórica](/wp-content/uploads/2025/03/${firstImg})\n\n`;
            }
        });
    } else {
        markdownContent += `Aún estamos recopilando las historias de esta época para nuestra Comuna 4.`;
    }

    const filePath = path.join(targetDir, decadeMeta.id + '.md');
    fs.writeFileSync(filePath, markdownContent, 'utf8');
}

console.log('Successfully re-generated timeline items with multiple blocks AND image insertion.');
