
import { useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import ChatMessage from "./ChatMessage";
import { Bot } from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: "user" | "assistant";
  timestamp: Date;
}

interface ChatContainerProps {
  messages: Message[];
  isLoading: boolean;
}

const ChatContainer = ({ messages, isLoading }: ChatContainerProps) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
      <div className="space-y-4">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            id={message.id}
            content={message.content}
            sender={message.sender}
            timestamp={message.timestamp}
          />
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
  );
};

export default ChatContainer;
