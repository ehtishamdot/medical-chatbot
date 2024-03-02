"use client"
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";
import axios from "axios";
import {viewError} from "@/lib/helpers";
import {errorType} from "@/lib/types";
import {userType} from "@/lib/types/user";
import {z} from "zod";
import tokenService from "@/services/token/token.service";
import {patientFormSchema, patientSchema} from "@/components/modules/patients/add-patient-form";
import {invitePayloadType} from "@/components/modules/patients/patient-invite-form";
import {useCallback} from "react";
import {fetchSinglePatient} from "@/services/patients/patient.api";

export default function PatientsServices() {

    const useHandleAddPatientService = () => {
        const queryClient=useQueryClient();
        function handleAddPatient(
            data: z.infer<typeof patientSchema>,
        ): Promise<z.infer<typeof patientSchema>> {
            return axios.post("/api/patient", data).then((res) => res.data);
        }

        const onSuccess = async () => {
            toast.success("Patient Created Successfully");
            await queryClient.invalidateQueries({queryKey:["patients"]})

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
    const useHandlePatientVerification = (callback:()=>void) => {
        function handleSendInvite(
            data: {email:string},
        ): Promise<invitePayloadType> {
            return axios.post("/api/patient/verify", data).then((res) => res.data);
        }

        const onSuccess = async () => {
            toast.success("Patient Verified Successfully");
            callback();
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
    const useFetchSinglePatient = (id:string) => {

        return useQuery({
            queryFn: ()=>fetchSinglePatient(id),
            queryKey: [`patient`,id],
            retry: 0,

        });
    };

    return {
        useHandleAddPatientService,
        useFetchAllPatients,
        useHandleSendInvite,
        useFetchSinglePatient,
        useHandlePatientVerification
    };
}
