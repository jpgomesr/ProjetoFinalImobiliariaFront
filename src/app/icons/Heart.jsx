import { useEffect, useState } from "react";

function Heart({ favorited }) {
   const [color, setColor] = useState(favorited ? "#702632" : "transparent");
   const [stroke, setStroke] = useState(color == "transparent" ? "#000000" : "transparent")

   return (
      <svg
         xmlns="http://www.w3.org/2000/svg"
         width={30}
         height={30}
         viewBox="0 0 20 20"
      >
         <path
            fill={color}
            fillRule="evenodd"
            d="M10 5.722c1.69-3.023 7.5-1.968 7.5 2.4c0 2.918-2.5 5.582-7.5 7.993c-5-2.41-7.5-5.075-7.5-7.993c0-4.368 5.81-5.423 7.5-2.4Z"
            clipRule="evenodd"
            strokeWidth={0.5}
            stroke={stroke}
         ></path>
      </svg>
   );
}

export default Heart;
