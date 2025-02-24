import { useState } from "react";

export default function Heart({ favorited, height, width, dark }) {
   const [color] = useState(
      favorited ? (dark ? "#FAFAFA" : "#702632") : "transparent"
   );

   const [stroke] = useState(dark ? "#FAFAFA" : "#702632");

   return (
      <div data-svg-wrapper className="relative">
         <svg
            width={width}
            height={height}
            viewBox="0 0 23 21"
            fill={color} // Preenchimento do ícone
            xmlns="http://www.w3.org/2000/svg"
         >
            <path
               d="M11.5263 20.3158L10 18.9263C4.57895 14.0105 1 10.7684 1 6.78947C1 3.54737 3.54737 1 6.78947 1C8.62105 1 10.3789 1.85263 11.5263 3.2C12.6737 1.85263 14.4316 1 16.2632 1C19.5053 1 22.0526 3.54737 22.0526 6.78947C22.0526 10.7684 18.4737 14.0105 13.0526 18.9368L11.5263 20.3158Z"
               fill={color} // Preenchimento da parte interna do coração
            />
            <path
               d="M16.675 0C14.674 0 12.7535 0.926976 11.5 2.39183C10.2465 0.926976 8.326 0 6.325 0C2.783 0 0 2.76948 0 6.29428C0 10.6202 3.91 14.145 9.8325 19.5008L11.5 21L13.1675 19.4894C19.09 14.145 23 10.6202 23 6.29428C23 2.76948 20.217 0 16.675 0ZM11.615 17.7956L11.5 17.9101L11.385 17.7956C5.911 12.8632 2.3 9.60164 2.3 6.29428C2.3 4.00545 4.025 2.28883 6.325 2.28883C8.096 2.28883 9.821 3.4218 10.4305 4.98965H12.581C13.179 3.4218 14.904 2.28883 16.675 2.28883C18.975 2.28883 20.7 4.00545 20.7 6.29428C20.7 9.60164 17.089 12.8632 11.615 17.7956Z"
               fill={stroke} // Preenchimento do contorno (cor do contorno)
            />
         </svg>
      </div>
   );
}
