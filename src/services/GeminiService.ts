
import { toast } from "@/components/ui/use-toast";

// Define types for Gemini API interactions
export interface GeminiMessage {
  role: "user" | "assistant";
  content: string;
}

export interface GeminiRequest {
  contents: {
    role: string;
    parts: { text: string }[];
  }[];
  generationConfig?: {
    temperature?: number;
    topP?: number;
    topK?: number;
    maxOutputTokens?: number;
  };
}

export interface GeminiResponse {
  candidates: {
    content: {
      parts: { text: string }[];
      role: string;
    };
    finishReason: string;
  }[];
}

export class GeminiService {
  private apiKey: string | null = null;
  private apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

  constructor() {
    // Try to load API key from localStorage
    this.apiKey = localStorage.getItem("gemini-api-key");
  }

  setApiKey(key: string): void {
    this.apiKey = key;
    localStorage.setItem("gemini-api-key", key);
    toast({
      title: "API Key Saved",
      description: "Your Gemini API key has been saved successfully.",
    });
  }

  getApiKey(): string | null {
    return this.apiKey;
  }

  async sendMessage(messages: GeminiMessage[]): Promise<string> {
    if (!this.apiKey) {
      throw new Error("API key not set");
    }

    // Transform messages into the format expected by Gemini API
    const contents = messages.map((message) => ({
      role: message.role,
      parts: [{ text: message.content }],
    }));

    const request: GeminiRequest = {
      contents,
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 1024,
      },
    };

    try {
      const response = await fetch(`${this.apiUrl}?key=${this.apiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Failed to get response from Gemini");
      }

      const data: GeminiResponse = await response.json();
      
      if (!data.candidates || data.candidates.length === 0) {
        throw new Error("No response generated");
      }

      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error("Gemini API error:", error);
      throw error;
    }
  }

  // Check if API key is valid by sending a test message
  async validateApiKey(key: string): Promise<boolean> {
    const tempKey = this.apiKey;
    this.apiKey = key;
    
    try {
      const testMessage = "Hello, can you respond with just the word 'Connected' to confirm the API connection?";
      const response = await this.sendMessage([{ role: "user", content: testMessage }]);
      return response.includes("Connected");
    } catch (error) {
      console.error("API key validation failed:", error);
      return false;
    } finally {
      this.apiKey = tempKey;
    }
  }
}

// Create a singleton instance
export const geminiService = new GeminiService();
