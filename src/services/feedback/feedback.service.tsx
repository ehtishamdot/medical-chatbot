
"use client"
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";
import axios from "axios";
import {viewError} from "@/lib/helpers";
import {errorType} from "@/lib/types";
import {fetchAllSpecialtyApiResponse, userType} from "@/lib/types/user.dts";
import {z} from "zod";
import tokenService from "@/services/token/token.service";
import {BulkUploadSchema, patientFormSchema, patientSchema} from "@/components/modules/patients/add-patient-form";
import {invitePayloadType} from "@/components/modules/patients/patient-invite-form";
import {useCallback} from "react";
import {fetchSinglePatient} from "@/services/patients/patient.api";
import {ratingFormSchema} from "@/components/modules/chat/chat-feedback";
import {patientFeedbackType} from "@/lib/types/patients";

type patientType=z.infer<typeof patientSchema>;
type bulkUploadResponseType={
    message:string;
    patients:patientType[]
}
export default function FeedbackService() {

    const useHandleAddFeedback = () => {
        const queryClient=useQueryClient();
        function handleAddPatient(
            data: z.infer<typeof ratingFormSchema>,
        ): Promise<z.infer<typeof ratingFormSchema>> {
            return axios.post("/api/patient/feedback", data).then((res) => res.data);
        }

        const onSuccess = async () => {
            toast.success("Feedback Added Successfully");
            await queryClient.invalidateQueries({queryKey:["feedback"]})

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


    const useFetchAllFeedback = (specificity:string,id:string,diseaseId:string|undefined) => {

        function fetchPatients(): Promise<patientFeedbackType[]> {
            return axios.get(`/api/patient/feedback?specialtyId=${id}&phaseType=${specificity}${diseaseId?`&diseaseId=${diseaseId}`:""}`).then((res) => res.data);
        }

        const onSuccess = async () => {
            toast.success("Patient Created Successfully");
        };
        const onError = (error: errorType) => {
            toast.error(viewError(error));
        };

        return useQuery({
            queryFn: fetchPatients,
            queryKey: [`feedback`,specificity,id,diseaseId],
            retry: 0,
        });
    };

    return {
        useFetchAllFeedback,
        useHandleAddFeedback
    };
}
