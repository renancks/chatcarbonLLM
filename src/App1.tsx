import Chatbot from './components/Chatbot';
import Map from './components/Map';

function App() {
  const handleCommand = (command: string) => {
    // Implement command handling logic here
    console.log('Received command:', command);
  };

  return (
    <div className="h-screen flex">
      <div className="w-1/3">
        <Chatbot onCommand={handleCommand} />
      </div>
      <div className="w-2/3">
        <Map />
      </div>
    </div>
  );
}

export default App;
