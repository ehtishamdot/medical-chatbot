
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
interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
        data: TData[]
}

export function PatientsDataTable<TData, TValue>({
                                             columns,
                                             data,
                                         }: DataTableProps<TData, TValue>) {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
        []
    )
    const [rowSelection, setRowSelection] = useState({})
    useEffect(()=>{
        console.log(rowSelection)
    },[rowSelection])

    const table = useReactTable({
        data,
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        columns,
        getCoreRowModel: getCoreRowModel(),
        onRowSelectionChange: setRowSelection,
        state:{
            columnFilters,
            rowSelection
        }
    })
    const selectedPatients=useMemo(()=>{
        console.log(rowSelection,"select");
        let emails:string[]=[];
          data.forEach((el,index)=>{
            if(rowSelection[index as keyof typeof rowSelection]===true){
                emails.push(el.email)
            }
        })
        return emails;
    },[rowSelection,data])

    const selectedPatientsID=useMemo(()=>{
        console.log(rowSelection,"select");
        let emails:string[]=[];
        data.forEach((el,index)=>{
            if(rowSelection[index as keyof typeof rowSelection]===true){
                emails.push(el.id)
            }
        })
        return emails;
    },[rowSelection,data])
    const selectedPatientsName=useMemo(()=>{
        console.log(rowSelection,"select");
        let emails:string[]=[];
        data.forEach((el,index)=>{
            if(rowSelection[index as keyof typeof rowSelection]===true){
                emails.push(el.name)
            }
        })
        return emails;
    },[rowSelection,data])

    return (
        <div>
            <div className="flex items-center py-4">
                <PatientInviteForm   id={selectedPatientsID} email={selectedPatients} name={selectedPatientsName}/>
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
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger className={"flex items-center"}>
                                                        {header.isPlaceholder
                                                            ? null
                                                            : <p className={`${header.column.getFilterValue()&&"text-primary"}`}>
                                                                {flexRender(
                                                                        header.column.columnDef.header,
                                                                        header.getContext()
                                                                    )}
                                                            </p> }
                                                        <IoMdMore/>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent className={"p-4"}>
                                                        <h4 className={"text-primary font-semibold"}>
                                                            Filter By:
                                                        </h4>
                                                        <Label>{header.isPlaceholder
                                                            ? null
                                                            : flexRender(
                                                                header.column.columnDef.header,
                                                                header.getContext()
                                                            )} </Label>
                                                        <Input
                                                            placeholder="Search..."
                                                            value={(header.column.getFilterValue()||"") as string}
                                                            onChange={(e)=>{
                                                                header.column.setFilterValue(e.target.value)
                                                            }}
                                                            className="max-w-sm"
                                                        />
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
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
