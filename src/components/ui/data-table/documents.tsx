

"use client"
import { IoMdMore } from "react-icons/io";

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    ColumnFiltersState,
    getFilteredRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { Input } from "@/components/ui/input"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {useEffect, useMemo, useState} from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {Label} from "@/components/ui/label";
import PatientInviteForm from "@/components/modules/patients/patient-invite-form";
import DocUploadForm from "@/components/modules/documents/doc-upload-form";
interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}

export function DocumentsDataTable<TData, TValue>({
                                                     columns,
                                                     data,
                                                 }: DataTableProps<TData, TValue>) {

    const table = useReactTable({
        data,
        getFilteredRowModel: getFilteredRowModel(),
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <div>
            <div className="flex items-center py-4">
                <DocUploadForm/>
            </div>
            <div className="rounded-md">
                <Table className={"bg-white"}>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow className={"sticky border-b border-[#eee] bg-gray-2 text-left dark:bg-meta-4"}
                                      key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead className={"px-4 py-4 font-medium text-black dark:text-white xl:pl-11"} key={header.id}>
                                            {header.column.getCanFilter()&&<div>
                                                {header.isPlaceholder
                                                    ? null
                                                    : <p className={`${header.column.getFilterValue()&&"text-primary"}`}>
                                                        {flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext()
                                                        )}
                                                    </p> }
                                            </div>}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell className={"border-b border-[#eee]  px-4 py-5 pl-9 dark:border-strokedark xl:pl-11"} key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
