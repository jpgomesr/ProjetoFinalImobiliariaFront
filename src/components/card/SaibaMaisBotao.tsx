interface HomeProps {
   codigo: number;
}

export default function SaibaMaisBotao({ codigo }: HomeProps) {
   return (
      <button className="bg-havprincipal rounded-md">
         <p className="py-2 px-4 text-white text-sm">Saiba Mais</p>
      </button>
   );
}
