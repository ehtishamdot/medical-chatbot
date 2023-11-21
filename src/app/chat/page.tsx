"use client";

import Menu from "@/components/Menu";
import Message, { Skeleton } from "@/components/Message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { httpRequest } from "@/lib/interceptor";
import axios, { AxiosError } from "axios";
import React, { useEffect, useRef, useState } from "react";
import { v4 as idGen } from "uuid";

type Message = {
  id: string;
  message: string;
  isUser: boolean;
  isNew?: boolean;
};

interface IHistory {
  role: string;
  content: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("Hello");
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const { toast } = useToast();
  const [history, setHistory] = useState<IHistory[]>([]);

  // useEffect(() => {
  //   httpRequest
  //     .get("/api/chat")
  //     .then((res) => {
  //       setMessages(
  //         res.data.queries.map((item: any) => {
  //           return {
  //             id: item.id,
  //             message: item.data,
  //             isUser: item.isUser,
  //           };
  //         })
  //       );
  //     })
  //     .catch((err) => {
  //       if (err instanceof AxiosError)
  //         toast({
  //           title: "Error",
  //           description: err.response?.data.message,
  //         });
  //     })
  //     .finally(() => {
  //       setLoading(false);
  //     });
  // }, [toast]);

  useEffect(() => {
    handleEmit();
  }, []);
  
  function handleEmit() {
    setLoading(true);
    setMessages((prev) => [...prev, { id: idGen(), isUser: true, message }]);
    const t = message;
    setMessage("");
    const latestMessage = { role: "user", content: t };
    let updatedHistory;

    if (t === "Hello") {
      updatedHistory = [latestMessage, ...history];
      console.log("Hello");
    } else {
      updatedHistory = [...history, latestMessage];
    }

    const requestBody = updatedHistory.map(({ role, content }) => ({
      role,
      content,
    }));

    httpRequest
      .post("/api/bot/chat", requestBody)
      .then(({ data }) => {
        setMessages((prev) => [
          ...prev,
          { id: idGen(), isUser: false, message: data.content, isNew: true },
        ]);

        if (t === "Hello") {
          setHistory((prev) => [latestMessage, data, ...prev]);
        } else {
          setHistory((prev) => [...prev, latestMessage, data]);
        }
      })
      .catch((err) => {
        if (err instanceof AxiosError) {
          toast({
            title: "Error",
            description: err.response?.data.message,
          });
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function clear() {
    setMessages([]);
  }

  function updateScroll() {
    var element = scrollRef.current;
    if (!element) return;
    element.scrollTop = element.scrollHeight;
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(updateScroll, [messages]);
  console.log(messages);
  return (
    <div>
      <Menu clear={clear} />
      <div className="input w-full flex flex-col justify-between h-screen">
        <div className="flex justify-center mx-auto w-full max-w-3xl p-4">
          <p className="text-3xl font-semibold">Esper Wise</p>
        </div>
        <div
          className="messages w-full mx-auto h-full mb-4 overflow-auto flex flex-col gap-10 pt-10 max-[900px]:pt-20 scroll-smooth"
          ref={scrollRef}
        >
          {messages.map((message) => (
            <Message
              key={message.id}
              id={message.id}
              isUser={message.isUser}
              message={message.message}
              isNew={message.isNew ?? false}
            />
          ))}
          {loading && <Skeleton />}
        </div>
        <div className="w-[50%] max-[900px]:w-[90%] flex flex-row gap-3 mx-auto mt-auto pb-6">
          <Input
            onKeyDown={(e) => {
              if (e.keyCode == 13 && message) {
                handleEmit();
              }
            }}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Send a message"
            className="h-12"
          />
          <Button
            disabled={!message}
            onClick={handleEmit}
            className="h-12 font-semibold"
          >
            Send
          </Button>
        </div>
        {/* <span className="mx-auto mb-6 text-xs mt-3 text-center">
          ChatGPT may produce inaccurate information about people, places, or
          facts.
        </span> */}
      </div>
    </div>
  );
}
