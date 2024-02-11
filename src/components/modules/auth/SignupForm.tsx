"use client";

import { Logo } from "@/components/assets/Icons";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import { z } from "zod"
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import AuthServices from "@/services/auth/auth.service";
import CountrySelect from "@/components/common/form/CountrySelect";
import BaseAutoComplete from "@/components/common/form/BaseAutocomplete";
import {LANGUAGES} from "@/lib/constants";

const formSchema = z.object({
    username: z.string().min(1,"Username Is Required").min(2,"Username Should Be Atleast 2 Characters").max(50),
    email: z.string().email("Should Be A Valid Email"),
    password:z.string().min(1,"Password Is Required").min(6,"Password Should be Atleast 6 Characters"),
    specialty:z.string().min(1,"Speciality Is Required"),
    jobTitle:z.string().min(1,"Job Title Is Required"),
    placeOfWork:z.string().min(1,"Place Of Work Is Required"),
    licenseNumber:z.string().min(1,"License Number Is Required"),
    countryAndLanguage:z.string({
        required_error: "Country Is Required",
    }),
    countryOfPractice:z.string({
        required_error: "Country Of Practice Is Required",
    }),
    preferredLanguage:z.string({
        required_error: "Preferred Language Is Required",
    }),
    role:z.string()
})
interface countryType{
    name:{
        common:string;
    }
}

export default function SignupForm({countries}:{countries:countryType[]}) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode:"onChange",
        defaultValues: {
            role: "DOCTOR",
        },
    })
    const {useHandleSignUpService}=AuthServices();
    const {mutate:handleSignup,isPending:isHandleSignupPending}=useHandleSignUpService();
    function onSubmit(data: z.infer<typeof formSchema>) {
        handleSignup(data);
    }
    return (
        <div className="flex flex-col items-center h-screen">
            <span className="mt-12">{Logo}</span>
            <Card className="w-[800px] py-5 mt-20 max-[900px]:mt-10 max-[400px]:w-[95%]">
                <CardHeader>
                    <CardTitle>New to Esper Wise</CardTitle>
                    <CardDescription>Create your account.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className="grid grid-cols-1 md:grid-cols-2 w-full items-center gap-4 mt-1">
                                <FormField
                                    control={form.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Username</FormLabel>
                                            <FormControl>
                                                <Input placeholder="John Doe" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input placeholder="john.doe@gmail.com" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="specialty"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Specialty</FormLabel>
                                            <Select {...field} onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select your specialty" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="orthopedic">Orthopedic</SelectItem>
                                                    <SelectItem value="neurologist">Neurologist</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input type={'password'} placeholder="********" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="jobTitle"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Job Title</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Doctor" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="placeOfWork"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Place Of Work</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Hospital" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="licenseNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>License Number</FormLabel>
                                            <FormControl>
                                                <Input type={'number'} placeholder="92851" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <CountrySelect form={form} countries={countries} name={"countryAndLanguage"} label={"Country"}/>
                                <CountrySelect form={form} countries={countries} name={"countryOfPractice"} label={"Country Of Practice"}/>
                                <BaseAutoComplete form={form} data={LANGUAGES} name={"preferredLanguage"} label={"Preferred Language"} title={"Select Your Preferred Language"} placeholder={"Search Language ..."}/>
                            </div>
                            <Button
                                disabled={!form.formState.isValid}
                                type={'submit'}
                                variant="custom"
                                className="w-full mt-4"
                            >
                                Signup
                            </Button>
                        </form>
                    </Form>

                </CardContent>
            </Card>
            <span className="mt-6 text-sm max-[400px]:pb-4">
        Already have an account?{" "}
                <Link className="text-neutral-400" href="/auth/login">
          Log in
        </Link>{" "}
      </span>
        </div>
    );
}
