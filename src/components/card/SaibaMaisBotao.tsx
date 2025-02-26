interface HomeProps {
   codigo: number;
   dark: boolean;
}

export default function SaibaMaisBotao(props: HomeProps) {
   return (
      <button
         className={`rounded-md ${
            !props.dark ? "bg-havprincipal" : "bg-brancoFundo"
         }`}
      >
         <p
            className={`py-2 px-4 text-sm font-inter ${
               !props.dark ? "text-white" : "text-havprincipal font-semibold"
            }`}
         >
            Saiba Mais
         </p>
      </button>
   );
}
