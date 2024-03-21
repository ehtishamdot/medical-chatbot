/* eslint-disable react/no-unescaped-entities */
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {z} from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import TokenService from "@/services/token/token.service";
import PatientsServices from "@/services/patients/patients.service";
import {Textarea} from "@/components/ui/textarea";
import TranslationService from "@/services/translations/translation.service";
import {useEffect, useState} from "react";
import {userType} from "@/lib/types/user";
import Cookies from "js-cookie";
import ChatbotServices from "@/services/chatbot/chatbot.service";
import DefaultLoader from "@/components/common/loaders/default-loader";


export const InviteSchema = z.object({
    type: z.enum(["general", "specialized"], {
        required_error: "You need to select the bot type.",
    }),
    specialty:z.string().optional(),
    notes:z.string({
        required_error: "Notes Are Required",
    }),
    diseaseId:z.string().optional()

}).superRefine(({ type, specialty }, refinementContext) => {
    if ((type !== 'general' && specialty === undefined)) {
        return refinementContext.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Specialty is required for specialized bots",
            path: ['specialty'],
        });
    }
    if ((type !== 'general' && specialty === undefined)) {
        return refinementContext.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Disease ID is required for specialized bots",
            path: ['diseaseId'],
        });
    }
});
export type invitePayloadType={
    to:string;
    uri:string;
    patientName:string;
    notes:string;
    doctorName:string;
}

const PatientInviteForm=({email,name,id}:{email:string;name:string;id:string})=>{
    const {useFetchAllChatbots}=ChatbotServices();
    const {data:chatbotData}=useFetchAllChatbots();
    const {useFetchDoctorSpecialty}=PatientsServices();
    const {data:specialtyData}=useFetchDoctorSpecialty();
    const form = useForm<z.infer<typeof InviteSchema>>({
        resolver: zodResolver(InviteSchema),
    })
    let unparsedUserData:userType;
    const userData=Cookies.get("user");
    if(userData){
        unparsedUserData=JSON.parse(userData);
    }
    const {useHandleSendInvite}=PatientsServices();
    const {mutate:sendInvite,isPending:isHandleInvitePending}=useHandleSendInvite();
    const type=form.watch("type");
    const user=TokenService.getUser();
    const {useHandleGetTranslatedText}=TranslationService();
    const [formData,setFormData]=useState<invitePayloadType>();
    const {mutate: handleGetTranslatedText,data:translationResponse,isPending:isTranslatedTextPending,isSuccess:isTextTranslationSuccess}=useHandleGetTranslatedText();
    useEffect(()=>{
        if(isTextTranslationSuccess&&formData){
            sendInvite({
                ...formData,
                notes:translationResponse?.message
            })
        }
    },[isTextTranslationSuccess,isTranslatedTextPending])
    async function onSubmit(data: z.infer<typeof InviteSchema>) {
        handleGetTranslatedText({message:data.notes});
        //Need a specialty Id Here
        let uri=`http://localhost:3000/chat/${data.specialty}`;
        // if(data.specialty&&data.type==="specialized"){
        //     // uri+=data.specialty
        //     uri+="65e2ec8e5f970c711ed34b5f";
        // }
        // else{
        //     uri+=data.type
        // }
        uri+=`?patient_id=${id}`
        if(data.specialty&&data.type==="specialized"){
            uri+=`&disease_bot_id=${data.diseaseId}`
        }
        setFormData({
            to:email,
            uri:uri,
            patientName:name,
            doctorName:user?.username||"",
            notes:data.notes,
        })
    }
    return(
    <Dialog>
    <DialogTrigger asChild>
        <span className={"text-primary cursor-pointer"}>Invite</span>
    </DialogTrigger>
    <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
            <DialogTitle>Invite Patient</DialogTitle>
            <DialogDescription>
                Make changes to your profile here. Click save when you're done.
            </DialogDescription>
        </DialogHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem className="space-y-3">
                            <FormLabel>Bot Type:</FormLabel>
                            <FormControl>
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex flex-row space-x-2"
                                >
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                            <RadioGroupItem value="general" />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                            General
                                        </FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                            <RadioGroupItem value="specialized" />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                            Specialized
                                        </FormLabel>
                                    </FormItem>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {type==="specialized"&&<FormField
                    control={form.control}
                    name="specialty"
                    render={({ field }) => (
                        <FormItem className={'mb-5.5'}>
                            <FormLabel>Specialty</FormLabel>
                            <Select {...field} onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger className={'w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black dark:bg-meta-4 dark:text-white'}>
                                        <SelectValue placeholder="Select your specialty" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {/*<SelectItem value="orthopedic">Orthopedic</SelectItem>*/}
                                    {/*<SelectItem value="neurologist">Neurologist</SelectItem>*/}
                                    {specialtyData?.map((el,index)=>(
                                        <SelectItem key={index}
                                            value={el.id}>{el.name}</SelectItem>
                                    ))}

                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />}
                {type==="specialized"&&<FormField
                    control={form.control}
                    name="diseaseId"
                    render={({ field }) => (
                        <FormItem className={'mb-5.5'}>
                            <FormLabel>Diseases</FormLabel>
                            <Select {...field} onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger className={'w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black dark:bg-meta-4 dark:text-white'}>
                                        <SelectValue placeholder="Select diseases" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {chatbotData?.diseases.map((el,index)=>{
                                        return(
                                            <SelectItem key={el.id} value={el.id}>{el.name}</SelectItem>
                                        )
                                    })}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />}
                <FormField
                    control={form.control}
                    name="notes"
                    render={({field}) => (
                        <FormItem className={'mb-5.5'}>
                            <FormLabel>Notes</FormLabel>
                            <FormControl>
                                <Textarea
                                    className={'w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black dark:bg-meta-4 dark:text-white'}
                                    placeholder="Notes" {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <Button className={"bg-primary"} type="submit">{isHandleInvitePending?<DefaultLoader/>:"Send Invite"}</Button>
            </form>
        </Form>
    </DialogContent>
</Dialog>
)
}
export default PatientInviteForm;
