import React from "react";

const MenuHamburguer = ({ width, height }) => {
   return (
      <div data-svg-wrapper>
         <svg
            width={width}
            height={height}
            viewBox="0 0 25 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
         >
            <path
               d="M1.00383 1H24M1 8.5H23.9904M1.00383 16H23.9904"
               stroke="white"
               strokeWidth="2"
               strokeLinecap="round"
               strokeLinejoin="round"
            />
         </svg>
      </div>
   );
};

export default MenuHamburguer;
