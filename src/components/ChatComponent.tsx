"use client";

import { PlaceholdersAndVanishInput } from "./ui/placeholders-and-vanish-input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/Avatar";
import { MessageCircle } from "lucide-react";
import { Button } from "./ui/Button";
import type React from "react";

export default function MessageAI() {
  const placeholders = [
    "What's your background in web development?",
    "Tell me about your latest project",
    "What technologies do you work with?",
    "Are you available for freelance work?",
    "What's your preferred tech stack?",
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submitted");
  };
  return (
    <div className="fixed bottom-4 right-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button size="icon" className="h-12 w-12 rounded-full cursor-pointer">
            <MessageCircle className="h-6 w-6" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[345px] sm:w-[400px]  h-[600px]  flex flex-col place-items-center justify-between sm:mr-2 mx-2">
          <h2 className="h-[40px]  w-full text-xl text-center dark:text-white text-black ">
            Ask Jilian Anything
          </h2>

          {/* Mock conversation */}
          <div className="w-full max-w-xl border-t max-h-[380px] overflow-y-scroll space-y-3 p-2 h-full">
            {/* User message */}
            <div className="flex justify-end">
              <div className="bg-primary text-primary-foreground rounded-lg px-4 py-2 max-w-[80%]">
                What kind of projects have you worked on?
              </div>
            </div>

            {/* AI response */}
            <div className="flex items-start space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg" alt="Jilian" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="bg-muted rounded-lg px-4 py-2 max-w-[80%]">
                I've worked on various projects, from e-commerce platforms to
                real-time analytics dashboards. My most recent project was
                building a full-stack application using Next.js, TypeScript, and
                Prisma. You can check out my portfolio for more details!
              </div>
            </div>
          </div>

          <div className=" w-full h-[40px] px-4">
            <PlaceholdersAndVanishInput
              placeholders={placeholders}
              onChange={handleChange}
              onSubmit={onSubmit}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
