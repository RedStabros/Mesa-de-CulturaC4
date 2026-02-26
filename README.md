# Agenda Cultural Comuna 4 - Website

Plataforma oficial desarrollada en **Astro** y **Tailwind CSS** para gestionar y visualizar la biblioteca de perfiles culturales, la línea temporal histórica y el componente de la Memoria Itinerante de la Comuna 4 - Aranjuez.

## ⚠️ Instrucciones Críticas para Agentes IA
Si eres un agente IA colaborando en este u otro chat:
**DEBES LEER el archivo `AGENT_INSTRUCTIONS.md` en la raíz de este proyecto ANTES de escribir código, modificar layouts o agregar galerías.** Este archivo contiene los secretos arquitectónicos y de estilo del proyecto. No inventes componentes, utiliza la librería `fslightbox` estandarizada tal como se detalla en dicha guía.

## Comandos Principales (NPM)

| Comando                   | Acción                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Instala dependencias necesarias                  |
| `npm run dev`             | Inicia el servidor de desarrollo (`localhost:4321`) |
| `npm run build`           | Compila el sitio para producción en `./dist/`    |

## Estructura de Contenido

- `/src/content/profiles:` Ficheros Markdown que se muestran en "Base de Datos C4".
- `/src/content/timeline:` Era de la línea de tiempo.
- `/public/wp-content/`: Archivos multimedia estáticos preservados.
