// src/utils/geometry.ts
import { area } from '@turf/turf';

export function calculateArea(coordinates: number[][]): number {
  const polygon = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'Polygon',
      coordinates: [coordinates]
    }
  };

  return area(polygon) / 10000; // Converte para hectares
}
