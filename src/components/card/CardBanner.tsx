interface HomeProps {
   tipo: string;
}

export default function CardBanner(props: HomeProps) {
   return (
      <div className="absolute top-4 w-full">
         <div className="flex justify-center items-center w-full bg-havprincipal">
            <p className="py-1 text-white font-semibold text-lg">
               {props.tipo}
            </p>
         </div>
      </div>
   );
}
