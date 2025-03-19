import mapboxgl from "mapbox-gl";
import { EnderecoMapBox } from "@/models/ModelEnrecoMapBox";
import { getLocaisProximosServer } from "@/app/actions/locaisProximos";
import { getCoordinatesFromAddress, LocalProximo } from "@/app/actions/geoCoding";

// Configuração do token do Mapbox
mapboxgl.accessToken = "pk.eyJ1Ijoiam9hb3NjaGVpZDExMTIiLCJhIjoiY204ZGdxbGRwMHAycjJsb3dvY2NxdjZybSJ9.LBq6pnASGALoZor7X3zcbQ";

export class MapboxService {
  private map: mapboxgl.Map | null = null;
  private markers: mapboxgl.Marker[] = [];

  async initializeMap(container: HTMLDivElement, endereco: EnderecoMapBox) {
    try {
      // Obter coordenadas do endereço
      const coords = await getCoordinatesFromAddress(endereco);
      console.log('Coordenadas do endereço:', coords);

      // Inicializar o mapa
      if (!this.map) {
        console.log('Inicializando novo mapa');
        this.map = new mapboxgl.Map({
          container: container,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: [coords.longitude, coords.latitude],
          zoom: 14
        });

        this.map.addControl(new mapboxgl.NavigationControl());
      }

      // Limpar marcadores anteriores
      this.clearMarkers();

      // Adicionar marcador do imóvel
      console.log('Adicionando marcador do imóvel');
      const mainMarker = new mapboxgl.Marker({ color: '#FF0000' })
        .setLngLat([coords.longitude, coords.latitude])
        .setPopup(new mapboxgl.Popup({
          className: 'custom-popup'
        }).setHTML(`
          <div style="background-color: #6B1D1D; padding: 12px;">
            <h3 style="font-weight: bold; font-size: 1.125rem; margin-bottom: 8px; color: #F5F5DC !important;">Imóvel</h3>
            <p style="margin: 4px 0; color: #F5F5DC !important;">${endereco.rua}, ${endereco.numeroCasaPredio}</p>
            ${endereco.numeroCasaPredio ? `<p style="margin: 4px 0; color: #F5F5DC !important;">Apto ${endereco.numeroCasaPredio}</p>` : ''}
            <p style="margin: 4px 0; color: #F5F5DC !important;">${endereco.bairro}</p>
            <p style="margin: 4px 0; color: #F5F5DC !important;">${endereco.cidade} - ${endereco.estado}</p>
          </div>
        `))
        .addTo(this.map);

      this.markers.push(mainMarker);

      // Buscar locais próximos
      console.log('Buscando locais próximos...');
      const locais = await getLocaisProximosServer(coords.latitude, coords.longitude);
      console.log('Locais encontrados:', locais);

      // Adicionar marcadores para locais próximos
      if (locais.length > 0) {
        console.log(`Adicionando ${locais.length} marcadores`);
        locais.forEach((local, index) => {
          console.log(`Adicionando marcador ${index + 1}:`, local);
          const marker = new mapboxgl.Marker({ color: '#4A90E2' })
            .setLngLat([local.longitude, local.latitude])
            .setPopup(
              new mapboxgl.Popup({
                className: 'custom-popup'
              }).setHTML(`
                <div style="background-color: #6B1D1D; padding: 12px;">
                  <h3 style="font-weight: bold; font-size: 1.125rem; margin-bottom: 4px; color: #F5F5DC !important;">${local.nome}</h3>
                  <p style="margin: 4px 0; color: rgba(245, 245, 220, 0.8) !important;">${local.tipo}</p>
                  <p style="font-size: 0.875rem; margin-top: 8px; color: #F5F5DC !important;">${local.endereco}</p>
                  <p style="font-size: 0.875rem; font-weight: 500; margin-top: 8px; color: #F5F5DC !important;">
                    Distância: ${local.distancia < 1000 
                      ? `${local.distancia}m` 
                      : `${(local.distancia / 1000).toFixed(1)}km`}
                  </p>
                </div>
              `)
            )
            .addTo(this.map!);
          this.markers.push(marker);
        });

        // Ajustar o zoom para mostrar todos os marcadores
        console.log('Ajustando zoom para mostrar todos os marcadores');
        const bounds = new mapboxgl.LngLatBounds();
        this.markers.forEach(marker => {
          bounds.extend(marker.getLngLat());
        });
        this.map.fitBounds(bounds, { 
          padding: { top: 50, bottom: 50, left: 50, right: 50 },
          maxZoom: 15
        });
      }

      return locais;
    } catch (error) {
      console.error('Erro ao inicializar o mapa:', error);
      throw error;
    }
  }

  private clearMarkers() {
    this.markers.forEach(marker => marker.remove());
    this.markers = [];
  }

  cleanup() {
    console.log('Limpando mapa');
    this.clearMarkers();
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }
} 