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
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import AuthServices from "@/services/auth/auth.service";
import {Textarea} from "@/components/ui/textarea";
import PatientsServices from "@/services/patients/patients.service";

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

interface countryType{
    name:{
        common:string;
    }
}
const AddPatientForm = () => {
    const {data:session}=useSession();
    console.log(session,"session")
    const form = useForm<z.infer<typeof patientFormSchema>>({
        resolver: zodResolver(patientFormSchema),

    })
   const {useHandleAddPatientService}=PatientsServices();
    const {mutate:handleAddPatient,isPending:isHandleAddPatientPending}=useHandleAddPatientService();
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
                            <form action="#">

                                <div
                                    id="FileUpload"
                                    className="relative mb-5.5 block w-full cursor-pointer appearance-none rounded border border-dashed border-primary bg-gray px-4 py-4 dark:bg-meta-4 sm:py-7.5"
                                >
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                                    />
                                    <div className="flex flex-col items-center justify-center space-y-3">
                      <span
                          className="flex h-10 w-10 items-center justify-center rounded-full border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M1.99967 9.33337C2.36786 9.33337 2.66634 9.63185 2.66634 10V12.6667C2.66634 12.8435 2.73658 13.0131 2.8616 13.1381C2.98663 13.2631 3.1562 13.3334 3.33301 13.3334H12.6663C12.8431 13.3334 13.0127 13.2631 13.1377 13.1381C13.2628 13.0131 13.333 12.8435 13.333 12.6667V10C13.333 9.63185 13.6315 9.33337 13.9997 9.33337C14.3679 9.33337 14.6663 9.63185 14.6663 10V12.6667C14.6663 13.1971 14.4556 13.7058 14.0806 14.0809C13.7055 14.456 13.1968 14.6667 12.6663 14.6667H3.33301C2.80257 14.6667 2.29387 14.456 1.91879 14.0809C1.54372 13.7058 1.33301 13.1971 1.33301 12.6667V10C1.33301 9.63185 1.63148 9.33337 1.99967 9.33337Z"
                              fill="#3C50E0"
                          />
                          <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M7.5286 1.52864C7.78894 1.26829 8.21106 1.26829 8.4714 1.52864L11.8047 4.86197C12.0651 5.12232 12.0651 5.54443 11.8047 5.80478C11.5444 6.06513 11.1223 6.06513 10.8619 5.80478L8 2.94285L5.13807 5.80478C4.87772 6.06513 4.45561 6.06513 4.19526 5.80478C3.93491 5.54443 3.93491 5.12232 4.19526 4.86197L7.5286 1.52864Z"
                              fill="#3C50E0"
                          />
                          <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M7.99967 1.33337C8.36786 1.33337 8.66634 1.63185 8.66634 2.00004V10C8.66634 10.3682 8.36786 10.6667 7.99967 10.6667C7.63148 10.6667 7.33301 10.3682 7.33301 10V2.00004C7.33301 1.63185 7.63148 1.33337 7.99967 1.33337Z"
                              fill="#3C50E0"
                          />
                        </svg>
                      </span>
                                        <p>
                                            <span className="text-primary">Click to upload</span>
                                        </p>
                                        <p className="mt-1.5">Upload Your Patient Details In CSV Format</p>

                                    </div>
                                </div>

                                <div className="flex justify-end gap-4.5">
                                    <button
                                        className="flex justify-center rounded border border-stroke px-6 py-2 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                                        type="submit"
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
