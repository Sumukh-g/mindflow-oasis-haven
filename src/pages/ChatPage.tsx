
import { useState } from "react";
import PageLayout from "@/components/PageLayout";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { geminiService, GeminiMessage } from "@/services/GeminiService";
import ChatContainer from "@/components/chat/ChatContainer";
import ChatInput from "@/components/chat/ChatInput";

interface Message {
  id: string;
  content: string;
  sender: "user" | "assistant";
  timestamp: Date;
}

const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Hello! I'm your MindMend assistant. How are you feeling today?",
      sender: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async (input: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Convert messages to the format expected by the Gemini service
      const conversationHistory: GeminiMessage[] = messages
        .slice(-10) // Limit context to last 10 messages for token reasons
        .map((msg) => ({
          role: msg.sender,
          content: msg.content,
        }));

      // Add the new user message
      conversationHistory.push({
        role: "user",
        content: userMessage.content,
      });

      // Send to Gemini API
      const response = await geminiService.sendMessage(conversationHistory);

      const aiMessage: Message = {
        id: Date.now().toString(),
        content: response,
        sender: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get AI response",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6 space-y-2">
          <h1 className="text-3xl font-serif font-bold">Your Personal Assistant</h1>
          <p className="text-muted-foreground">
            I'm here to help with your mental wellness journey. What's on your mind?
          </p>
        </div>

        <Card className="border shadow-md">
          <CardContent className="p-0">
            <div className="h-[600px] flex flex-col">
              <ChatContainer messages={messages} isLoading={isLoading} />
              <div className="p-4 border-t">
                <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default ChatPage;
