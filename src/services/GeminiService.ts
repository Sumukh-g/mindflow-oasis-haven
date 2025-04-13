
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
  private apiKey: string = "AIzaSyCkkXRraFFs_DpyR7OSvr48hdamQBxImR0"; // Replace with your actual API key
  private apiUrl = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent";

  constructor() {
    // No need to load from localStorage anymore
    console.log("Gemini service initialized");
  }

  getApiKey(): string {
    return this.apiKey;
  }
  
  setApiKey(key: string): void {
    this.apiKey = key;
    console.log("API key has been set");
  }
  
  async validateApiKey(key: string): Promise<boolean> {
    try {
      // Create a simple request to test if the API key is valid
      const testRequest: GeminiRequest = {
        contents: [
          {
            role: "user",
            parts: [{ text: "Hello" }],
          },
        ],
        generationConfig: {
          maxOutputTokens: 10, // Keep it minimal for testing
        },
      };

      const response = await fetch(`${this.apiUrl}?key=${key}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testRequest),
      });

      // If the response is not ok, the API key is invalid
      if (!response.ok) {
        const errorData = await response.json();
        console.error("API key validation failed:", errorData);
        return false;
      }

      return true;
    } catch (error) {
      console.error("API key validation error:", error);
      return false;
    }
  }

  async sendMessage(messages: GeminiMessage[]): Promise<string> {
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
}

// Create a singleton instance
export const geminiService = new GeminiService();
