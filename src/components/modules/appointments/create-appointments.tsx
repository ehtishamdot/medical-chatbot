import {z} from "zod";
import AppointmentService from "@/services/appointment/appointment.service";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input"
import PatientsServices from "@/services/patients/patients.service";
import {Button} from "@/components/ui/button";
import {Textarea} from "@/components/ui/textarea";
import DefaultLoader from "@/components/common/loaders/default-loader";
export const appointmentSchema=z.object({
    startDate:z.string(),
    patientName:z.string(),
    patientEmail:z.string(),
    notes:z.string()
})
const CreateAppointments=()=>{

    const {useHandleCreateAppointmentService}=AppointmentService();
    const {mutate:handleCreateAppointment,isPending:isAppointmentPending}=useHandleCreateAppointmentService();

    const form = useForm<z.infer<typeof appointmentSchema>>({
        resolver: zodResolver(appointmentSchema),
    })
    function onSubmit(values: z.infer<typeof appointmentSchema>) {
        handleCreateAppointment({
            ...values,
            startDate:new Date(values.startDate).toISOString()
        });
    }
    const {useFetchAllPatients}=PatientsServices();
    const {data:patientData,isLoading:isPatientDataLoading}=useFetchAllPatients();
    return(
        <Dialog>
            <DialogTrigger><Button className={"bg-primary text-white mb-2"}>Create Appointment</Button></DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create A New Appointment</DialogTitle>
                    <DialogDescription>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-4">
                                <FormField
                                    control={form.control}
                                    name="startDate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Start Date</FormLabel>
                                            <FormControl>
                                                <Input type={"datetime-local"} placeholder="Appointment Date" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="patientName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <Select onValueChange={(e)=>{
                                                field.onChange(e);
                                                const selectedPatient=patientData?.find((el)=>el.name===e)
                                                if(selectedPatient){
                                                    form.setValue("patientEmail",selectedPatient?.email);
                                                }
                                            }} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a verified email to display" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent >
                                                    {patientData?.map((el,index)=>{
                                                        return(
                                                            <SelectItem key={index} value={el.name}>
                                                                <div className={"flex flex-col items-start"}>
                                                                    <span className={"text-primary"}>{el.name}</span>
                                                                    <span>{el.email}</span>
                                                                </div>
                                                            </SelectItem>
                                                        )
                                                    })}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="notes"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Notes</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Notes" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit">{isAppointmentPending?<DefaultLoader/>:"Submit"}</Button>
                            </form>
                        </Form>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )

}
export default CreateAppointments;