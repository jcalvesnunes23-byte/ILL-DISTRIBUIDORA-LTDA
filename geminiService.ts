
import { GoogleGenAI } from "@google/genai";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async generateDescription(productName: string): Promise<string> {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Escreva uma descrição extremamente cativante e profissional para um produto chamado: ${productName}. Use um tom sofisticado, típico da marca ILL & DISTRIBUIDORA LTDA.`,
      });
      return response.text || "Descrição exclusiva indisponível no momento.";
    } catch (error) {
      console.error("Gemini Error:", error);
      return "Nossa curadoria está preparando os detalhes deste item exclusivo.";
    }
  }

  async chatSupport(message: string): Promise<string> {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: message,
        config: {
          systemInstruction: "Você é o assistente virtual da ILL & DISTRIBUIDORA LTDA. Atenda os clientes com extrema polidez, elegância e eficiência.",
        }
      });
      return response.text || "Em que mais posso auxiliá-lo?";
    } catch (error) {
      return "Peço desculpas, tivemos uma breve interrupção em nossa comunicação privada.";
    }
  }
}

export const gemini = new GeminiService();
