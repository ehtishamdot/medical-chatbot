
"use client";
import Breadcrumb from "@/components/common/breadcrumbs/Breadcrumb";
import {
    Card, CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import Cookies from "js-cookie";
import {userType} from "@/lib/types/user";
import {Input} from "@/components/ui/input";
import ChatbotServices from "@/services/chatbot/chatbot.service";
import LoadingPage from "@/components/common/loaders/loading-page";
import DefaultLoader from "@/components/common/loaders/default-loader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {formatTitle} from "@/lib/helpers";
import {Separator} from "@/components/ui/separator";
import {useMemo} from "react";


export enum DISEASE_ENUM{
    GENERAL="GENERAL",
    DISEASE_SPECIFIC="DISEASE_SPECIFIC"
}

export const botSchema = z.object({
    specialist: z.string(),
    specificity: z.string(),
    disease: z.string().optional(), // Disease is optional by default
}).refine(data => {
    if (data.specificity === "DISEASE_SPECIFIC" && !data.disease) {
        throw new Error("Disease is required when specificity is 'disease specific'");
    }
    return true;
});
const ManageChatbot=()=>{
    const form = useForm<z.infer<typeof botSchema>>({
        resolver: zodResolver(botSchema),
        mode:"onChange"
    })
    let unparsedUserData:userType;
    const userData=Cookies.get("user");
    if(userData){
        unparsedUserData=JSON.parse(userData);
    }
    const specificity=form.watch("specificity")
    const {useHandleAddChatbotService,useFetchAllChatbots}=ChatbotServices();
    const {mutate:handleCreateChatbot,isPending:isHandleCreateChatbotPending}=useHandleAddChatbotService();
    function onSubmit(data: z.infer<typeof botSchema>) {
      handleCreateChatbot(data)
    }
    const {data:chatbotData,isLoading:isChatbotDataLoading}=useFetchAllChatbots();
    const specialist=form.watch("specialist");

    const generalCount=useMemo(()=>{
        const phases=chatbotData?.find((el)=>el.name===specialist)?.generalPhases;
        return !phases||phases?.length<=0;
    },[specialist,isChatbotDataLoading])
    if(isChatbotDataLoading){
        return <LoadingPage/>
    }
    return(
        <div>
            <Breadcrumb pageName={"Chatbots"}/>
            <div className={'flex w-full justify-end'}>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button className={'bg-primary text-white hover:bg-black-2 hover:text-white'} variant="outline">Create
                            A Chatbot</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Create A Chatbot</DialogTitle>
                            <DialogDescription>
                                Anyone who has this link will be able to view this.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex items-center space-x-2">
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className={"w-full flex flex-col"}>
                                    <FormField
                                        control={form.control}
                                        name="specialist"
                                        render={({field}) => (
                                            <FormItem className={'mb-5.5'}>
                                                <FormLabel>Specialist</FormLabel>
                                                <Select {...field} onValueChange={field.onChange}
                                                        defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger
                                                            className={'w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black dark:bg-meta-4 dark:text-white'}>
                                                            <SelectValue placeholder="Select Specialist"/>
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {unparsedUserData.specialty.map((el,index)=>(
                                                            <SelectItem
                                                                key={index}
                                                                value={el}>{el}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="specificity"
                                        render={({field}) => (
                                            <FormItem className={'mb-5.5'}>
                                                <FormLabel>Specificity</FormLabel>
                                                <Select {...field} onValueChange={field.onChange}
                                                        defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger
                                                            className={'w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black dark:bg-meta-4 dark:text-white'}>
                                                            <SelectValue placeholder="Select Specificity"/>
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value={DISEASE_ENUM.DISEASE_SPECIFIC}>Disease
                                                            Specific</SelectItem>
                                                        {generalCount&&<SelectItem value={DISEASE_ENUM.GENERAL}>General</SelectItem>}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                    {specificity === "DISEASE_SPECIFIC" && <FormField
                                        control={form.control}
                                        name="disease"
                                        render={({field}) => (
                                            <FormItem className={'mb-5.5'}>
                                                <FormLabel>Disease</FormLabel>
                                                <FormControl>
                                                    <Input type={"text"}
                                                           className={'w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black dark:bg-meta-4 dark:text-white'}
                                                           placeholder="Enter Disease" {...field} />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />}
                                    <Button disabled={isHandleCreateChatbotPending} className={'bg-primary'} type={"submit"}>
                                        {isHandleCreateChatbotPending?<DefaultLoader/>:"Proceed"}
                                    </Button>
                                </form>
                            </Form>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
            {chatbotData&&chatbotData?.length>0&&<div className={"p-4"}>
                {chatbotData?.map((el,index)=>{
                                return (
                                    <div key={index}>
                                        <h2 className={"font-semibold text-2xl my-4"}>{formatTitle(el.name)}</h2>
                                        <Tabs defaultValue="general">
                                            <TabsList>
                                                <TabsTrigger value="general">General</TabsTrigger>
                                                <TabsTrigger value="specific">Disease Specific</TabsTrigger>
                                            </TabsList>
                                            <TabsContent value="general">
                                                {el.generalPhases.length>0&&<Card key={index} className="w-[350px]">
                                                    <CardHeader>
                                                        <CardTitle className={'flex justify-between'}>
                                                            Phases
                                                        </CardTitle>
                                                        <CardDescription className={"grid grid-cols-2 gap-2 mt-6"}>{el.generalPhases.map((innerEl,innerIndex)=>{
                                                            return(
                                                                <div key={innerIndex}>{innerEl.name}</div>
                                                            )
                                                        })}</CardDescription>
                                                    </CardHeader>
                                                        <CardFooter className="flex justify-between">
                                                            <Button className={'bg-primary'}>
                                                              <Link href={`/chatbots/${el.id}?specificity=GENERAL`}>Manage</Link>
                                                            </Button>
                                                              <Link className={"text-primary font-bold underline"} href={`/patient/feedback/${el.id}?specificity=GENERAL&phase=${el.name}`}>Reviews</Link>
                                                       </CardFooter>
                                                </Card>}
                                                {el.generalPhases.length<=0&&<p>No General Bot Created</p>}
                                            </TabsContent>
                                            <TabsContent value="specific">
                                                <div
                                                    className={'mt-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8'}>
                                                    {el.diseases.length>0&&el?.diseases?.map((el, index) => {
                                                        return (
                                                            <Card key={index} className="w-[350px]">
                                                                <CardHeader>
                                                                    <CardTitle className={'flex justify-between'}>
                                                                        {formatTitle(el.name)}
                                                                        {/*<Switch/>*/}
                                                                    </CardTitle>
                                                                    {/*<CardDescription>{el.type}</CardDescription>*/}
                                                                </CardHeader>
                                                                <CardFooter className="flex justify-between">
                                                                    <Button className={'bg-primary'}>
                                                                        <Link
                                                                            href={`/chatbots/${el.specialtyId}?specificity=DISEASE_SPECIFIC&diseaseId=${el.id}`}>Manage</Link>
                                                                    </Button>
                                                                    <Link className={"text-primary font-bold underline"}
                                                                          href={`/patient/feedback/${el.specialtyId}?specificity=DISEASE_SPECIFIC&diseaseId=${el.id}`}>Reviews</Link>
                                                                </CardFooter>
                                                            </Card>
                                                        )
                                                    })}
                                                    {el.diseases.length<=0&&<p>No Specialized Bot Created</p>}
                                                </div>
                                            </TabsContent>
                                        </Tabs>
                                        <Separator className={"mt-4"}/>
                                    </div>
                                )
                })}
            </div>}
            {!chatbotData||chatbotData?.length<=0&&<div>No Bots Are Created!</div>}
        </div>
    )
}
export default ManageChatbot;
