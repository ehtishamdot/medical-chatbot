"use client";
import Image from "next/image";
import Breadcrumb from "@/components/common/breadcrumbs/Breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {Avatar, AvatarFallback} from "@/components/ui/avatar";
import LoadingPage from "@/components/common/loaders/loading-page";
import { Switch } from "@/components/ui/switch"
import {Button} from "@/components/ui/button";
import UsersService from "@/services/users/users.service";


const PermissionsPage = ({params}:{params:{userId:string}}) => {
    const {userId}=params;
    const {useFetchSingleUser}=UsersService();
    const {data:singleUserData,isLoading}=useFetchSingleUser(userId);

    if(isLoading){
        return <LoadingPage/>
    }

    const PERMISSIONS=["Can Create Chatbots","Can Transcribe Audio Sessions","Can Add Patients","Can Add Documents","Can Scan Documents","Can Create Appointments"]

    return (
        <div className="mx-auto max-w-242.5">
            <Breadcrumb pageName="Patient Profile" />

            {singleUserData&&<div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
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
                            <AvatarFallback className={"bg-primary text-2xl text-white font-[700]"}>{singleUserData?.username.split(" ")[0][0].toUpperCase()}</AvatarFallback>
                        </Avatar>
                    </div>
                    <div className="mt-4">
                        {singleUserData && <h3 className="mb-1.5 text-2xl font-semibold text-black dark:text-white">
                            {singleUserData.username ?? ""}
                        </h3>}
                        <div className={"flex flex-col items-center justify-center"}>
                            <p className="font-medium"><span>Email: </span> {singleUserData?.email ?? ""}</p>
                        </div>

                        <div className={"mt-6"}>
                            <Tabs defaultValue="chat" className="!w-full">
                                <TabsList>
                                    <TabsTrigger value="permissions">Permissions</TabsTrigger>
                                </TabsList>
                                <TabsContent value="permissions">
                                    <div className={"mt-4 flex px-20 flex-col w-full justify-center gap-10 items-center"}>
                                        <h2 className={"text-xl font-[700]"}>User Permissions</h2>
                                        <div className={"flex flex-col gap-4 w-full"}>
                                            {PERMISSIONS.map((el,index)=>{
                                                return(
                                                    <div className={"flex justify-between items-center"}>
                                                        <h2 className={"font-[600]"}>{el}</h2>
                                                        <Switch id="airplane-mode" />
                                                    </div>
                                                )
                                            })}
                                        </div>
                                        <Button className={"bg-primary text-white"}>Save Changes</Button>
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

export default PermissionsPage;
