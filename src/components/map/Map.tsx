// src/components/Map.tsx
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw';
import { calculateArea } from '../../utils/geometry';

interface MapProps {
  onAOICreated: (geometry: any, coordinates: number[][]) => void;
}

export default function Map({ onAOICreated }: MapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const drawLayerRef = useRef<L.FeatureGroup | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      // Inicializa o mapa
      mapRef.current = L.map(mapContainerRef.current).setView([-14.235, -51.925], 4);

      // Adiciona o layer base do OpenStreetMap
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
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
              message: '<strong>Erro:</strong> Você não pode intersectar linhas!'
            },
            shapeOptions: {
              color: '#97009c',
              fillOpacity: 0.3
            }
          }
        },
        edit: {
          featureGroup: drawLayerRef.current,
          remove: true
        }
      });

      mapRef.current.addControl(drawControl);

      // Evento para quando um desenho é completado
      mapRef.current.on(L.Draw.Event.CREATED, (e: any) => {
        const layer = e.layer;
        
        // Limpa desenhos anteriores
        drawLayerRef.current?.clearLayers();
        drawLayerRef.current?.addLayer(layer);

        // Obtém as coordenadas do polígono
        const coordinates = layer.getLatLngs()[0].map((latLng: any) => [
          latLng.lat,
          latLng.lng
        ]);

        // Obtém a geometria em GeoJSON
        const geoJSON = layer.toGeoJSON();
        
        // Calcula a área
        const area = calculateArea(coordinates);

        // Faz zoom para a área desenhada
        mapRef.current?.fitBounds(layer.getBounds());
        
        // Envia dados para o componente pai
        onAOICreated(geoJSON.geometry, coordinates);
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