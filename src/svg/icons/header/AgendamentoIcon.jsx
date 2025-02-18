import React from "react";

const AgendamentoIcon = ({ className }) => {
   return (
      <div data-svg-wrapper>
         <svg
            viewBox="0 0 20 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
         >
            <path
               d="M17.7778 2.2H16.6667V0H14.4444V2.2H5.55556V0H3.33333V2.2H2.22222C0.988889 2.2 0.0111111 3.19 0.0111111 4.4L0 19.8C0 20.3835 0.234126 20.9431 0.650874 21.3556C1.06762 21.7682 1.63285 22 2.22222 22H17.7778C19 22 20 21.01 20 19.8V4.4C20 3.19 19 2.2 17.7778 2.2ZM17.7778 19.8H2.22222V8.8H17.7778V19.8ZM6.66667 13.2H4.44444V11H6.66667V13.2ZM11.1111 13.2H8.88889V11H11.1111V13.2ZM15.5556 13.2H13.3333V11H15.5556V13.2ZM6.66667 17.6H4.44444V15.4H6.66667V17.6ZM11.1111 17.6H8.88889V15.4H11.1111V17.6ZM15.5556 17.6H13.3333V15.4H15.5556V17.6Z"
               fill="white"
            />
         </svg>
      </div>
   );
};

export default AgendamentoIcon;
