"use client";

import { Logo } from "@/components/assets/Icons";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import AuthServices from "@/services/auth/auth.service";
import DefaultLoader from "@/components/common/loaders/default-loader";

const formSchema = z.object({
    email: z.string().email("Should Be A Valid Email"),
})

export default function ForgotPasswordForm() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode:"onChange",
    })
    const {useHandleForgotPasswordService}=AuthServices();
    const {mutate:handleForgotPassword,isPending:isHandleForgotPasswordPending}=useHandleForgotPasswordService();
    function onSubmit(data: z.infer<typeof formSchema>) {
        handleForgotPassword(data);
    }
    return (
        <div className="flex flex-col items-center h-screen">
            <span className="mt-12">{Logo}</span>
            <Card className="w-[800px] py-5 mt-20 max-[900px]:mt-10 max-[400px]:w-[95%] max-w-[400px]">
                <CardHeader>
                    <CardTitle>Forgot Password</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className="grid grid-cols-1 w-full items-center gap-4 mt-1">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem className={"w-full"}>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input placeholder="john.doe@gmail.com" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <Button
                                // disabled={!form.formState.isValid}
                                type={'submit'}
                                variant="custom"
                                className="w-full mt-4"
                            >
                                {isHandleForgotPasswordPending?<DefaultLoader/>:"Reset Password"}
                            </Button>
                        </form>
                    </Form>

                </CardContent>
            </Card>
        </div>
    );
}
