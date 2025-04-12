
import { useState, useRef, useEffect } from "react";
import PageLayout from "@/components/PageLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User, Bot, SendHorizonal, KeyRound } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { geminiService, GeminiMessage } from "@/services/GeminiService";
import ApiKeyModal from "@/components/ApiKeyModal";

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
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    // Check if API key is available
    if (!geminiService.getApiKey()) {
      toast({
        title: "API Connection Required",
        description: "To use the AI assistant, please connect your Gemini API key.",
        variant: "default",
      });
    }
  }, [toast]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Check if API key is set
      if (!geminiService.getApiKey()) {
        setIsApiKeyModalOpen(true);
        setIsLoading(false);
        return;
      }

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
      
      // If API key error, prompt to enter key
      if (error instanceof Error && error.message.includes("API key")) {
        setIsApiKeyModalOpen(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleApiKeySuccess = () => {
    // Re-send the last message after API key is added
    if (messages.length > 0 && messages[messages.length - 1].sender === "user") {
      handleSendMessage();
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
          <Button 
            onClick={() => setIsApiKeyModalOpen(true)} 
            variant="outline" 
            size="sm"
            className="gap-2"
          >
            <KeyRound className="h-4 w-4" />
            {geminiService.getApiKey() ? "Change API Key" : "Connect Gemini API"}
          </Button>
        </div>

        <Card className="border shadow-md">
          <CardContent className="p-0">
            <div className="h-[600px] flex flex-col">
              <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`flex gap-3 max-w-[80%] ${
                          message.sender === "user" ? "flex-row-reverse" : ""
                        }`}
                      >
                        <Avatar className={message.sender === "assistant" ? "bg-primary" : "bg-secondary"}>
                          <div className="text-foreground">
                            {message.sender === "user" ? (
                              <User className="h-5 w-5" />
                            ) : (
                              <Bot className="h-5 w-5" />
                            )}
                          </div>
                        </Avatar>

                        <div
                          className={`rounded-lg px-4 py-2 ${
                            message.sender === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <span className="text-xs opacity-70 mt-1 block">
                            {message.timestamp.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="flex gap-3 max-w-[80%]">
                        <Avatar className="bg-primary">
                          <Bot className="h-5 w-5" />
                        </Avatar>
                        <div className="rounded-lg px-4 py-2 bg-muted">
                          <div className="flex space-x-2">
                            <div className="h-2 w-2 rounded-full bg-muted-foreground animate-pulse"></div>
                            <div className="h-2 w-2 rounded-full bg-muted-foreground animate-pulse delay-150"></div>
                            <div className="h-2 w-2 rounded-full bg-muted-foreground animate-pulse delay-300"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              <div className="p-4 border-t">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex gap-2"
                >
                  <Input
                    placeholder="Type your message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1"
                    disabled={isLoading}
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={!input.trim() || isLoading}
                  >
                    <SendHorizonal className="h-5 w-5" />
                  </Button>
                </form>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <ApiKeyModal 
        open={isApiKeyModalOpen} 
        onOpenChange={setIsApiKeyModalOpen} 
        onSuccess={handleApiKeySuccess}
      />
    </PageLayout>
  );
};

export default ChatPage;
