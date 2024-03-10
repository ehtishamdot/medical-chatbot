"use client";

import Message, { Skeleton } from "@/components/Message";
import { useToast } from "@/components/ui/use-toast";
import { httpRequest } from "@/lib/interceptor";
import { AxiosError } from "axios";
import React, { useEffect, useRef, useState } from "react";

import "../../../../../app/chat/[bot]/index.css";
import {notFound, usePathname} from "next/navigation";
import PatientVerificationForm from "@/components/modules/patients/patient-verification-form";

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

export default function Chat({params,searchParams}:{params:{bot:string};searchParams:{patient_id:string;disease_bot_id:string}}) {
  const {bot}=params;
  console.log(params)
  console.log(searchParams)
  const {patient_id,disease_bot_id}=searchParams;
  if(!bot||!patient_id){
    notFound();
  }
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("Hello");
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const { toast } = useToast();
  const [history, setHistory] = useState<IHistory[]>([]);
  // const [bot, setBot] = useState<String | null>(null);
  const [warningModal, setWarningModal] = useState<Boolean>(false);
  const [dropdown, setDropdown] = useState<Boolean>(false);
  const [preConfirmationBot, setPreConfirmationBot] = useState<string>("");
  const [allowed,setAllowed]=useState(true);

  useEffect(() => {
    httpRequest
      .post(`/api/patient/bot/history?patient_id=65d78546a3b0a329407a0823&specialty_id=65e6006a45bd24cb84262e47&disease_bot_id=65edee22088ff4f3deecb0f6`)
      .then((res) => {
        console.log(res.data)
        setMessages(
          res.data.chat.map((item: any) => {
            return {
              message: item.content,
              isUser: item.role==="user",
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


  function updateScroll() {
    var element = scrollRef.current;
    if (!element) return;
    element.scrollTop = element.scrollHeight;
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(updateScroll, [messages]);
  useEffect(() => {
    console.log(messages,"s")
  }, [messages]);
  const pathname=usePathname();
  return (
      <>
        {allowed ? <div className={""}>
          <div className="input w-full flex flex-col justify-between h-screen">
            <div className="flex gap-4 justify-center mx-auto w-full max-w-3xl p-4">
              <p className="text-3xl font-semibold">Esper Wise</p>
              <p className="text-3xl text-primary font-semibold">Neurologist</p>
            </div>

            <>
              <div
                  className="messages w-full mx-auto h-full mb-4 overflow-auto flex flex-col gap-10 pt-10 max-[900px]:pt-20 scroll-smooth"
                  ref={scrollRef}
              >
                {messages.map((message,index) => (
                    <Message
                        key={index}
                        id={index}
                        isUser={message.isUser}
                        message={!message.message ? "Hello" : message.message}
                        isNew={message.isNew ?? false}
                    />
                ))}
                {loading && <Skeleton/>}
              </div>
            </>

          </div>
        </div> : <PatientVerificationForm setIsVerified={setAllowed}/>}
      </>

  );
}
