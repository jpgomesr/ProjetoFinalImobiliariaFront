import dynamic from 'next/dynamic';
import { EnderecoMapBox } from "@/models/ModelEnrecoMapBox";
import { LocalProximo } from "@/app/actions/geoCoding";


// Importação dinâmica do componente cliente para evitar problemas de SSR
const MapboxMapClient = dynamic(() => import('./MapboxMapClient'), {
  ssr: true,
  loading: () => (
    <div className="w-full h-[350px] bg-gray-100 animate-pulse flex items-center justify-center">
      <p className="text-gray-500">Carregando mapa...</p>
    </div>
  ),
});

interface MapboxMapProps {
   endereco: EnderecoMapBox;
   onLocaisProximosLoad?: (locais: LocalProximo[]) => void;
   detalhesImovel: {
      tamanho: string;
      qtdQuartos: number;
      qtdGaragens: number;
      qtdBanheiros: number;
      qtdPiscina: number;
      qtdChurrasqueira: number;
   };
}

export default function MapboxMap(props: MapboxMapProps) {
  return <MapboxMapClient {...props} />;
}

