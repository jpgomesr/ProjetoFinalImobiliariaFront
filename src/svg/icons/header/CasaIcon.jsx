import React from "react";

const CasaIcon = ({ className }) => {
   return (
      <div data-svg-wrapper>
         <svg
            viewBox="0 0 20 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
         >
            <path d="M8 17V11H12V17H17V9H20L10 0L0 9H3V17H8Z" fill="white" />
         </svg>
      </div>
   );
};

export default CasaIcon;
