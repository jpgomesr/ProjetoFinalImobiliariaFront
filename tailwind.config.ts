import type { Config } from "tailwindcss";

export default {
   content: [
      "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
      "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
      "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
   ],
   theme: {
      extend: {
         colors: {
            background: "var(--background)",
            foreground: "var(--foreground)",
            havprincipal: "#702632",
            begepadrao: "#EDEDED",
            vermelhoHav: "#6D2631",
            cinzaNeutro: "#BCBCBC",
         },
         fontSize: {
            fontcard1: "1.6rem",
            padraoLg: "1rem",
            subtituloLg: "1.5rem",
            padraoMd: "0.875rem",
            subtitulolg: "1.5rem",
            mobilePadrao: "0.75rem"
         },
         fontFamily: {
            inter: "Inter",
         },
      },
   },
   plugins: [],
} satisfies Config;
