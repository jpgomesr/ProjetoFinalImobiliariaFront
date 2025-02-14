import LogoHavClaro from "../../svg/logo/LogoHavClaro";
import PerfilIcon from "../../svg/icons/header/PerfilIcon";
import MenuHamburguer from "../../svg/icons/header/MenuHamburguer";
import XIcon from "../../svg/icons/header/XIcon";
import { useEffect, useState } from "react";
import Hamburguer from "./Hamburguer";

export default function HeaderVermelho() {
   const [isHamburguerVisible, setIsHamburguerVisible] = useState(false);

   const handleHamburguer = (e: any) => {
      e.preventDefault();

      setIsHamburguerVisible(!isHamburguerVisible);
   };

   return (
      <div className="bg-havprincipal px-6 py-1 flex justify-between">
         <LogoHavClaro width={60} height={60} />
         <div className="flex justify-center items-center gap-5">
            <PerfilIcon width={23} height={23} />
            <div onClick={handleHamburguer} className="cursor-pointer">
               {!isHamburguerVisible ? (
                  <MenuHamburguer width={23} height={15} />
               ) : (
                  <div>
                     <XIcon width={23} height={23} />
                     <Hamburguer />
                  </div>
               )}
            </div>
         </div>
      </div>
   );
}
