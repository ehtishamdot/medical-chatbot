"use client"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import Breadcrumb from "@/components/common/breadcrumbs/Breadcrumb";
import PatientsServices from "@/services/patients/patients.service";

const ViewPatients=()=>{
  const {useFetchAllPatients}=PatientsServices();
  const {data:patientData,isLoading:isPatientLoading}=useFetchAllPatients();
  return(
      <div>
        <Breadcrumb pageName={"View Patients"}/>
        <Table className={'bg-white'}>
          <TableHeader>
            <TableRow className={'border-b border-[#eee] bg-gray-2 text-left dark:bg-meta-4'}>
              <TableHead className={'min-w-[100px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11'}>ID</TableHead>
              <TableHead className={'min-w-[150px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11'}>Name</TableHead>
              <TableHead className={'min-w-[150px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11'}>Email</TableHead>
              <TableHead className={'min-w-[150px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11'}>DOB</TableHead>
              <TableHead className={'min-w-[150px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11'}>Gender</TableHead>
              <TableHead className={'min-w-[150px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11'}>Phone</TableHead>
              <TableHead className={'min-w-[150px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11'}>Address</TableHead>
              <TableHead className={'min-w-[200px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11'}>Medical History</TableHead>
              <TableHead className={'min-w-[200px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11'}>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patientData?.map((patient,index:number) => (
                <TableRow key={index}>
                  <TableCell className={"border-t border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11"}>{index+1}</TableCell>
                  <TableCell className={"border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11"}>{patient.name}</TableCell>
                  <TableCell className={"border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11"}>{patient.email}</TableCell>
                  <TableCell className={"border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11"}>{patient.dateOfBirth.split("T")[0]}</TableCell>
                  <TableCell className={"border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11"}>{patient.gender}</TableCell>
                  <TableCell className={"border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11"}>{patient.phone}</TableCell>
                  <TableCell className={"border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11"}>{patient.address}</TableCell>
                  <TableCell className={"border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11"}>{patient.medicalHistory}</TableCell>
                  <TableCell className={"border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark text-primary underline cursor-pointer xl:pl-11"}>View</TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

  )
}
export default ViewPatients;
