import {z} from "zod";
import {patientSchema} from "@/components/modules/patients/add-patient-form";

export async function fetchSinglePatient(id:string): Promise<z.infer<typeof patientSchema>> {
    const patient=await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/patient/profile?patientId=${id}`)
    return patient.json()
}
