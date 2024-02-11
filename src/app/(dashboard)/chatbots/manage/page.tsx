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

const ManageChatbot=()=>{
    const [specialty,setSpecialty]=useState("");
    const router=useRouter();
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
                         <div className="grid flex-1 gap-2">
                             <Label htmlFor="link" className="sr-only">
                                 Preference
                             </Label>
                             <Select onValueChange={(e)=>setSpecialty(e)}>
                                 <SelectTrigger className="w-full">
                                     <SelectValue placeholder="Select Specialty" />
                                 </SelectTrigger>
                                 <SelectContent>
                                     <SelectItem value="orthopedic">Orthopedic</SelectItem>
                                     <SelectItem value="neurologist">Neurologist</SelectItem>
                                 </SelectContent>
                             </Select>
                         </div>
                     </div>
                     <Button disabled={specialty===""} className={'bg-primary'} onClick={()=>router.push(`/questions/${specialty}`)}>
                         Proceed
                     </Button>
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
