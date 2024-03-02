"use client"
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";
import axios from "axios";
import {viewError} from "@/lib/helpers";
import {errorType} from "@/lib/types";
import {z} from "zod";
import {patientSchema} from "@/components/modules/patients/add-patient-form";
import {fetchSinglePatient} from "@/services/patients/patient.api";
import {botSchema, DISEASE_ENUM} from "@/components/modules/chatbots/manage-chatbot";
import {useRouter} from "next/navigation";
import {createChatbotApiResponse, fetchAllChatbotsApiResponse} from "@/lib/types/chatbot";

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
            if(response.specificity===DISEASE_ENUM.DISEASE_SPECIFIC){
                router.push(`/chatbots/${response.id}?specificity=${response.specificity}&diseaseId=${response.diseaseId}`)
            }
            else{
                router.push(`/chatbots/${response.id}?specificity=${response.specificity}`)
            }
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

    const useFetchAllChatbots = () => {
        function fetchChatbots(): Promise<fetchAllChatbotsApiResponse> {
            return axios.get("/api/bots/all").then((res) => res.data);
        }

        return useQuery({
            queryFn: fetchChatbots,
            queryKey: [`chatbots`],
            retry: 0,
        });
    };
    const useFetchAllChatbotQuestions = () => {
        function fetchChatbots(): Promise<fetchAllChatbotsApiResponse> {
            return axios.get("/api/bots/all").then((res) => res.data);
        }

        return useQuery({
            queryFn: fetchChatbots,
            queryKey: [`chatbots`],
            retry: 0,
        });
    };

    return {
        useHandleAddChatbotService,
        useFetchAllChatbots,
        useFetchAllChatbotQuestions
    };
}
