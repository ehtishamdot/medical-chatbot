import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import React from "react";
import { z } from "zod"
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Rating} from "react-simple-star-rating";
import {Textarea} from "@/components/ui/textarea";
import FeedbackService from "@/services/feedback/feedback.service";
import {Button} from "@/components/ui/button";
import {Menu as MenuIcon} from "lucide-react";
import {DropdownMenuTrigger} from "@/components/ui/dropdown-menu";

export const ratingFormSchema = z.object({
    patientId: z.string(),
    comment:z.string(),
    rating:z.number(),
    diseaseId:z.string().optional(),
    specialtyId:z.string()
})
const ChatFeedback=({chatEnded,patientId,diseaseBotId,specialtyId,setChatEnded}:{setChatEnded:any;chatEnded:boolean;patientId:string;diseaseBotId?:string|undefined;specialtyId:string})=>{
    const {useHandleAddFeedback}=FeedbackService();
    const {mutate:handleAddFeedback,isPending:isHandleAddFeedbackPending}=useHandleAddFeedback();
    const form = useForm<z.infer<typeof ratingFormSchema>>({
        resolver: zodResolver(ratingFormSchema),
        defaultValues: {
            patientId: patientId,
            diseaseId:diseaseBotId,
            specialtyId:specialtyId,
        },
    })
    function onSubmit(values: z.infer<typeof ratingFormSchema>) {
        console.log(values)
       handleAddFeedback(values);
    }
    return(
        <Dialog onOpenChange={()=>setChatEnded(!chatEnded)} open={chatEnded}>
            <DialogTrigger asChild>
                <Button
                    className="absolute top-7 left-5 max-[500px]:left-2 border-2 dark:border-neutral-700 dark:bg-neutral-950 bg-neutral-100 border-neutral-300"
                    variant="ghost"
                >
                    {/*<MenuIcon className="w-5 h-5" />{" "}*/}
                    <span className="ml-2">Give Feedback</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Feedback</DialogTitle>
                    <DialogDescription>
                        Please Give Us Your Valuable Feedback
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
                        <FormField
                            control={form.control}
                            name="rating"
                            render={({ field }) => (
                                <FormItem className={"flex flex-col justify-center items-center w-full"}>
                                    <FormControl>
                                        <Rating SVGstyle={{display:"inline"}}  onClick={(rating)=>field.onChange(rating)}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="comment"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Comments:</FormLabel>
                                    <FormControl>
                                        <Textarea  placeholder={"Comments"}  {...field}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <button
                                className="flex cursor-pointer justify-center items-center mt-4 rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90"
                                type="submit"
                            >
                                Submit
                            </button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
export default ChatFeedback;
