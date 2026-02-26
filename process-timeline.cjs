const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync('timeline_data_v2.json', 'utf8'));

const targetDir = 'src/content/timeline';
if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

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
    '2020 - 2010': { title: '2010 - 2020', date: '2010-01-01', id: '2010-2020', img: 'Estampilla-min.png' },
    'actualidad': { title: 'Actualidad', date: '2023-01-01', id: 'actualidad', img: 'actualidad.png' }
};

for (const [key, info] of Object.entries(decadeMapping)) {
    // Some decades didn't have data in the snapshot but we need the files to exist
    let markdownContent = `---
title: "${info.title}"
date: ${info.date}
coverImage: "/wp-content/uploads/2025/03/${info.img}"
---

`;

    let contentText = "Aún estamos recopilando las historias de esta época para nuestra Comuna 4.";

    // Use our hardcoded discovered text from softsql_v2 for perfect matching
    if (key === 'Antes de 1900') contentText = `### Vida Religiosa en Aranjuez\nHasta hace muy poco en Antioquia se decía que el pueblo era católico, apostólico y antioqueño. Pero en la época colonial el clero de Antioquia no fue muy acaudalado, ni tan próspero como en otras localidades virreinales.`;

    if (key === '1920 - 1910') contentText = `### Detrás de un gran hombre, hay una gran mujer: Giuliana Scalaberni\nGiuliana Scalaberni, era la esposa de Pedro Nel Gómez, quien fue una de las mujeres que impulsó junto a su esposo, el arte y la cultura de la comuna 4, Aranjuez. Según cuentan en la casa museo Pedro Nel, "fue inquebrantable gestora de la Casa Museo, acompañante tenaz en el proceso creativo del artista y en la consolidación de sus ideas políticas y sociales, además de consejera permanente, modelo, musa, esposa y madre indeclinable."`;

    if (key === '1940 - 1930') contentText = `### Parque Alfonso López Pumarejo y Templo San Nicolas de Tolentino\nEl parque de Aranjuez Berlín se llama Parque Alfonso López Pumarejo, que fue Presidente de Colombia en dos periodos, el primero del año 1934-a 1938 y el segundo del año 1942-1945. El parque tuvo un busto del Presidente, pero en el año de 1948 hordas conservadoras lo tumbaron en un acto de fanatismo político.`;

    if (key === '1950 - 1940') contentText = `### Templo El Calvario\nCon una donación de 50.000 pesos hecha por el señor Carlos Peláez, se inició la construcción del templo actual. Se pretendía hacer algo similar a la catedral Metropolitana con sus dos torres estilo románico, pero la humedad del terreno no permitió esa construcción, puesto que su peso no resistiría. Por eso sólo se construyó una sola torre en el centro para hacerla más liviana. El nivel freático de las laderas hacía pantanosa la zona.`;

    if (key === '1960 - 1950') contentText = `### Un rinconcito de la memoria en la BPP - Filial Juan Zuleta Ferrer\nLa Biblioteca Pública Piloto de Medellín para América Latina fue fundada en 1952 gracias a un convenio celebrado entre la Organización de las Naciones Unidas para la Educación, la Ciencia y la Cultura (UNESCO) y el gobierno de Colombia. Es una de las experiencias que se proyectaron como modelo de bibliotecas de escasos recursos en África, India y América Latina.`;

    if (key === '1970 - 1960') contentText = `### Victoria contra la enfermedad, la ignorancia y la miseria\nPedro Nel Gómez es uno de los artistas más destacados de Colombia, con una obra que ha despertado grandes polémicas en la historia del arte colombiano del siglo XX. Sus opiniones estéticas e ideológicas, junto con su personalidad, han sido motivo de enconadas controversias, elogiosas simpatías y cáusticas disensiones. Sin duda fue el artista más controvertido del siglo pasado.`;

    if (key === '1980 - 1970') contentText = `### Heroína Córdoba y el Jardín Infantil Balancines\nHeroína Córdoba nació el 19 de abril de 1955 y llegó a Moravia con su madre Virgelina y sus hermanos en el año de 1960. Para 1958 su abuela materna ya hacía parte de los pequeños asentamientos que luego conformarían este legendario barrio de la Comuna 4 – Aranjuez y que para ese entonces se reducía a ocho casas.`;

    if (key === '1990 - 1980') contentText = `### Asceneth Restrepo Maya: Partera y matrona\nAsceneth Restrepo Maya (Yalí – 1939, Medellín – 2022). "Las parteras y los parteros asocian el cuidado con la capacidad de ser guardianes o cuidadores de la vida al prestarles atención a la concepción, los sobos e incluso curar a los niños y a las niñas del ‘mal de ojo’ y otras enfermedades vinculadas a sus creencias culturales", cuenta María Silenia Villalobos Quevedo, magíster en Estudios de Género de la UNAL Sede Bogotá. Quizás el término de “partería” no sea muy conocido para usted.`;

    markdownContent += contentText;

    const filePath = path.join(targetDir, info.id + '.md');
    fs.writeFileSync(filePath, markdownContent, 'utf8');
}
console.log('Markdown generated successfully with proper image paths!');
