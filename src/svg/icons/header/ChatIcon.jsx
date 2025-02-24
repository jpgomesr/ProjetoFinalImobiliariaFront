import React from "react";

const ChatIcon = ({ width, height }) => {
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
               d="M0 18V1.70334C0 1.21778 0.171482 0.812672 0.514445 0.488025C0.857408 0.163378 1.28407 0.0007027 1.79444 0H18.2056C18.7167 0 19.1433 0.162675 19.4856 0.488025C19.8278 0.813375 19.9993 1.21848 20 1.70334V13.0544C20 13.5393 19.8285 13.9444 19.4856 14.2697C19.1426 14.5951 18.7159 14.7574 18.2056 14.7567H3.41889L0 18ZM3.88889 11.0675H11.6667V10.0135H3.88889V11.0675ZM3.88889 7.90537H16.1111V6.85132H3.88889V7.90537ZM3.88889 4.74322H16.1111V3.68917H3.88889V4.74322Z"
               fill="white"
            />
         </svg>
      </div>
   );
};

export default ChatIcon;
