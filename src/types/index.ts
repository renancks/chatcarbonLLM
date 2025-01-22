// src/types/index.ts
export interface LULCData {
    classNames: string[];
    areas: number[];
  }
  
  export interface LULCClass {
    className: string;
    area: number;
  }
  
  export interface AOIData {
    geometry: any;
    coordinates: number[][];
    area: number;
    lulcClasses?: LULCClass[];
  }