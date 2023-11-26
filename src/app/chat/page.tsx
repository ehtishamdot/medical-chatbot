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
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as AlertDialog from "@radix-ui/react-alert-dialog";

import "./index.css";

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
  const [bot, setBot] = useState<String | null>(null);
  const [warningModal, setWarningModal] = useState<Boolean>(false);
  const [dropdown, setDropdown] = useState<Boolean>(false);
  const [preConfirmationBot, setPreConfirmationBot] = useState<string>("");

  useEffect(() => {
    httpRequest
      .get(`/api/chat`)
      .then((res) => {
        setMessages(
          res.data.queries.map((item: any) => {
            return {
              id: item.id,
              message: item.data,
              isUser: item.isUser,
            };
          })
        );
      })
      .catch((err) => {
        if (err instanceof AxiosError)
          toast({
            title: "Error",
            description: err.response?.data.message,
          });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [toast]);

  useEffect(() => {
    if (bot === null) return;
    if (message === "") setMessage("Hello");
    setHistory([]);
    setMessages([]);
    handleEmit("new");
  }, [bot]);

  function handleEmit(status: string) {
    console.log(history);
    setLoading(true);
    setMessages((prev) => [...prev, { id: idGen(), isUser: true, message }]);
    const t = status === "new" ? "Hello" : message;
    setMessage("");
    const latestMessage = { role: "user", content: t };
    let updatedHistory;

    let history_ = status === "new" ? [] : history;
    if (t === "Hello") {
      updatedHistory = [latestMessage, ...history_];
    } else {
      updatedHistory = [...history_, latestMessage];
    }

    const requestBody = updatedHistory.map(({ role, content }) => ({
      role,
      content,
    }));

    httpRequest
      .post(`/api/bot/chat?bot=${bot}`, requestBody)
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
        <div className="flex gap-4 justify-center mx-auto w-full max-w-3xl p-4">
          <p className="text-3xl font-semibold">Esper Wise</p>
          <DropdownMenu.Root open={dropdown}>
            <DropdownMenu.Trigger asChild>
              <button
                className="flex items-center space-x-1 p-2 bg-gradient-to-r from-gray-900 to-gray-500 text-gray-800 rounded-lg focus:outline-none focus:ring-2 gap-2 shadow-md"
                aria-label="Customize options"
                onClick={() => {
                  setDropdown(true);
                }}
              >
                <span className="text-white">
                  {bot ? bot : "Select Specialised bot "}
                </span>
                <svg
                  className="w-3 h-3 transition-transform transform text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 4 4 4-4"
                  />
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className="DropdownMenuContent"
                sideOffset={5}
              >
                <DropdownMenu.Item
                  onSelect={() => {
                    if (bot === null) setBot("neurologist");
                    else {
                      setWarningModal(true);
                      setPreConfirmationBot("neurologist");
                    }
                    setDropdown(false);
                  }}
                  className="DropdownMenuItem"
                >
                  Neurologist <div className="RightSlot">⌘+T</div>
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  onSelect={() => {
                    if (bot === null) setBot("orthopedic");
                    else {
                      setWarningModal(true);
                      setPreConfirmationBot("orthopedic");
                    }
                    setDropdown(false);
                  }}
                  className="DropdownMenuItem"
                >
                  Orthopedic <div className="RightSlot">⌘+N</div>
                </DropdownMenu.Item>
                <DropdownMenu.Arrow className="DropdownMenuArrow" />
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>

        {!bot && (
          <p className="text-2xl center messages w-full mx-auto h-full mb-4 overflow-auto flex flex-col justify-center items-center gap-10 pt-10 max-[900px]:pt-20 scroll-smooth">
            Please select the bot!
          </p>
        )}

        {bot && (
          <>
            <div
              className="messages w-full mx-auto h-full mb-4 overflow-auto flex flex-col gap-10 pt-10 max-[900px]:pt-20 scroll-smooth"
              ref={scrollRef}
            >
              {messages.map((message) => (
                <Message
                  key={message.id}
                  id={message.id}
                  isUser={message.isUser}
                  message={!message.message ? "Hello" : message.message}
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
          </>
        )}
        {/* <span className="mx-auto mb-6 text-xs mt-3 text-center">
          ChatGPT may produce inaccurate information about people, places, or
          facts.
        </span> */}
      </div>

      <AlertDialog.Root open={warningModal}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay className="AlertDialogOverlay" />
          <AlertDialog.Content className="AlertDialogContent">
            <AlertDialog.Title className="AlertDialogTitle">
              Are you sure?
            </AlertDialog.Title>
            <AlertDialog.Description className="AlertDialogDescription">
              This action cannot be undone. This will permanently delete your
              previous conversation with the bot!
            </AlertDialog.Description>
            <div
              style={{ display: "flex", gap: 25, justifyContent: "flex-end" }}
            >
              <AlertDialog.Cancel asChild>
                <button
                  className="Button mauve"
                  onClick={() => setWarningModal(false)}
                >
                  Cancel
                </button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <button
                  onClick={() => {
                    setBot(preConfirmationBot);
                    setWarningModal(false);
                  }}
                  className="Button red"
                >
                  Confirm
                </button>
              </AlertDialog.Action>
            </div>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </div>
  );
}
