"use client";
import Image from "next/image";
import Link from "next/link";
import Breadcrumb from "@/components/common/breadcrumbs/Breadcrumb";
import PatientsServices from "@/services/patients/patients.service";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {Avatar, AvatarFallback} from "@/components/ui/avatar";
import {Calendar} from "@/components/ui/calendar";
import {useState} from "react";
import LoadingPage from "@/components/common/loaders/loading-page";
import {truncateString} from "@/lib/helpers";


const SinglePatient = ({id}:{id:string}) => {
    const {useFetchSinglePatient,useFetchPatientChatHistory}=PatientsServices();
    const {data:singlePatientData,isLoading}=useFetchSinglePatient(id);
    const {data:patientHistory,isLoading:isPatientHistoryLoading}=useFetchPatientChatHistory(id);
    const [date, setDate] = useState<Date | undefined>(new Date())

    if(isLoading){
        return <LoadingPage/>
    }

    return (
        <div className="mx-auto max-w-242.5">
            <Breadcrumb pageName="Patient Profile" />

            {singlePatientData&&<div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="relative z-20 h-35 md:h-65">
                    <Image
                        src={"/images/cover/cover-01.png"}
                        alt="profile cover"
                        className="h-full w-full rounded-tl-sm rounded-tr-sm object-cover object-center"
                        width={970}
                        height={260}
                        style={{
                            width: "auto", height: "auto",
                        }}
                    />
                </div>
                <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
                    <div className="relative z-30 mx-auto -mt-22 h-30 w-full max-w-30 rounded-full bg-white/20 p-1 backdrop-blur sm:h-44 sm:max-w-44 sm:p-3">
                            <Avatar className={"!w-full !h-full"}>
                                <AvatarFallback className={"bg-primary text-2xl text-white font-[700]"}>{singlePatientData?.name.split(" ")[0][0].toUpperCase()}</AvatarFallback>
                            </Avatar>
                    </div>
                    <div className="mt-4">
                        {singlePatientData && <h3 className="mb-1.5 text-2xl font-semibold text-black dark:text-white">
                            {singlePatientData.name ?? ""}
                        </h3>}
                        <div className={"flex flex-col items-center justify-center"}>
                            <p className="font-medium"><span>Email: </span> {singlePatientData?.email ?? ""}</p>
                            <p className="font-medium"><span>Address: </span> {singlePatientData?.address ?? ""}</p>
                            <p className="font-medium"><span>Contact: </span> {singlePatientData?.phone ?? ""}</p>
                        </div>

                        <div className={"mt-6"}>
                            <Tabs defaultValue="account" className="!w-full">
                                <TabsList>
                                    <TabsTrigger value="chat">Chat History</TabsTrigger>
                                    <TabsTrigger value="appointment">Appointment History</TabsTrigger>
                                </TabsList>
                                <TabsContent value="chat">
                                    <div
                                        className="col-span-12 rounded-sm border border-stroke bg-white py-6  dark:border-strokedark dark:bg-boxdark xl:col-span-4">
                                        <h4 className="mb-6 px-7.5 text-xl font-semibold text-left text-black dark:text-white">
                                            Patient Chat History
                                        </h4>

                                        <div>
                                            {patientHistory?.map((chat, key) => (
                                                <Link
                                                    href={`/patient/chat-history/${chat.id}?patient_id=${chat.patientId}`}
                                                    className="flex items-center gap-5 px-7.5 py-3 hover:bg-gray-3 dark:hover:bg-meta-4"
                                                    key={key}
                                                >
                                                    <div className="relative h-14 w-14 bg-graydark rounded-full">
                                                        {/*<Image*/}
                                                        {/*  width={56}*/}
                                                        {/*  height={56}*/}
                                                        {/*  src={chat.avatar}*/}
                                                        {/*  alt="User"*/}
                                                        {/*  style={{*/}
                                                        {/*    width: "auto",*/}
                                                        {/*    height: "auto",*/}
                                                        {/*  }}*/}
                                                        {/*/>*/}
                                                        {/*<span*/}
                                                        {/*  className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white ${*/}
                                                        {/*    chat.dot === 6 ? "bg-meta-6" : `bg-meta-${chat.dot}`*/}
                                                        {/*  } `}*/}
                                                        {/*></span>*/}
                                                    </div>

                                                    <div className="flex flex-1 items-center justify-start">
                                                        <div>
                                                            <h5 className="font-medium text-left text-black dark:text-white">
                                                                {chat.id}
                                                            </h5>
                                                            <p>
                  <span className="text-sm text-black dark:text-white">
                                       {truncateString(chat.chatHistory[chat.chatHistory.length - 1].content,40)}

                  </span>
                                                            </p>
                                                        </div>
                                                        {/*{chat.textCount !== 0 && (*/}
                                                        {/*  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary">*/}
                                                        {/*    <span className="text-sm font-medium text-white">*/}
                                                        {/*      {" "}*/}
                                                        {/*      {chat.textCount}*/}
                                                        {/*    </span>*/}
                                                        {/*  </div>*/}
                                                        {/*)}*/}
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>

                                </TabsContent>
                                <TabsContent value="appointment">
                                    <div
                                        className="col-span-12 rounded-sm border border-stroke bg-white py-6  flex flex-col justify-center items-center dark:border-strokedark dark:bg-boxdark xl:col-span-4">
                                        <h4 className="mb-2 px-7.5 text-xl font-semibold text-left text-black dark:text-white">
                                            Appointments
                                        </h4>
                                        <Calendar
                                            mode="single"
                                            selected={date}
                                            onSelect={setDate}
                                            className="rounded-md border"
                                        />
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>
                </div>
            </div>}
        </div>
    );
};

export default SinglePatient;
