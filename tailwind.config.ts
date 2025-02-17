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
            begepadrao: "#DFDAD0",
            cinzaNeutro: "#BCBCBC",
         },
         fontSize: {
            fontcard1: "1.6rem",
           
         },
         fontFamily: {
            inter: "Inter",
         },
      },
   },
   plugins: [],
} satisfies Config;
