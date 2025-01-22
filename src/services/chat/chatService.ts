// src/services/chat/chatServices.ts
import Groq from 'groq-sdk';

export class ChatService {
  private groq: Groq;

  constructor(apiKey: string) {
    this.groq = new Groq({
      apiKey,
      dangerouslyAllowBrowser: true
    });
  }

  async processMessage(message: string, context: any): Promise<string> {
    try {
      const completion = await this.groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are a GIS assistant helping with carbon credit projects.'
          },
          {
            role: 'user',
            content: this.formatMessage(message, context)
          }
        ],
        model: 'mixtral-8x7b-32768',
        temperature: 0.7,
        max_tokens: 1024
      });

      return completion.choices[0]?.message?.content || 
        "I'm sorry, I couldn't process that request.";
    } catch (error) {
      console.error('Error processing message:', error);
      throw error;
    }
  }

  private formatMessage(message: string, context: any): string {
    // Adiciona contexto à mensagem
    return `${message}\n\nContext: ${JSON.stringify(context)}`;
  }
}