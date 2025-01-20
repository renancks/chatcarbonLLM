// TestGroq.tsx
import { useState } from 'react';
import Groq from 'groq-sdk';

export default function TestGroq() {
  const [response, setResponse] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const testGroq = async () => {
    setLoading(true);
    setError('');
    try {
      console.log('Iniciando teste do Groq...');
      console.log(
        'API Key:',
        import.meta.env.VITE_GROQ_API_KEY ? 'Presente' : 'Ausente'
      );

      const groq = new Groq({
        apiKey: import.meta.env.VITE_GROQ_API_KEY,
      });

      console.log('Cliente Groq criado');

      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: 'user',
            content: 'Diga olá e se apresente brevemente',
          },
        ],
        model: 'mixtral-8x7b-32768',
      });

      console.log('Resposta recebida:', completion);
      setResponse(completion.choices[0]?.message?.content || 'Sem resposta');
    } catch (error) {
      console.error('Erro detalhado:', error);
      setError(error instanceof Error ? error.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Teste do Groq</h1>

      <button
        onClick={testGroq}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
      >
        {loading ? 'Testando...' : 'Testar Groq'}
      </button>

      {loading && <div className="mt-4 text-blue-500">Carregando...</div>}

      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          Erro: {error}
        </div>
      )}

      {response && (
        <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          Resposta: {response}
        </div>
      )}
    </div>
  );
}
