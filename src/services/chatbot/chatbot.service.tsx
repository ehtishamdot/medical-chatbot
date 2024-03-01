"use client"
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";
import axios from "axios";
import {viewError} from "@/lib/helpers";
import {errorType} from "@/lib/types";
import {z} from "zod";
import {patientSchema} from "@/components/modules/patients/add-patient-form";
import {invitePayloadType} from "@/components/modules/patients/patient-invite-form";
import {fetchSinglePatient} from "@/services/patients/patient.api";
import {botSchema} from "@/components/modules/chatbots/manage-chatbot";
import {useRouter} from "next/navigation";
import {createChatbotApiResponse} from "@/lib/types/chatbot";

export default function ChatbotServices() {

    const useHandleAddChatbotService = () => {
        const queryClient=useQueryClient();
        const router=useRouter();
        function handleAddPatient(
            data: z.infer<typeof botSchema>,
        ): Promise<createChatbotApiResponse> {
            return axios.post("/api/bots", data).then((res) => res.data);
        }

        const onSuccess = async (response:createChatbotApiResponse) => {
            toast.success("Bot Created Successfully");
            await queryClient.invalidateQueries({queryKey:["bots"]});
            router.push(`/chatbots/${response.id}?specificity=${response.specificity}`)
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
        useHandleAddChatbotService,
        useFetchAllPatients,
        useHandleSendInvite,
        useFetchSinglePatient
    };
}
