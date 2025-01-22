// src/App.tsx
import { useState, useEffect } from 'react';
import Map from './components/map/Map';
import Chatbot from './components/chat/Chatbot';
import LULCResults from './components/LULCResults';
import { analyzeLULC, LULCAnalysis } from './services/analysis/lulcService';
import { calculateArea } from './utils/geometry';
import { GEEService } from './services/gee/geeService';


interface AOIData {
  geometry: any;
  coordinates: number[][];
  area: number;
}

function App() {
  const [currentAOI, setCurrentAOI] = useState<AOIData | null>(null);
  const [lulcAnalysis, setLULCAnalysis] = useState<LULCAnalysis | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    console.log('lulcAnalysis updated:', lulcAnalysis);
  }, [lulcAnalysis]);

  useEffect(() => {
    const initializeGEE = async () => {
      try {
        const geeService = GEEService.getInstance();
        await geeService.initialize('YOUR_PRIVATE_KEY');
      } catch (error) {
        console.error('Failed to initialize Google Earth Engine:', error);
      }
    };

    initializeGEE();
  }, []);

  const handleAOICreated = async (geometry: any, coordinates: number[][]) => {
    try {
      setLoading(true);
      console.log('AOI created with geometry:', geometry, 'and coordinates:', coordinates);
      
      // Armazena os dados da AOI
      const aoiData: AOIData = {
        geometry,
        coordinates,
        area: calculateArea(coordinates),
      };
      setCurrentAOI(aoiData);
      console.log('Current AOI set:', aoiData);

      // Realiza análise LULC
      const analysis = await analyzeLULC(geometry);
      console.log('LULC analysis result:', analysis);
      setLULCAnalysis(analysis);
      
    } catch (error) {
      console.error('Erro ao processar AOI:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex">
      <div className="w-1/3 h-full flex flex-col">
        <Chatbot 
          currentAOI={currentAOI}
          loading={loading} 
        />
        {lulcAnalysis ? (
          <LULCResults analysis={lulcAnalysis} />
        ) : (
          <p>No LULC Analysis available</p>
        )}
      </div>
      <div className="w-2/3 h-full">
        <Map onAOICreated={handleAOICreated} />
      </div>
    </div>
  );
}

export default App;