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
            begeEscuroPadrao: "#DCD7CE",
            begeClaroPadrao: "#DFDAD0",
            brancoEscurecido: "#FAFAFA",
         },
         fontSize: {
            fontcard1: "1.6rem",
         },
         fontFamily: {
            inter: "Inter",
            montserrat: "Montserrat",
         },
         screens: {
            '2md': '920px',
         },
      },
   },
   plugins: [],
} satisfies Config;
