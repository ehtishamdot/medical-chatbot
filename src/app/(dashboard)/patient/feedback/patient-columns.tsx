"use client"

import { ColumnDef } from "@tanstack/react-table"
import {patientFeedbackType} from "@/lib/types/patients";
import {Rating} from "react-simple-star-rating";


export const FEEDBACK_COLS: ColumnDef<patientFeedbackType>[] = [
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => {
            console.log(row.getValue("id"))
            return(
                    <p>{row?.original?.patient?.name}</p>

            )
        },
    },
    {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => {
            console.log(row.getValue("id"))
            return(
                <>
                    <p>{row?.original?.patient?.email}</p>
                </>

            )
        },
    },
    {
        accessorKey: "ratings",
        header: "Ratings",
        cell: ({ row }) => {
            console.log(row.getValue("id"))
            return(
                <>
                <Rating readonly={true} size={30} SVGstyle={{display:"inline"}} initialValue={row?.original?.feedback?.rating}/>
                </>

            )
        },
    },
    {
        accessorKey: "comment",
        header: "Comments",
        cell: ({ row }) => {
            console.log(row.getValue("id"))
            return(
                <>
                    {row?.original?.feedback?.comment&&<p>{row.original.feedback.comment}</p>}
                </>

            )
        },
    },
]
