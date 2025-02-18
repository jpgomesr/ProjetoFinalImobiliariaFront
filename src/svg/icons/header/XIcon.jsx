import React from "react";

const XIcon = ({ width, height }) => {
   return (
      <div data-svg-wrapper>
         <svg
            width={width}
            height={height}
            viewBox="0 0 25 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
         >
            <path
               d="M1 24L24 1M1 1L24 24"
               stroke="white"
               strokeWidth="2"
               strokeLinecap="round"
               strokeLinejoin="round"
            />
         </svg>
      </div>
   );
};

export default XIcon;
