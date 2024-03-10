"use client"

import { ColumnDef } from "@tanstack/react-table"

export type assistantType = {
    name: string
    email: string
    id:string
}

export const ASSISTANT_COLS: ColumnDef<assistantType>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "email",
        header: "Email",
    },
]
