"use client";

import Message, { Skeleton } from "@/components/Message";
import { useToast } from "@/components/ui/use-toast";
import { httpRequest } from "@/lib/interceptor";
import axios, { AxiosError } from "axios";
import React, { useEffect, useRef, useState } from "react";

import "../../../../chat/[bot]/index.css";
import {notFound, usePathname, useRouter} from "next/navigation";
import PatientVerificationForm from "@/components/modules/patients/patient-verification-form";
import PatientsServices from "@/services/patients/patients.service";
import LoadingPage from "@/components/common/loaders/loading-page";

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

export default function Chat({params,searchParams}:{params:{id:string},searchParams:{patient_id:string;}}) {
  const {id}=params;
  const {patient_id}=searchParams;
  if(!id){
    notFound();
  }
  const {useFetchSinglePatient}=PatientsServices();
  const {data:patientData,isLoading:isPatientLoading}=useFetchSinglePatient(patient_id);

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
  // `/api/patient/bot/history?patient_id=${patient_id}&specialty_id=${bot}&disease_bot_id=${disease_bot_id}`
  useEffect(() => {
    axios
      .get(`/api/history/single-patient?historyId=${id}`)
      .then((res) => {
        console.log(res.data)
        setMessages(
          res.data.chatHistory.map((item: any) => {
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
  if(isPatientLoading||loading){
    return <LoadingPage/>
  }
  return (
      <>
        {allowed ? <div className={"bg-white"}>
          <div className="input w-full flex flex-col justify-between h-[80vh]">
            <div className="flex gap-4 justify-center mx-auto w-full max-w-3xl p-4">
              <p className="text-3xl font-semibold">Esper Wise</p>
              <p className="text-3xl text-primary font-semibold">Neurologist</p>
            </div>
            <div className="flex gap-4 justify-center mx-auto w-full max-w-3xl p-4">
              <p className="text-3xl font-semibold">Patient: {patientData?.name}</p>
            </div>
            <>
              <div
                  className="messages w-full mx-auto h-full mb-4 overflow-auto flex flex-col gap-10 pt-10 max-[900px]:pt-20 scroll-smooth"
                  ref={scrollRef}
              >
                {messages.map((message, index) => (
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
