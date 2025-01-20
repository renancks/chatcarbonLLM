// src/components/SimpleChat.tsx
import { useState } from 'react';
import Groq from 'groq-sdk';

interface Message {
  content: string;
  role: 'user' | 'assistant';
}

export default function SimpleChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setLoading(true);
    setError('');

    // Adiciona a mensagem do usuário imediatamente
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);

    try {
      console.log('Enviando mensagem para o Groq...');
      const groq = new Groq({
        apiKey: import.meta.env.VITE_GROQ_API_KEY,
        dangerouslyAllowBrowser: true, // Adicione esta linha
      });

      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'Você é um assistente amigável e prestativo.',
          },
          {
            role: 'user',
            content: userMessage,
          },
        ],
        model: 'mixtral-8x7b-32768',
        temperature: 0.7,
        max_tokens: 1024,
      });

      const assistantResponse = completion.choices[0]?.message?.content;

      if (assistantResponse) {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: assistantResponse },
        ]);
      }
    } catch (err) {
      console.error('Erro:', err);
      setError(
        err instanceof Error ? err.message : 'Erro ao processar mensagem'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg">
      {/* Cabeçalho */}
      <div className="p-4 border-b bg-blue-600 text-white rounded-t-lg">
        <h1 className="text-xl font-bold">Chat com Groq</h1>
      </div>

      {/* Área de mensagens */}
      <div className="h-[500px] overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="text-center text-gray-500">Digitando...</div>
        )}
        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>
        )}
      </div>

      {/* Área de input */}
      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Digite sua mensagem..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}
