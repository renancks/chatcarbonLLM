// src/components/chat/Chatbot.tsx
import { useState, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import Groq from 'groq-sdk';
import { AOIData } from '../../types';

interface ChatMessage {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatbotProps {
  currentAOI: AOIData | null;
  loading: boolean;
}

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true
});

export default function Chatbot({ currentAOI, loading }: ChatbotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      text: "Hello! I'm your GIS assistant. Draw a polygon on the map!",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (currentAOI) {
      const areaMessage = `New area selected: ${currentAOI.area.toFixed(2)} hectares`;
      setMessages(prev => [...prev, {
        text: areaMessage,
        isUser: false,
        timestamp: new Date()
      }]);
    }
  }, [currentAOI]);

  const processMessage = async (userMessage: string) => {
    setIsLoading(true);
    try {
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are a GIS assistant helping with carbon credit projects.'
          },
          {
            role: 'user',
            content: userMessage
          }
        ],
        model: 'mixtral-8x7b-32768',
        temperature: 0.7,
        max_tokens: 1024,
      });

      const responseText = completion.choices[0]?.message?.content || 
        "I'm sorry, I couldn't process that request.";

      setMessages(prev => [...prev, {
        text: responseText,
        isUser: false,
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        text: "I'm sorry, I encountered an error processing your request.",
        isUser: false,
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    
    setMessages(prev => [...prev, {
      text: userMessage,
      isUser: true,
      timestamp: new Date()
    }]);

    await processMessage(userMessage);
  };

  return (
    <div className="h-full flex flex-col bg-white shadow-lg">
      <div className="p-4 bg-blue-600 text-white">
        <h2 className="text-xl font-semibold">Carbon Credits GIS Assistant</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.isUser
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-gray-100 text-gray-800 rounded-bl-none'
              }`}
            >
              {message.text}
              <div className={`text-xs mt-1 ${message.isUser ? 'text-blue-100' : 'text-gray-500'}`}>
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg p-2 transition-colors disabled:bg-blue-400"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
}