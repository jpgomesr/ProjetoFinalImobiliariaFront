"use client";

import React, { useState } from "react";
import MenuHamburguer from "@/svg/icons/header/MenuHamburguer";
import XIcon from "@/svg/icons/header/XIcon";
import Hamburguer from "./Hamburguer";
import { Roles } from "@/models/Enum/Roles";

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
      <div className="cursor-pointer md:hidden" onClick={handleHamburguer}>
         {!isHamburguerVisible ? (
            <MenuHamburguer width={23} height={15} />
         ) : (
            <div>
               <XIcon width={23} height={23} />
               {role && <Hamburguer role={role} />}
            </div>
         )}
      </div>
   );
};

export default HamburguerButton;
