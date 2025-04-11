"use client";

import { useEffect } from "react";

declare module "react" {
   interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
      vw?: string;
      "vw-access-button"?: string;
      "vw-plugin-wrapper"?: string;
   }
}

export default function VLibras() {
   useEffect(() => {
      const script = document.createElement("script");
      script.src = "https://vlibras.gov.br/app/vlibras-plugin.js";
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
         // @ts-ignore
         if (window.VLibras && window.VLibras.Widget) {
            // @ts-ignore
            new window.VLibras.Widget("https://vlibras.gov.br/app");
         }
      };

      return () => {
         const vlibrasElements = document.querySelectorAll('[vw], [vw-access-button], [vw-plugin-wrapper]');
         vlibrasElements.forEach(element => element.remove());
         document.body.removeChild(script);
      };
   }, []);

   return (
      <div vw="true" className="enabled">
         <div vw-access-button="true" className="active"></div>
         <div vw-plugin-wrapper="true">
            <div className="vw-plugin-top-wrapper"></div>
         </div>
      </div>
   );
}
 