
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
import {fetchAllChatHistoryApiResponse} from "@/lib/types/history";
import {cookies} from "next/headers";
import Cookies from "js-cookie";
import {useRouter} from "next/navigation";
import {appointmentSchema} from "@/components/modules/appointments/create-appointments";

type patientType=z.infer<typeof patientSchema>;
type bulkUploadResponseType={
    message:string;
    patients:patientType[]
}
export default function AppointmentService() {

    const useHandleCreateAppointmentService = () => {
        const queryClient=useQueryClient();
        function handleAddPatient(
            data: z.infer<typeof appointmentSchema>,
        ): Promise<z.infer<typeof appointmentSchema>> {
            return axios.post("/api/appointments", data).then((res) => res.data);
        }

        const onSuccess = async () => {
            toast.success("Appointment Created Successfully");
            await queryClient.invalidateQueries({queryKey:["appointment"]});
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

    const useFetchAllAppointments = () => {

        function fetchPatients(): Promise<z.infer<typeof appointmentSchema>[]> {
            return axios.get("/api/appointments").then((res) => res.data);
        }

        return useQuery({
            queryFn: fetchPatients,
            queryKey: [`appointment`],
            retry: 0,
        });
    };


    return {
        useHandleCreateAppointmentService,
        useFetchAllAppointments
    };
}
