import React from "react";

const PerfilIcon = ({ width, height }) => {
   return (
      <div data-svg-wrapper>
         <svg
            width={width}
            height={height}
            viewBox="0 0 23 23"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
         >
            <path
               d="M11.5 0C13.025 0 14.4875 0.605802 15.5659 1.68414C16.6442 2.76247 17.25 4.22501 17.25 5.75C17.25 7.27499 16.6442 8.73753 15.5659 9.81586C14.4875 10.8942 13.025 11.5 11.5 11.5C9.97501 11.5 8.51247 10.8942 7.43414 9.81586C6.3558 8.73753 5.75 7.27499 5.75 5.75C5.75 4.22501 6.3558 2.76247 7.43414 1.68414C8.51247 0.605802 9.97501 0 11.5 0ZM11.5 14.375C17.8538 14.375 23 16.9481 23 20.125V23H0V20.125C0 16.9481 5.14625 14.375 11.5 14.375Z"
               fill="white"
            />
         </svg>
      </div>
   );
};

export default PerfilIcon;
