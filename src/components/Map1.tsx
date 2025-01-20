import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, ZoomControl, FeatureGroup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import L from 'leaflet';
import 'leaflet-draw';

// Fix Leaflet default marker icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapProps {
  onShapeDrawn: (layer: L.Layer) => void;
}

// Custom DrawControl component to replace EditControl
const DrawControl = ({ onCreated }: { onCreated: (e: any) => void }) => {
  const map = useMap();
  
  useEffect(() => {
    if (!map) return;

    // Create draw controls
    const drawControl = new L.Control.Draw({
      draw: {
        rectangle: true,
        polygon: true,
        circle: false,
        circlemarker: false,
        marker: false,
        polyline: false,
      },
      edit: {
        featureGroup: new L.FeatureGroup(),
      },
    });

    map.addControl(drawControl);

    // Add draw created event handler
    map.on(L.Draw.Event.CREATED, onCreated);

    return () => {
      map.removeControl(drawControl);
      map.off(L.Draw.Event.CREATED, onCreated);
    };
  }, [map, onCreated]);

  return null;
};

export default function Map({ onShapeDrawn }: MapProps) {
  const featureGroupRef = useRef<L.FeatureGroup>(null);

  useEffect(() => {
    const mapContainer = document.querySelector('.leaflet-container');
    if (mapContainer) {
      (mapContainer as HTMLElement).style.height = '100%';
    }
  }, []);

  const handleCreated = (e: any) => {
    const layer = e.layer;
    if (onShapeDrawn) {
      onShapeDrawn(layer);
    }
    
    // Add the layer to the FeatureGroup
    if (featureGroupRef.current) {
      featureGroupRef.current.addLayer(layer);
    }
  };

  return (
    <MapContainer
      center={[0, 0]}
      zoom={3}
      zoomControl={false}
      className="w-full h-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FeatureGroup ref={featureGroupRef}>
        <DrawControl onCreated={handleCreated} />
      </FeatureGroup>
      <ZoomControl position="bottomright" />
    </MapContainer>
  );
}