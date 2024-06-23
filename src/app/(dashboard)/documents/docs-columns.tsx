"use client"

import { ColumnDef } from "@tanstack/react-table"
import Link from "next/link";
import {truncateString} from "@/lib/helpers";
import {docType} from "@/lib/types/docs";


export const DOC_COLS: ColumnDef<docType>[] = [
    {
        accessorKey: "name",
        header: "Document",
        cell: ({ row }) => {
            return(
                <Link href={row.original.url} target={"_blank"} className={"flex flex-col"}>
                    <p className={"text-primary font-semibold"}>
                        {truncateString(row.original.name, 30)}
                    </p>
                </Link>
            )
        },
    },
    {
        accessorKey: "createdAt",
        header: "Upload Date",
        cell: ({ row }) => {
            return(
                <p>{row.original.createdAt.split("T")[0]}</p>
            )
        },
    },
    {
        accessorKey: "actions",
        header: "Actions",
        enableColumnFilter:false,
        cell: ({ row }) => {
            return(
                <p className={"text-primary cursor-pointer underline"}>View Summary</p>
           )
        },
    },
]
