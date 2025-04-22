"use client";

import React, { useState } from "react";
import Hamburguer from "./Hamburguer";
import { Roles } from "@/models/Enum/Roles";
import { Menu, X, XIcon } from "lucide-react";


interface HamburguerButtonProps {
   role?: Roles;
}

const HamburguerButton = ({ role }: HamburguerButtonProps) => {
   const [isHamburguerVisible, setIsHamburguerVisible] = useState(false);

   const handleHamburguer = (e: React.MouseEvent) => {
      e.preventDefault();
      setIsHamburguerVisible(!isHamburguerVisible);
   };

   return (
      <div className="cursor-pointer 2md:hidden" onClick={handleHamburguer}>
         {!isHamburguerVisible ? (
            <Menu width={23} height={23}  className="text-white"/>
         ) : (
            <div>
               <XIcon width={23} height={23} className="text-white"  />
               {role && <Hamburguer role={role} />}
            </div>
         )}
      </div>
   );
};

export default HamburguerButton;
