'use server';

import { LocalProximo } from "@/app/actions/geoCoding";

const categorias = [
  { nome: 'Escola', amenity: 'school' },
  { nome: 'Supermercado', shop: 'supermarket' },
  { nome: 'Restaurante', amenity: 'restaurant' },
  { nome: 'Farmácia', amenity: 'pharmacy' },
  { nome: 'Banco', amenity: 'bank' },
  { nome: 'Hospital', amenity: 'hospital' }
];

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // raio da Terra em metros
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function getLocaisProximosServer(latitude: number, longitude: number): Promise<LocalProximo[]> {
  try {
    const deltaLat = 0.027; // Aproximadamente 3km em latitude
    const deltaLon = 0.027; // Aproximadamente 3km em longitude
    const locaisEncontrados: LocalProximo[] = [];

    // Fazer as buscas sequencialmente
    for (const categoria of categorias) {
      try {
        // Construir a query Overpass QL
        const query = `
          [out:json][timeout:25];
          (
            ${categoria.amenity ? 
              `node["amenity"="${categoria.amenity}"](${latitude - deltaLat},${longitude - deltaLon},${latitude + deltaLat},${longitude + deltaLat});
               way["amenity"="${categoria.amenity}"](${latitude - deltaLat},${longitude - deltaLon},${latitude + deltaLat},${longitude + deltaLat});`
              : 
              `node["shop"="${categoria.shop}"](${latitude - deltaLat},${longitude - deltaLon},${latitude + deltaLat},${longitude + deltaLat});
               way["shop"="${categoria.shop}"](${latitude - deltaLat},${longitude - deltaLon},${latitude + deltaLat},${longitude + deltaLat});`
            }
          );
          out body;
          >;
          out skel qt;
        `;

        // Delay entre requisições (1 segundo no servidor)
        await new Promise(resolve => setTimeout(resolve, 1000));

        const response = await fetch('https://overpass-api.de/api/interpreter', {
          method: 'POST',
          body: query,
          cache: 'force-cache' // Adiciona cache no servidor
        });

        if (!response.ok) {
          if (response.status === 429) {
            await new Promise(resolve => setTimeout(resolve, 5000));
            continue;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.elements) {
          const locaisCategoria: LocalProximo[] = [];

          for (const element of data.elements) {
            if (element.lat && element.lon) {
              const distanciaMetros = calculateDistance(
                latitude,
                longitude,
                element.lat,
                element.lon
              );

              if (distanciaMetros <= 3000) {
                const nomeLocal = element.tags?.name || element.tags?.['name:pt'] || categoria.nome;

                const local = {
                  nome: nomeLocal,
                  tipo: categoria.nome,
                  distancia: Math.round(distanciaMetros),
                  endereco: element.tags?.['addr:street'] 
                    ? `${element.tags['addr:street']}${element.tags['addr:housenumber'] ? ', ' + element.tags['addr:housenumber'] : ''}`
                    : '',
                  longitude: element.lon,
                  latitude: element.lat,
                  temNomeEspecifico: !!(element.tags?.name || element.tags?.['name:pt'])
                };

                locaisCategoria.push(local);
              }
            }
          }

          // Se encontramos locais nesta categoria, pegamos o mais próximo
          if (locaisCategoria.length > 0) {
            const localMaisProximo = locaisCategoria.reduce((menor, atual) => 
              atual.distancia < menor.distancia ? atual : menor
            );
            locaisEncontrados.push(localMaisProximo);
          }
        }
      } catch (err) {
        console.error(`Erro ao buscar ${categoria.nome}:`, err);
        continue;
      }
    }

    // Ordenar por distância
    return locaisEncontrados.sort((a, b) => a.distancia - b.distancia);
  } catch (error) {
    console.error('Erro ao buscar locais próximos:', error);
    return [];
  }
} 