import CardImovel from "./components/CardImovel";

export default function Home() {
   return (
      <div>
         <CardImovel
            tipo="Casa"
            favorited={false}
            objImovel="Venda"
            valor={999999}
            qtdFav={9999}
            codigo={12345}
            endereco="Rua Arthur Gonçalves de Araujo"
            bairro="João Pessoa"
            cidade="Jaraguá do Sul"
            descricao="Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque illum, voluptas commodi ullam enim ipsam voluptate, cupiditate natus."
         />
      </div>
   );
}
