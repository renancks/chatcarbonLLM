// src/services/gee/lulcService.ts
import { GEEService, LULCData } from '../gee/geeService';

export interface LULCClass {
  id: number;
  name: string;
  area: number;
  color: string;
}

export interface LULCAnalysis {
  classes: LULCClass[];
  totalArea: number;
}

const LULC_CLASSES = {
  10: { name: 'Tree cover', color: '#006400' },
  20: { name: 'Shrubland', color: '#ffbb22' },
  30: { name: 'Grassland', color: '#ffff4c' },
  40: { name: 'Cropland', color: '#f096ff' },
  50: { name: 'Built-up', color: '#fa0000' },
  60: { name: 'Bare/sparse vegetation', color: '#b4b4b4' },
  70: { name: 'Snow and ice', color: '#f0f0f0' },
  80: { name: 'Permanent water bodies', color: '#0064c8' },
  90: { name: 'Herbaceous wetland', color: '#0096a0' },
  95: { name: 'Mangroves', color: '#00cf75' },
  100: { name: 'Moss and lichen', color: '#fae6a0' }
};

export async function analyzeLULC(geometry: any): Promise<LULCAnalysis> {
    try {
      console.log('Iniciando análise LULC para a geometria:', geometry);
  
      const geeService = GEEService.getInstance();
      const lulcData: LULCData = await geeService.analyzeLULC(geometry);
  
      const classes = lulcData.classNames.map((name, index) => ({
        id: index + 1,
        name,
        area: lulcData.areas[index],
        color: LULC_CLASSES[index + 1]?.color || '#000000',
      }));
  
      const totalArea = lulcData.areas.reduce((sum, area) => sum + area, 0);
  
      const result: LULCAnalysis = {
        classes,
        totalArea,
      };
  
      console.log('Resultado da análise LULC:', result);
      return result;
    } catch (error) {
      console.error('Erro na análise LULC:', error);
      throw error;
    }
  }