"use client"

import { ColumnDef } from "@tanstack/react-table"
import {patientFeedbackType} from "@/lib/types/patients";
import {Rating} from "react-simple-star-rating";


export const FEEDBACK_COLS: ColumnDef<patientFeedbackType>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "ratings",
        header: "Ratings",
        cell: ({ row }) => {
            console.log(row.getValue("id"))
            return(
                <>
                {row?.original?.Feedback[0]?.rating&&<Rating readonly={true} size={30} SVGstyle={{display:"inline"}} initialValue={row?.original?.Feedback[0]?.rating}/>}
                    {!row?.original?.Feedback[0]?.rating&&<p>-</p>}
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
                    {row?.original?.Feedback[0]?.comment&&<p>{row.original.Feedback[0].comment}</p>}
                    {!row?.original?.Feedback[0]?.comment&&<p>-</p>}
                </>

            )
        },
    },
]
