import React from "react";

interface TituloBgDegradeProps {
   text: string;
   boldText: string;
}

const TituloBgDegrade = (props: TituloBgDegradeProps) => {
   return (
      <div className="flex flex-col gap-0">
         <div className="bg-gradient-to-b from-begeClaroPadrao to-begepadrao h-6" />
         <div className="bg-begepadrao flex flex-row">
            <p className="text-lg px-12">
               {props.text} <strong>{props.boldText}</strong>
            </p>
         </div>
         <div className="bg-gradient-to-b from-begepadrao to-begeClaroPadrao h-6" />
      </div>
   );
};

export default TituloBgDegrade;
