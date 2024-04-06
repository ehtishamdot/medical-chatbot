"use client";
import {z} from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useSession} from "next-auth/react";
import {Input} from "@/components/ui/input";
import PatientsServices from "@/services/patients/patients.service";
import {Dispatch, SetStateAction} from "react";
import DefaultLoader from "@/components/common/loaders/default-loader";
import {Logo} from "@/components/assets/Icons";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import CountrySelect from "@/components/common/form/CountrySelect";
import BaseAutoComplete from "@/components/common/form/BaseAutocomplete";
import {LANGUAGES} from "@/lib/constants";
import {Button} from "@/components/ui/button";
import Link from "next/link";

export const patientVerificationFormSchema = z.object({
    email:z.string({
        required_error: "Email Is Required",
    }),
})
interface Props{
    setIsVerified:Dispatch<SetStateAction<boolean>>
}
const AddPatientForm = ({setIsVerified}:Props) => {
    const {data:session}=useSession();
    console.log(session,"session")
    const form = useForm<z.infer<typeof patientVerificationFormSchema>>({
        resolver: zodResolver(patientVerificationFormSchema),
    })
    const {useHandlePatientVerification}=PatientsServices();
    const verificationCallback=()=>{
        setIsVerified(true);
    }
    const {mutate:handleVerification,isPending:isHandleAddPatientPending}=useHandlePatientVerification(verificationCallback);
    function onSubmit(data: z.infer<typeof patientVerificationFormSchema>) {
        handleVerification({
            email:data.email,
        });
    }
    return (
        <div className="flex flex-col items-center h-screen">
            <span className="mt-12">{Logo}</span>
            <Card className=" w-full max-w-[400px] py-5 mt-20 max-[900px]:mt-10 max-[400px]:w-[95%]">
                <CardHeader>
                    <CardTitle>Verify Yourself</CardTitle>
                    <CardDescription>Please Verify Yourself By Providing Your Valid Email</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form className={"flex flex-col justify-center items-center"} onSubmit={form.handleSubmit(onSubmit)}>
                            <div className="w-full  gap-4 mt-1">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input placeholder="john.doe@gmail.com" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <button
                                className="flex cursor-pointer justify-center items-center mt-4 rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90"
                                type="submit"
                                disabled={isHandleAddPatientPending}
                            >
                                {isHandleAddPatientPending?<DefaultLoader/>:"Verify"}
                            </button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
};

export default AddPatientForm;
