'use server';

import { EnderecoMapBox } from "@/models/ModelEnrecoMapBox";

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface LocalProximo {
  nome: string;
  tipo: string;
  distancia: number;
  endereco: string;
  longitude: number;
  latitude: number;
  temNomeEspecifico: boolean;
}

export async function getCoordinatesFromAddress(endereco: EnderecoMapBox): Promise<Coordinates> {
  try {
    const query = `${endereco.rua}, ${endereco.numeroCasaPredio}, ${endereco.bairro}, ${endereco.cidade}, ${endereco.estado}`;
    const encodedQuery = encodeURIComponent(query);
    
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedQuery}.json?access_token=pk.eyJ1Ijoiam9hb3NjaGVpZDExMTIiLCJhIjoiY204ZGdxbGRwMHAycjJsb3dvY2NxdjZybSJ9.LBq6pnASGALoZor7X3zcbQ&country=BR`,
      { cache: 'force-cache' } // Adiciona cache no servidor
    );

    if (!response.ok) {
      throw new Error('Erro ao buscar coordenadas');
    }

    const data = await response.json();

    if (!data.features || data.features.length === 0) {
      throw new Error('Endereço não encontrado');
    }

    const [longitude, latitude] = data.features[0].center;

    return { latitude, longitude };
  } catch (error) {
    console.error('Erro ao buscar coordenadas:', error);
    throw new Error('Não foi possível obter as coordenadas do endereço');
  }
} 