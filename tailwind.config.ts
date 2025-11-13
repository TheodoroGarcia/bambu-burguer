import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/layout-provider/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Bambu Burger Brand Colors
        'bambu-brown': '#3C2F2F',
        'bambu-beige': '#E8DCC0', 
        'bambu-green': '#A3B18A',
        'bambu-green-dark': '#588157',
        'bambu-terracota': '#C67C48',
      },
    },
  },
  plugins: [],
} satisfies Config;