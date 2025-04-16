import React from "react";

interface SubLayoutPaginasCRUDProps {
   children: React.ReactNode;
}

const SubLayoutPaginasCRUD = (props: SubLayoutPaginasCRUDProps) => {
   return (
      <div
         className="bg-begeClaroPadrao w-full flex flex-col items-center justify-center  py-6 h-full
    lg:py-8
    xl:py-10
    2xl:py-12"
      >
         {props.children}
      </div>
   );
};
export default SubLayoutPaginasCRUD;
