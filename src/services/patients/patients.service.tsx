"use client"
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";
import axios from "axios";
import {viewError} from "@/lib/helpers";
import {errorType} from "@/lib/types";
import {fetchAllSpecialtyApiResponse, userType} from "@/lib/types/user";
import {z} from "zod";
import tokenService from "@/services/token/token.service";
import {BulkUploadSchema, patientFormSchema, patientSchema} from "@/components/modules/patients/add-patient-form";
import {invitePayloadType} from "@/components/modules/patients/patient-invite-form";
import {useCallback} from "react";
import {fetchSinglePatient} from "@/services/patients/patient.api";
import {fetchAllChatHistoryApiResponse} from "@/lib/types/history";
import {cookies} from "next/headers";
import Cookies from "js-cookie";
import {useRouter} from "next/navigation";

type patientType=z.infer<typeof patientSchema>;
type bulkUploadResponseType={
    message:string;
    patients:patientType[]
}
export default function PatientsServices() {

    const useHandleAddPatientService = () => {
        const queryClient=useQueryClient();
        const router=useRouter();
        function handleAddPatient(
            data: z.infer<typeof patientSchema>,
        ): Promise<z.infer<typeof patientSchema>> {
            return axios.post("/api/patient", data).then((res) => res.data);
        }

        const onSuccess = async () => {
            toast.success("Patient Created Successfully");
            await queryClient.invalidateQueries({queryKey:["patients"]});
            router.push("/patient/view");

        };
        const onError = (error: errorType) => {
            toast.error(viewError(error));
        };

        return useMutation({
            mutationFn: handleAddPatient,
            onError,
            onSuccess,
            retry: 0,
        });
    };

    const useHandleBulkUploadPatients = () => {
        const router=useRouter();
        const queryClient=useQueryClient();
        function handleAddPatient(
            data: FormData,
        ): Promise<bulkUploadResponseType> {
            return axios.post("/api/patient/bulk-upload", data).then((res) => res.data);
        }

        const onSuccess = async (response:bulkUploadResponseType) => {
            response.patients.forEach((el)=>{
                toast.success(`${el.name} Added Successfully`);
            })
            await queryClient.invalidateQueries({queryKey:["patients"]})
            router.push("/patient/view");
        };
        const onError = (error: errorType) => {
            toast.error(viewError(error));
        };

        return useMutation({
            mutationFn: handleAddPatient,
            onError,
            onSuccess,
            retry: 0,
        });
    };

    const useHandleSendInvite = () => {
        function handleSendInvite(
            data: invitePayloadType,
        ): Promise<invitePayloadType> {
            return axios.post("/api/patient/invite", data).then((res) => res.data);
        }

        const onSuccess = async () => {
            toast.success("Patient Invited Successfully");
        };
        const onError = (error: errorType) => {
            toast.error(viewError(error));
        };

        return useMutation({
            mutationFn: handleSendInvite,
            onError,
            onSuccess,
            retry: 0,
        });
    };
    const useHandleSendBulkInvite = () => {
        function handleSendInvite(
            data: invitePayloadType,
        ): Promise<invitePayloadType> {
            return axios.post("/api/patient/invite/bulk", data).then((res) => res.data);
        }

        const onSuccess = async () => {
            toast.success("Patient Invited Successfully");
        };
        const onError = (error: errorType) => {
            toast.error(viewError(error));
        };

        return useMutation({
            mutationFn: handleSendInvite,
            onError,
            onSuccess,
            retry: 0,
        });
    };
    const useHandlePatientVerification = (callback:()=>void) => {
        function handleSendInvite(
            data: {email:string},
        ): Promise<invitePayloadType> {
            return axios.post("/api/patient/verify", data).then((res) => res.data);
        }

        const onSuccess = async () => {
            toast.success("Patient Verified Successfully");
            callback();
            Cookies.set("verified",JSON.stringify(true))
        };
        const onError = (error: errorType) => {
            toast.error(viewError(error));
        };

        return useMutation({
            mutationFn: handleSendInvite,
            onError,
            onSuccess,
            retry: 0,
        });
    };
    const useFetchAllPatients = () => {

        function fetchPatients(): Promise<z.infer<typeof patientSchema>[]> {
            return axios.get("/api/patient").then((res) => res.data);
        }

        const onSuccess = async () => {
            toast.success("Patient Created Successfully");
        };
        const onError = (error: errorType) => {
            toast.error(viewError(error));
        };

        return useQuery({
            queryFn: fetchPatients,
            queryKey: [`patients`],
            retry: 0,
        });
    };
    const useFetchPatientChatHistory = (id:string) => {

        function fetchPatients(): Promise<fetchAllChatHistoryApiResponse> {
            return axios.get(`/api/history/patient?patientId=${id}`).then((res) => res.data);
        }

        const onSuccess = async () => {
            toast.success("Patient Created Successfully");
        };
        const onError = (error: errorType) => {
            toast.error(viewError(error));
        };

        return useQuery({
            queryFn: fetchPatients,
            queryKey: [`patient-history`],
            retry: 0,
        });
    };
    const useFetchSinglePatient = (id:string) => {

        return useQuery({
            queryFn: ()=>fetchSinglePatient(id),
            queryKey: [`patient`,id],
            retry: 0,

        });
    };
    const useFetchDoctorSpecialty = () => {
        function fetchPatients(): Promise<fetchAllSpecialtyApiResponse> {
            return axios.get("/api/specialty").then((res) => res.data);
        }

        const onSuccess = async () => {
            toast.success("Patient Created Successfully");
        };
        const onError = (error: errorType) => {
            toast.error(viewError(error));
        };

        return useQuery({
            queryFn: fetchPatients,
            queryKey: [`specialty`],
            retry: 0,
        });
    };
    return {
        useHandleAddPatientService,
        useFetchAllPatients,
        useHandleSendInvite,
        useFetchDoctorSpecialty,
        useFetchSinglePatient,
        useHandlePatientVerification,
        useHandleBulkUploadPatients,
        useFetchPatientChatHistory,
        useHandleSendBulkInvite
    };
}
