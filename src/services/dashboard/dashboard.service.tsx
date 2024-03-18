
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
import {ratingFormSchema} from "@/components/modules/chat/chat-feedback";
import {patientFeedbackType} from "@/lib/types/patients";

type patientType=z.infer<typeof patientSchema>;
type bulkUploadResponseType={
    message:string;
    patients:patientType[]
}
export default function DashboardService() {

    const useFetchDashboardInsights = () => {

        function fetchInsights(): Promise<botStatsType> {
            return axios.get("/api/dashboard").then((res) => res.data);
        }

        return useQuery({
            queryFn: fetchInsights,
            queryKey: [`dashboard`],
            retry: 0,
        });
    };




    return {
        useFetchDashboardInsights,
    };
}
