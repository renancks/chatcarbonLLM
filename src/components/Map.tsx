// src/components/Map.tsx
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-draw';

interface MapProps {
  onAOICreated: (geometry: any) => void;
}

export default function Map({ onAOICreated }: MapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const drawLayerRef = useRef<L.FeatureGroup | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      // Inicializa o mapa
      mapRef.current = L.map(mapContainerRef.current).setView([0, 0], 2);

      // Adiciona o layer base do OpenStreetMap
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(mapRef.current);

      // Cria layer para os desenhos
      drawLayerRef.current = new L.FeatureGroup();
      mapRef.current.addLayer(drawLayerRef.current);

      // Configura as ferramentas de desenho
      const drawControl = new L.Control.Draw({
        draw: {
          marker: false,
          circlemarker: false,
          circle: false,
          polyline: false,
          rectangle: true,
          polygon: {
            allowIntersection: false,
            drawError: {
              color: '#e1e100',
              message:
                '<strong>Erro:</strong> Você não pode intersectar linhas!',
            },
            shapeOptions: {
              color: '#97009c',
            },
          },
        },
        edit: {
          featureGroup: drawLayerRef.current,
          remove: true,
        },
      });

      mapRef.current.addControl(drawControl);

      // Evento para quando um desenho é completado
      mapRef.current.on(L.Draw.Event.CREATED, (e: any) => {
        const layer = e.layer;
        drawLayerRef.current?.clearLayers(); // Limpa desenhos anteriores
        drawLayerRef.current?.addLayer(layer);

        // Obtém a geometria em GeoJSON
        const geoJSON = layer.toGeoJSON();
        onAOICreated(geoJSON.geometry);
      });

      // Evento para quando um desenho é editado
      mapRef.current.on(L.Draw.Event.EDITED, (e: any) => {
        const layers = e.layers;
        layers.eachLayer((layer: any) => {
          const geoJSON = layer.toGeoJSON();
          onAOICreated(geoJSON.geometry);
        });
      });

      // Evento para quando um desenho é deletado
      mapRef.current.on(L.Draw.Event.DELETED, () => {
        // Aqui você pode adicionar lógica para limpar dados do LULC
        console.log('AOI deletada');
      });
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [onAOICreated]);

  return <div ref={mapContainerRef} className="h-full w-full" />;
}
