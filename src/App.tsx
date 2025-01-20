// src/App.tsx
import { useState } from 'react';
import Map from './components/Map';
import Chatbot from './components/Chatbot';

function App() {
  const [currentAOI, setCurrentAOI] = useState<any>(null);

  const handleAOICreated = async (geometry: any) => {
    setCurrentAOI(geometry);
    // Aqui vamos implementar a lógica para buscar o LULC
    console.log('Nova AOI criada:', geometry);
    // TODO: Implementar recorte do LULC
  };

  return (
    <div className="h-screen flex">
      <div className="w-1/3 h-full">
        <Chatbot onCommand={() => {}} />
      </div>
      <div className="w-2/3 h-full">
        <Map onAOICreated={handleAOICreated} />
      </div>
    </div>
  );
}

export default App;
