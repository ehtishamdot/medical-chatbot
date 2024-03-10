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
import {Input} from "@/components/ui/input";
import AssistantService from "@/services/assistant/assistant.service";

export const assistantFormSchema = z.object({
    name:z.string({
        required_error: "First Name Is Required",
    }),
    email:z.string({
        required_error: "Email Is Required",
    }),
})


const AddAssistantForm = () => {
    const form = useForm<z.infer<typeof assistantFormSchema>>({
        resolver: zodResolver(assistantFormSchema),
    })
    const {useHandleAddAssistantService}=AssistantService();
    const {mutate:handleAddAssistant}=useHandleAddAssistantService();
    function onSubmit(data: z.infer<typeof assistantFormSchema>) {
        handleAddAssistant(data);
    }

    return (
        <div className="w-full mx-auto">
            <div className="grid grid-cols-5 gap-8">
                <div className="col-span-5 xl:col-span-3">
                    <div
                        className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
                            <h3 className="font-medium text-black dark:text-white">
                                Add Assistant
                            </h3>
                        </div>
                        <div className="p-7">
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)}>
                                    <div className={"w-full grid grid-cols-1 md:grid-cols-2 gap-x-4"}>
                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({field}) => (
                                                <FormItem className={'mb-5.5'}>
                                                    <FormLabel>Name </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            className={'w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black   dark:bg-meta-4 dark:text-white'}
                                                            placeholder="John" {...field} />
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({field}) => (
                                                <FormItem className={'mb-5.5'}>
                                                    <FormLabel>Email </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            className={'w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black   dark:bg-meta-4 dark:text-white'}
                                                            placeholder="john.doe@gmail.com" {...field} />
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="flex justify-end gap-4.5">
                                        <button
                                            className="flex justify-center rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90"
                                            type="submit"
                                        >
                                            Add Assistant
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

export default AddAssistantForm;
