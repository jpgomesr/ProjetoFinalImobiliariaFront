import CardImovel from "./components/CardImovel";

export default function Home() {
   return (
      <div>
         <CardImovel tipo="Casa" favorited={false} />
      </div>
   );
}
