interface HomeProps {
   objImovel: string;
}

export default function ObjetivoImovel({ objImovel }: HomeProps) {
   return (
      <div className="bg-havprincipal max-h-[1.3rem] w-[100%] flex justify-center items-center rounded-[2px]">
         <p className="text-[0.625rem] p-[0.25rem] text-white">{objImovel}</p>
      </div>
   );
}
