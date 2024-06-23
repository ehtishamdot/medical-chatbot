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
} from "@/components/ui/form"
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import DefaultLoader from "@/components/common/loaders/default-loader";
import DocumentService from "@/services/documents/documents.service";
import BaseDropzone from "@/components/common/form/BaseDropzone";


export const DocSchema = z.object({
    file:z.any()
})

const DocumentUploadForm=()=>{
    const {useHandleUploadDocument}=DocumentService();
    const {mutate:handleUploadDoc,isPending}=useHandleUploadDocument();
    const form = useForm<z.infer<typeof DocSchema>>({
        resolver: zodResolver(DocSchema),
    })
    async function onSubmit(data: z.infer<typeof DocSchema>) {
        const formData=new FormData();
        formData.append("file",data.file[0]);
        handleUploadDoc(formData);
    }
    return(
        <Dialog>
            <DialogTrigger asChild>
                <Button className={"bg-primary text-white"}>Upload Document</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Upload Document</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <div className="p-7">
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <BaseDropzone placeholder={"Upload Your Docs Here"} control={form.control} name={"file"} multiple={true}
                                          maxFiles={1}/>

                            <div className="flex justify-end gap-4.5">
                                <button
                                    className="flex justify-center rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90"
                                    type="submit"
                                >
                                    {isPending ? <DefaultLoader/> : "Upload"}
                                </button>
                            </div>
                        </form>
                    </div>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
export default DocumentUploadForm;
