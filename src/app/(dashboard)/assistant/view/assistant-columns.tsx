/* eslint-disable react-hooks/rules-of-hooks */
"use client"

import { ColumnDef } from "@tanstack/react-table"
import AssistantService from "@/services/assistant/assistant.service";
import {Trash2} from "lucide-react";

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
    {
        accessorKey: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const {useHandleDeleteAssistant}=AssistantService()
            const {mutate}=useHandleDeleteAssistant();
            return(
                <div className={"flex  gap-4 items-center"}>
                    <span onClick={()=>mutate({id:row.original.id})} className={"cursor-pointer text-graydark"}><Trash2/></span>
                </div>
            )
        },
    },
]
