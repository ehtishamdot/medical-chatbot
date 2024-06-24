"use client"

import { ColumnDef } from "@tanstack/react-table"
import Link from "next/link";
import {truncateString} from "@/lib/helpers";
import {allUsers} from "@/lib/types/user";


export const USER_COLS: ColumnDef<allUsers>[] = [
    {
        accessorKey: "name",
        header: "UserName",
        cell: ({ row }) => {
            return(
                <Link href={`/permissions/${row.original.id}`} className={"flex flex-col"}>
                    <p className={"text-primary font-semibold"}>
                        {truncateString(row.original.username, 20)}
                    </p>
                    <p className={"text-graydark font-semibold"}>
                        {row.original.email}
                    </p>
                </Link>
            )
        },
    },
    {
        accessorKey: "role",
        header: "Role",
    },
    {
        accessorKey: "countryAndLanguage",
        header: "Country and Language",
    },
    {
        accessorKey: "createdAt",
        header: "Created At",
        cell: ({ row }) => {
            return(
                <p>{row.original.createdAt.split("T")[0]}</p>
            )
        },
    },
]
