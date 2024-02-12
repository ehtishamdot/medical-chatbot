import { BRAND } from "@/lib/types/brand";
import Image from "next/image";
import {DASHBOARD_PATIENTS, PATIENTS} from "@/lib/constants";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";

const brandData: any = [
  {
    logo: "/images/brand/brand-01.svg",
    name: "Mohib",
    age: 21,
    gender: "Male",
    country: "US",
    conversion: 4.8,
  },
  {
    logo: "/images/brand/brand-02.svg",
    name: "Ehti",
    gender: "Male",
    country: "US",
    age: 21,
    visitors: 2.2,
    revenues: "4,635",
    sales: 467,
    conversion: 4.3,
  },
  {
    logo: "/images/brand/brand-03.svg",
    name: "Marcus",
    gender: "Male",
    country: "US",
    age: 21,
    visitors: 2.1,
    revenues: "4,290",
    sales: 420,
    conversion: 3.7,
  },
  {
    logo: "/images/brand/brand-04.svg",
    name: "John",
    gender: "Male",
    country: "US",
    age: 21,
    visitors: 1.5,
    revenues: "3,580",
    sales: 389,
    conversion: 2.5,
  },
  {
    logo: "/images/brand/brand-05.svg",
    name: "Micheal",
    gender: "Male",
    country: "US",
    age: 21,
    visitors: 3.5,
    revenues: "6,768",
    sales: 390,
    conversion: 4.2,
  },
  {
    logo: "/images/brand/brand-05.svg",
    name: "Sarah",
    gender: "Female",
    country: "US",
    age: 21,
    visitors: 3.5,
    revenues: "6,768",
    sales: 390,
    conversion: 4.2,
  },
  {
    logo: "/images/brand/brand-05.svg",
    name: "Clarke",
    gender: "Male",
    country: "US",
    age: 21,
    visitors: 3.5,
    revenues: "6,768",
    sales: 390,
    conversion: 4.2,
  },

];

const TableOne = () => {
  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        Patients Overview
      </h4>

      <Table className={'bg-white'}>
        <TableHeader>
          <TableRow className={'border-b border-[#eee] bg-gray-2 text-left dark:bg-meta-4'}>
            <TableHead className={'min-w-[100px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11'}>ID</TableHead>
            <TableHead className={'min-w-[100px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11'}>Name</TableHead>
            <TableHead className={'min-w-[220px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11'}>Email</TableHead>
            <TableHead className={'min-w-[100px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11'}>Gender</TableHead>
            <TableHead className={'min-w-[150px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11'}>DOB</TableHead>
            <TableHead className={'min-w-[220px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11'}>Clinical Assessment</TableHead>
            <TableHead className={'min-w-[220px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11'}>Medical History</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {PATIENTS.map((patient,index:number) => (
              <TableRow key={index}>
                <TableCell className={"border-t border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11"}>{patient.patientID}</TableCell>
                <TableCell className={"border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11"}>{patient.firstName}</TableCell>
                <TableCell className={"border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11"}>{patient.email}</TableCell>
                <TableCell className={"border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11"}>{patient.gender}</TableCell>
                <TableCell className={"border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11"}>{patient.dateOfBirth}</TableCell>
                <TableCell className={"border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11"}>{patient.medicationInformation}</TableCell>
                <TableCell className={"border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11"}>{patient.medicalHistory}</TableCell>
              </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableOne;
