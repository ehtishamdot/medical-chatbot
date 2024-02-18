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
import CountrySelect from "@/components/common/form/CountrySelect";
import BaseAutoComplete from "@/components/common/form/BaseAutocomplete";
import {LANGUAGES} from "@/lib/constants";
import AuthServices from "@/services/auth/auth.service";
import {userType} from "@/lib/types/user";

export const profileFormSchema = z.object({
    specialty:z.string({
        required_error: "Specialty Is Required",
    }),
    jobTitle:z.string({
        required_error: "Job Title Is Required",
    }),
    placeOfWork:z.string({
        required_error: "Place Of Work Is Required",
    }),
    licenseNumber:z.string({
        required_error: "License Number Is Required",
    }),
    countryAndLanguage:z.string({
        required_error: "Country Is Required",
    }),
    countryOfPractice:z.string({
        required_error: "Country Of Practice Is Required",
    }),
    preferredLanguage:z.string({
        required_error: "Preferred Language Is Required",
    }),
})
interface countryType{
    name:{
        common:string;
    }
}
const ProfileUpdateForm = ({countries,user}:{countries:countryType[],user:userType}) => {
    const {data:session}=useSession();
    console.log(session,"session")
    const form = useForm<z.infer<typeof profileFormSchema>>({
        resolver: zodResolver(profileFormSchema),
        defaultValues:{
            specialty: user.specialty,
            jobTitle: user.jobTitle,
            placeOfWork: user.placeOfWork,
            licenseNumber: user.licenseNumber,
            countryAndLanguage: user.countryAndLanguage,
            countryOfPractice: user.countryOfPractice,
            preferredLanguage: user.preferredLanguage
        }
    })
    const {useHandleUpdateProfileService}=AuthServices();
    const {mutate:handleUpdateProfile,isPending:isHandleUpdateProfile}=useHandleUpdateProfileService();
    function onSubmit(data: z.infer<typeof profileFormSchema>) {
        const dirtyFields=Object.keys(form.formState.dirtyFields);
        console.log(dirtyFields,'dirr')
        handleUpdateProfile(data);
    }
    return (
        <div className="w-full mx-auto">
            <div className="grid grid-cols-5 gap-8">
                <div className="col-span-5 xl:col-span-3">
                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
                            <h3 className="font-medium text-black dark:text-white">
                                    Profile Details
                            </h3>
                        </div>
                        <div className="p-7">
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)}>
                                    <FormField
                                        control={form.control}
                                        name="jobTitle"
                                        render={({ field }) => (
                                            <FormItem className={'mb-5.5'}>
                                                <FormLabel>Job Title </FormLabel>
                                                <FormControl>
                                                    <Input className={'w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black   dark:bg-meta-4 dark:text-white'} placeholder="Doctor" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="specialty"
                                        render={({ field }) => (
                                            <FormItem className={'mb-5.5'}>
                                                <FormLabel>Specialty</FormLabel>
                                                <Select {...field} onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className={'w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black dark:bg-meta-4 dark:text-white'}>
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
                                        name="placeOfWork"
                                        render={({ field }) => (
                                            <FormItem className={'mb-5.5'}>
                                                <FormLabel>Place Of Work</FormLabel>
                                                <FormControl>
                                                    <Input className={'w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black dark:bg-meta-4 dark:text-white'} placeholder="Hospital" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="licenseNumber"
                                        render={({ field }) => (
                                            <FormItem className={'mb-5.5'}>
                                                <FormLabel>License Number</FormLabel>
                                                <FormControl>
                                                    <Input className={'w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black dark:bg-meta-4 dark:text-white'}  type={'number'} placeholder="92851" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className={'mb-5.5'}>
                                        <CountrySelect extraClass={'w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black dark:bg-meta-4 dark:text-white'} form={form} countries={countries} name={"countryAndLanguage"} label={"Country"}/>
                                    </div>
                                    <div className={'mb-5.5'}>
                                        <CountrySelect extraClass={'w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black dark:bg-meta-4 dark:text-white'} form={form} countries={countries} name={"countryOfPractice"} label={"Country Of Practice"}/>
                                    </div>
                                    <div className={'mb-5.5'}>
                                        <BaseAutoComplete extraClass={'w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black dark:bg-meta-4 dark:text-white'} form={form} data={LANGUAGES} name={"preferredLanguage"} label={"Preferred Language"} title={"Select Your Preferred Language"} placeholder={"Search Language ..."}/>
                                    </div>
                                    <div className="flex justify-end gap-4.5">
                                        <button
                                            className="flex justify-center rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90"
                                            type="submit"
                                        >
                                            Save
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

export default ProfileUpdateForm;
