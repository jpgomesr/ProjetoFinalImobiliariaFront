
import dynamic from 'next/dynamic';
import { EnderecoMapBox } from "@/models/ModelEnrecoMapBox";
import { LocalProximo } from "@/app/actions/geoCoding";
import MapboxMapClient from './MapboxMapClient';

// Importação dinâmica do componente cliente para evitar problemas de SSR

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