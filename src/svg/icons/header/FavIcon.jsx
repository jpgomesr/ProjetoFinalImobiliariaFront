import React from "react";

const FavIcon = ({ width, height }) => {
   return (
      <div data-svg-wrapper>
         <svg
            width={width}
            height={height}
            viewBox="0 0 20 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
         >
            <path
               d="M10 18L8.55 16.7052C3.4 12.1243 0 9.103 0 5.3951C0 2.37384 2.42 0 5.5 0C7.24 0 8.91 0.794551 10 2.05014C11.09 0.794551 12.76 0 14.5 0C17.58 0 20 2.37384 20 5.3951C20 9.103 16.6 12.1243 11.45 16.715L10 18Z"
               fill="white"
            />
         </svg>
      </div>
   );
};

export default FavIcon;
