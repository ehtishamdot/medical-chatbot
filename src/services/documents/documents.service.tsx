

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
import {fetchAllDocsApiResponse} from "@/lib/types/docs";


export default function DocumentService() {

    const useHandleUploadDocument = () => {
        const queryClient=useQueryClient();
        function handleAddPatient(
            data: FormData,
        ): Promise<any> {
            return axios.post("/api/documents", data).then((res) => res.data);
        }

        const onSuccess = async () => {
            toast.success("Document Uploaded Successfully");
            await queryClient.invalidateQueries({queryKey:["docs"]});
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





    const useFetchAllDocuments = () => {
        function fetchPatients(): Promise<fetchAllDocsApiResponse> {
            return axios.get("/api/documents").then((res) => res.data);
        }
        return useQuery({
            queryFn: fetchPatients,
            queryKey: [`docs`],
            retry: 0,
        });
    };

    return {
        useHandleUploadDocument,
       useFetchAllDocuments
    };
}
