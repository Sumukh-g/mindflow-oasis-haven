
import { Avatar } from "@/components/ui/avatar";
import { User, Bot } from "lucide-react";

interface ChatMessageProps {
  id: string;
  content: string;
  sender: "user" | "assistant";
  timestamp: Date;
}

const ChatMessage = ({ content, sender, timestamp }: ChatMessageProps) => {
  return (
    <div
      className={`flex ${
        sender === "user" ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`flex gap-3 max-w-[80%] ${
          sender === "user" ? "flex-row-reverse" : ""
        }`}
      >
        <Avatar className={sender === "assistant" ? "bg-primary" : "bg-secondary"}>
          <div className="text-foreground">
            {sender === "user" ? (
              <User className="h-5 w-5" />
            ) : (
              <Bot className="h-5 w-5" />
            )}
          </div>
        </Avatar>

        <div
          className={`rounded-lg px-4 py-2 ${
            sender === "user"
              ? "bg-primary text-primary-foreground"
              : "bg-muted"
          }`}
        >
          <p className="text-sm">{content}</p>
          <span className="text-xs opacity-70 mt-1 block">
            {timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
