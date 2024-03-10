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
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Textarea} from "@/components/ui/textarea";
import PatientsServices from "@/services/patients/patients.service";
import BaseDropzone from "@/components/common/form/BaseDropzone";

export const patientFormSchema = z.object({
    name:z.string({
        required_error: "First Name Is Required",
    }),
    lastName:z.string({
        required_error: "Last Name Is Required",
    }),
    email:z.string({
        required_error: "Email Is Required",
    }),
    gender:z.string({
        required_error: "Gender Is Required",
    }),
    dateOfBirth:z.string({
        required_error: "Date Of Birth Is Required",
    }),
    phone:z.string(),
    address:z.string({
        required_error: "Address Is Required",
    }),
    medicalHistory:z.string({
        required_error: "Medical History Is Required",
    }),
})

export const patientSchema = patientFormSchema.omit({ lastName: true });

const ACCEPTED_TYPES=[".csv"];

export const BulkUploadSchema = z.object({
    patients: z
        .any()

});

const AddPatientForm = () => {
    const form = useForm<z.infer<typeof patientFormSchema>>({
        resolver: zodResolver(patientFormSchema),
    })
    const bulkUploadForm = useForm<z.infer<typeof BulkUploadSchema>>({
        resolver: zodResolver(BulkUploadSchema),
    })
   const {useHandleAddPatientService,useHandleBulkUploadPatients}=PatientsServices();
    const {mutate:handleAddPatient,isPending:isHandleAddPatientPending}=useHandleAddPatientService();
    const {mutate:handleUpload,isPending:isHandleUploadPending}=useHandleBulkUploadPatients();

    function onSubmit(data: z.infer<typeof patientFormSchema>) {
        handleAddPatient({
            name:data.name+" "+data.lastName,
            email:data.email,
            dateOfBirth:new Date(data.dateOfBirth).toISOString(),
            gender:data.gender,
            phone:data.phone,
            address:data.address,
            medicalHistory:data.medicalHistory
        });
    }
    function onUploadSubmit(data: z.infer<typeof BulkUploadSchema>) {
        const formData=new FormData();
        formData.append("patients",data.patients[0]);
        handleUpload(formData);
    }
    return (
        <div className="w-full mx-auto">
            <div className="grid grid-cols-5 gap-8">
                <div className="col-span-5 xl:col-span-3">
                    <div
                        className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
                            <h3 className="font-medium text-black dark:text-white">
                                Add A Single Patient
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
                                                    <FormLabel>First Name </FormLabel>
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
                                            name="lastName"
                                            render={({field}) => (
                                                <FormItem className={'mb-5.5'}>
                                                    <FormLabel>Last Name </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            className={'w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black   dark:bg-meta-4 dark:text-white'}
                                                            placeholder="Doe" {...field} />
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
                                        <FormField
                                            control={form.control}
                                            name="gender"
                                            render={({field}) => (
                                                <FormItem className={'mb-5.5'}>
                                                    <FormLabel>Gender</FormLabel>
                                                    <Select {...field} onValueChange={field.onChange}
                                                            defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger
                                                                className={'w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black dark:bg-meta-4 dark:text-white'}>
                                                                <SelectValue placeholder="Select Patient's Gender"/>
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="male">Male</SelectItem>
                                                            <SelectItem value="female">Female</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="dateOfBirth"
                                            render={({field}) => (
                                                <FormItem className={'mb-5.5'}>
                                                    <FormLabel>Date Of Birth</FormLabel>
                                                    <FormControl>
                                                        <Input  type={"date"}
                                                               className={'w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black dark:bg-meta-4 dark:text-white'}
                                                               placeholder="11111111" {...field} />
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="phone"
                                            render={({field}) => (
                                                <FormItem className={'mb-5.5'}>
                                                    <FormLabel>Phone</FormLabel>
                                                    <FormControl>
                                                        <Input type={"number"}
                                                               className={'w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black dark:bg-meta-4 dark:text-white'}
                                                               placeholder="11111111" {...field} />
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="address"
                                            render={({field}) => (
                                                <FormItem className={'mb-5.5'}>
                                                    <FormLabel>Address</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            className={'w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black dark:bg-meta-4 dark:text-white'}
                                                            placeholder="Street 75 Washington" {...field} />
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="medicalHistory"
                                            render={({field}) => (
                                                <FormItem className={'mb-5.5'}>
                                                    <FormLabel>Medical History</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            className={'w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black dark:bg-meta-4 dark:text-white'}
                                                            placeholder="Orthopedic" {...field} />
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
                                            Add Patient
                                        </button>
                                    </div>
                                </form>
                            </Form>
                        </div>
                    </div>
                </div>
                <div className="col-span-5 xl:col-span-2">
                    <div
                        className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
                            <h3 className="font-medium text-black dark:text-white">
                                Add Bulk Patients
                            </h3>
                        </div>
                        <div className="p-7">
                            <form onSubmit={bulkUploadForm.handleSubmit(onUploadSubmit)}>
                                <BaseDropzone control={bulkUploadForm.control} name={"patients"} multiple={true} maxFiles={1}/>

                                <div className="flex justify-end gap-4.5">
                                    <button
                                        onClick={()=>bulkUploadForm.reset()}
                                        className="flex justify-center rounded border border-stroke px-6 py-2 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                                        type="button"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="flex justify-center rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90"
                                        type="submit"
                                    >
                                        Save
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddPatientForm;
