
"use client";
import Breadcrumb from "@/components/common/breadcrumbs/Breadcrumb";
import {Switch} from "@/components/ui/switch";
import {
    Card,
    CardContent,
    CardDescription,
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
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {Label} from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {useState} from "react";
import {useRouter} from "next/navigation";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {patientFormSchema} from "@/components/modules/patients/add-patient-form";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import Cookies from "js-cookie";
import {userType} from "@/lib/types/user";
import {Input} from "@/components/ui/input";
import ChatbotServices from "@/services/chatbot/chatbot.service";
const chatbotData=[
    {
        name:"Esper 01",
        type:"General",
        usage:"50%"
    },
    {
        name:"Esper 02",
        type:"General",
        usage:"50%"
    },
    {
        name:"Esper 03",
        type:"General",
        usage:"50%"
    },
    {
        name:"Esper 04",
        type:"General",
        usage:"50%"
    }
]

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
    const router=useRouter();
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
    const {useHandleAddChatbotService}=ChatbotServices();
    const {mutate:handleCreateChatbot}=useHandleAddChatbotService();
    function onSubmit(data: z.infer<typeof botSchema>) {
      handleCreateChatbot(data)
    }
    return(
        <div>
            <Breadcrumb pageName={"Chatbots"}/>
            <div className={'flex w-full justify-end'}>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button className={'bg-primary text-white hover:bg-black-2 hover:text-white'} variant="outline">Create A Chatbot</Button>
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
                                                        <SelectItem value={unparsedUserData.specialty}>{unparsedUserData.specialty}</SelectItem>
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
                                                        <SelectItem value={"DISEASE_SPECIFIC"}>Disease Specific</SelectItem>
                                                        <SelectItem value={"general"}>General</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                    {specificity==="DISEASE_SPECIFIC"&&<FormField
                                        control={form.control}
                                        name="disease"
                                        render={({field}) => (
                                            <FormItem className={'mb-5.5'}>
                                                <FormLabel>Disease</FormLabel>
                                                <FormControl>
                                                    <Input  type={"text"}
                                                            className={'w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black dark:bg-meta-4 dark:text-white'}
                                                            placeholder="Enter Disease" {...field} />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />}
                                    <Button  className={'bg-primary'} type={"submit"}>
                                        Proceed
                                    </Button>
                                </form>
                            </Form>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className={'mt-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8'}>
                {chatbotData.map((el,index)=>{
                    return(
                        <Card key={index} className="w-[350px]">
                            <CardHeader>
                                <CardTitle className={'flex justify-between'}>
                                    {el.name}
                                    <Switch/>
                                </CardTitle>
                                <CardDescription>{el.type}</CardDescription>
                            </CardHeader>
                            <CardFooter className="flex justify-between">
                                <Button className={'bg-primary'}>
                                    <Link href={`/chatbots/${el.name}`}>Manage</Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}
export default ManageChatbot;
