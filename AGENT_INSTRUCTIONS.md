# Mesa de Cultura C4 - Development & AI Agent Guide

**CRITICAL WARNING FOR AI AGENTS:** 
DO NOT modify the core layout or establish new design systems. Read this document CAREFULLY before creating new pages or editing existing structures.

## 1. Global Architecture
- **Framework**: Astro (SSG/SSR optimized).
- **Styling**: Tailwind CSS. The primary UI relies on the `@tailwindcss/typography` plugin (`prose` classes) for markdown and deep custom utility classes for backgrounds.
- **Base Layout**: ALL new pages MUST use `<Layout title="Your Title">` imported from `../../../layouts/Layout.astro`.

## 2. Creating New Pages
When you are asked to create a new page, follow this exact structure to maintain the glassmorphism and premium aesthetic:

```astro
---
import Layout from '../layouts/Layout.astro';
---

<Layout title="Nombre de la Página">
    <div class="max-w-7xl mx-auto py-8 lg:py-12">
        <article class="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm shadow-xl rounded-2xl p-8 md:p-12 mb-8 border border-gray-100 dark:border-gray-700 prose prose-lg dark:prose-invert max-w-none prose-headings:text-primary dark:prose-headings:text-blue-400 prose-a:text-primary hover:prose-a:text-blue-700">
            <h1>Título de la Sección</h1>
            <p>Contenido principal...</p>
        </article>
    </div>
</Layout>
```

## 3. Creating New Galleries
Do NOT create custom modal logic or external libraries for galleries. The project uses `fslightbox`.

**To create a standard gallery grid:**
```astro
<!-- 1. Include this array of image paths in the frontmatter -->
<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {imagesArray.map((imgSrc, index) => (
        <div class="aspect-square w-full rounded-xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 relative group bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <!-- 2. The critical fslightbox anchor -->
            <a data-fslightbox="unique-gallery-name" href={imgSrc} class="w-full h-full block cursor-zoom-in">
                <img 
                    src={imgSrc} 
                    alt={`Image ${index + 1}`} 
                    class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                />
                <div class="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 dark:group-hover:bg-black/40 transition-colors duration-300 pointer-events-none"></div>
            </a>
        </div>
    ))}
</div>
```

**For massive galleries (100+ photos):**
Use the masonry layout paradigm found in `src/pages/memoria-itinerante/galeria-completa.astro`. Do not load them in the primary landing pages to avoid DOM bloat. Use Astro's `fs` to dynamically read them from the `./public/wp-content/gallery/` folders.

## 4. Typography & Colors
- **Fonts**: `font-display` for headers, `font-body` for texts. **Never use `font-serif`**.
- **Colors**: Rely on Tailwind classes `text-primary`, `bg-primary`, `text-secondary`, `bg-secondary`. Avoid hardcoded hex colors unless absolutely necessary.

## 5. Contact Envelopes
Do NOT expose raw emails like `info@...`. Always obfuscate them visually while keeping the `mailto:designmesac4@gmail.com` href.

Failure to follow these protocols will result in a degraded user experience and broken UI cohesion.
