interface HomeProps {
   tipo: string;
   cor?: string;
}

export default function CardBanner({
   tipo,
   cor = "bg-havprincipal"
}: HomeProps) {
   return (
      <div className="absolute top-4 w-full">
         <div className={`flex justify-center items-center w-full ${cor}`}>
            <p className="py-1 text-white font-semibold text-lg">
               {tipo}
            </p>
         </div>
      </div>
   );
}
