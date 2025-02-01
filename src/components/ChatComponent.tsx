"use client";

import { PlaceholdersAndVanishInput } from "./ui/placeholders-and-vanish-input";
import { useEffect, useRef, useState } from "react";
import OpenAI from "openai";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/Avatar";
import { MessageCircle } from "lucide-react";
import { Button } from "./ui/Button";

export default function MessageAI() {
  const [assistant, setAssistant] = useState<string | null>(null);
  const [assistantData, setAssistantData] = useState<string | null>(null);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Ref for conversation container
  const conversationRef = useRef<HTMLDivElement>(null);

  const fetchAssistantData = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}api/assistant`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch assistant data");
      }
      const data = await response.json();
      const firstItem = data.data[0];
      if (firstItem) {
        setAssistant(firstItem.name);
        setAssistantData(firstItem.data);
      } else {
        setError("No data available in the response");
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssistantData();
  }, []);

  // Effect to scroll conversation container to the bottom when messages update
  useEffect(() => {
    if (conversationRef.current) {
      conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (message: string) => {
    if (!message.trim() || !assistantData) return;

    const newMessages = [...messages, { role: "user", content: message }];
    setMessages(newMessages);

    try {
      const openai = new OpenAI({
        apiKey: import.meta.env.VITE_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true,
      });

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are ${assistant}, a friendly assistant acting like Jilian. Respond as if you are talking to a high school student. And here is your data: ${assistantData}`,
          },
          ...newMessages,
        ],
      });

      setMessages([
        ...newMessages,
        { role: "assistant", content: completion.choices[0].message.content },
      ]);
    } catch (error) {
      console.error("Error fetching OpenAI response:", error);
      setError("Error fetching OpenAI response");
    }
  };

  const placeholders = [
    "What's your background in web development?",
    "Tell me about your latest project",
    "What technologies do you work with?",
    "Are you available for new project?",
    "What's your preferred tech stack?",
  ];

  return (
    <div className="fixed bottom-4 right-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button size="icon" className="h-12 w-12 rounded-full cursor-pointer">
            <MessageCircle className="h-6 w-6" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[345px] sm:w-[400px] h-[600px] flex flex-col place-items-center justify-between sm:mr-2 mx-2">
          {messages.length === 0 && (
            <h2 className="h-[40px] w-full text-xl text-center dark:text-white text-black">
              Ask Jilian Anything
            </h2>
          )}

          {/* Conversation display */}
          <div
            ref={conversationRef}
            className="w-full max-w-xl max-h-[420px] overflow-y-scroll space-y-3 p-2 h-full">
            {messages.map((msg, index) => (
              <span key={index} className="flex flex-col gap-2">
                {msg.role === "user" ? (
                  <div className="flex justify-end">
                    <div className="bg-primary text-primary-foreground rounded-lg px-4 py-2 max-w-[80%]">
                      {msg.content}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg" alt="Jilian" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div className="bg-muted rounded-lg px-4 py-2 max-w-[80%]">
                      {msg.content}
                    </div>
                  </div>
                )}
              </span>
            ))}
          </div>

          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}
          <div className="w-full h-[40px] px-4">
            <PlaceholdersAndVanishInput
              placeholders={placeholders}
              onSubmit={() => {}}
              onChange={() => {}}
              onSend={(message: string) => {
                sendMessage(message);
              }}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
