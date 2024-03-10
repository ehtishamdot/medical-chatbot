"use client"
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";
import axios from "axios";
import {viewError} from "@/lib/helpers";
import {errorType} from "@/lib/types";
import {z} from "zod";
import {patientSchema} from "@/components/modules/patients/add-patient-form";
import {assistantFormSchema} from "@/components/modules/assistants/add-assistant-form";

export default function AssistantService() {

    const useHandleAddAssistantService = () => {
        const queryClient=useQueryClient();
        function handleAddPatient(
            data: z.infer<typeof assistantFormSchema>,
        ): Promise<z.infer<typeof assistantFormSchema>> {
            return axios.post("/api/assistant", data).then((res) => res.data);
        }

        const onSuccess = async () => {
            toast.success("Assistant Created Successfully");
            await queryClient.invalidateQueries({queryKey:["assistant"]})

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

    const useFetchAllAssistants= () => {
        function fetchPatients(): Promise<z.infer<typeof assistantFormSchema>[]> {
            return axios.get("/api/assistant").then((res) => res.data);
        }

        const onSuccess = async () => {
            toast.success("Patient Created Successfully");
        };
        const onError = (error: errorType) => {
            toast.error(viewError(error));
        };

        return useQuery({
            queryFn: fetchPatients,
            queryKey: [`assistant`],
            retry: 0,
        });
    };

    return {
        useHandleAddAssistantService,
        useFetchAllAssistants,
    };
}

