"use client"

import { ColumnDef } from "@tanstack/react-table"
import Link from "next/link";
import {Eye} from "lucide-react";
import PatientInviteForm from "@/components/modules/patients/patient-invite-form";
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type PatientType = {
    name: string
    email: string
    id:string
    dateOfBirth: string
    gender: string
    phone:string
    address:string
    medicalHistory:string
}

export const PATIENT_COLS: ColumnDef<PatientType>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "dateOfBirth",
        header: "Date Of Birth",
        cell: ({ row }) => {
            return <div>{row.getValue("dateOfBirth").split("T")[0]}</div>
        },
    },
    {
        accessorKey: "gender",
        header: "Gender",
    },
    {
        accessorKey: "phone",
        header: "Phone",
    },
    {
        accessorKey: "address",
        header: "Address",
    },
    {
        accessorKey: "medicalHistory",
        header: "Medical History",
    },
    {
        accessorKey: "actions",
        header: "Actions",
        cell: ({ row }) => {
            console.log(row.getValue("id"))
            return(
               <div className={"flex justify-center gap-4 items-center"}>
                   <Link className={"text-graydark"} href={`/patient/view/${row.original.id}`}><Eye/></Link>
                   <PatientInviteForm id={row.original.id} email={row.original.email} name={row.original.name}/>
               </div>
           )
        },
    },
]
