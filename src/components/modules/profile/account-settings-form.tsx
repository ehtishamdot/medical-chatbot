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
import AuthServices from "@/services/auth/auth.service";
import {userType} from "@/lib/types/user";
import DefaultLoader from "@/components/common/loaders/default-loader";

export const securityFormSchema = z.object({
    username: z.string().min(1,"Username Is Required").min(2,"Username Should Be Atleast 2 Characters").max(50).optional(),
    password:z.string().min(8,"Password Must Be Of Atleast 8 Characters").optional()
})

const AccountSettingsForm = ({user}:{user:userType}) => {
    const {data:session}=useSession();
    console.log(session,"session")
    const form = useForm<z.infer<typeof securityFormSchema>>({
        resolver: zodResolver(securityFormSchema),
        defaultValues:{
            username: user.username
        }
    })
    const {useHandleUpdateSecuritySettings}=AuthServices();
    const {mutate:handleUpdateSecurity,isPending:isHandleUpdateSecurityPending}=useHandleUpdateSecuritySettings();
    function onSubmit(data: z.infer<typeof securityFormSchema>) {
        const updatedFields=Object.keys(form.formState.dirtyFields);
        console.log(updatedFields,'updatedFields')
        const updatedData:z.infer<typeof securityFormSchema>={};
        updatedFields.map((el,index)=>{
            updatedData[el as keyof z.infer<typeof securityFormSchema>]=data[el as  keyof z.infer<typeof securityFormSchema>]
        })
        handleUpdateSecurity(updatedData);
    }
    return (
        <div className="w-full mx-auto">
            <div className="grid grid-cols-5 gap-8">
                <div className="col-span-5 xl:col-span-3">
                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
                            <h3 className="font-medium text-black dark:text-white">
                                Change Password
                            </h3>
                        </div>
                        <div className="p-7">
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)}>
                                    <FormField
                                        control={form.control}
                                        name="username"
                                        render={({ field }) => (
                                            <FormItem className={'mb-5.5'}>
                                                <FormLabel>Username</FormLabel>
                                                <FormControl>
                                                    <Input className={'w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black   dark:bg-meta-4 dark:text-white'} placeholder="shadcn" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem className={'mb-5.5'}>
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <Input type={'password'} className={'w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black   dark:bg-meta-4 dark:text-white'} placeholder="******" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className="flex justify-end gap-4.5">
                                        <button
                                            className="flex justify-center rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90"
                                            type="submit"
                                        >
                                            {isHandleUpdateSecurityPending?<DefaultLoader/>:" Save"}
                                        </button>
                                    </div>
                                </form>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountSettingsForm;
