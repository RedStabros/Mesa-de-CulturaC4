/** @type {import('tailwindcss').Config} */
import typography from '@tailwindcss/typography';

export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    theme: {
        extend: {
            colors: {
                primary: "#005f89", // Deep blue from reference
                secondary: "#fbbf24", // Vibrant yellow from text
                "accent-olive": "#a39e6a", // Olive/gold from reference background
                "background-light": "#f8f9fa",
                "background-dark": "#1a202c",
                "surface-dark": "#2d3748",
            },
            fontFamily: {
                display: ["Montserrat", "sans-serif"],
                body: ["Open Sans", "sans-serif"],
            },
        },
    },
    plugins: [
        typography,
    ],
}
