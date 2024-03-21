"use client"

import { ColumnDef } from "@tanstack/react-table"
import Link from "next/link";
import {Eye} from "lucide-react";
import PatientInviteForm from "@/components/modules/patients/patient-invite-form";
import {truncateString} from "@/lib/helpers";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
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
        header: "Patient",
        cell: ({ row }) => {
            return(
                <Link href={`/patient/view/${row.original.id}`} className={"flex flex-col"}>
                    <p className={"text-primary font-semibold"}>
                        {truncateString(row.original.name, 20)}
                    </p>
                    <p className={"text-graydark font-semibold"}>
                        {row.original.email}
                    </p>
                </Link>
            )
        },
    },
    // {
    //     accessorKey: "email",
    //     header: "Email",
    // },
    {
        accessorKey: "dateOfBirth",
        header: "Date Of Birth",
        cell: ({ row }) => {
            {/*@ts-ignore*/}
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
        cell: ({ row }) => {
            return(
                // <p className={""}>
                //     {truncateString(row.original.address,20)}
                // </p>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>{truncateString(row.original.address,10)}</TooltipTrigger>
                        <TooltipContent>
                            <p>{row.original.address}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            )
        },
    },
    {
        accessorKey: "medicalHistory",
        header: "Medical History",
        cell: ({ row }) => {
            return(
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>{truncateString(row.original.medicalHistory,15)}</TooltipTrigger>
                        <TooltipContent>
                            <p>{row.original.medicalHistory}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            )
        },
    },
    {
        accessorKey: "actions",
        header: "Actions",
        cell: ({ row }) => {
            return(
                <PatientInviteForm id={row.original.id} email={row.original.email} name={row.original.name}/>
           )
        },
    },
]
