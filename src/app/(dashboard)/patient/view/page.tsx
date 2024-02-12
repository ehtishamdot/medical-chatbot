
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {PATIENTS} from "@/lib/constants";
import Breadcrumb from "@/components/common/breadcrumbs/Breadcrumb";

const ViewPatients=()=>{
  return(
      <div>
        <Breadcrumb pageName={"View Patients"}/>
        <Table className={'bg-white'}>
          <TableHeader>
            <TableRow className={'border-b border-[#eee] bg-gray-2 text-left dark:bg-meta-4'}>
              <TableHead className={'min-w-[220px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11'}>ID</TableHead>
              <TableHead className={'min-w-[220px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11'}>First Name</TableHead>
              <TableHead className={'min-w-[220px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11'}>Last Name</TableHead>
              <TableHead className={'min-w-[220px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11'}>Email</TableHead>
              <TableHead className={'min-w-[220px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11'}>Gender</TableHead>
              <TableHead className={'min-w-[220px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11'}>DOB</TableHead>
              <TableHead className={'min-w-[220px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11'}>Phone</TableHead>
              <TableHead className={'min-w-[220px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11'}>Address</TableHead>
              <TableHead className={'min-w-[220px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11'}>Medical Info</TableHead>
              <TableHead className={'min-w-[220px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11'}>Medical History</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {PATIENTS.map((patient,index:number) => (
                <TableRow key={index}>
                  <TableCell className={"border-t border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11"}>{patient.patientID}</TableCell>
                  <TableCell className={"border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11"}>{patient.firstName}</TableCell>
                  <TableCell className={"border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11"}>{patient.lastName}</TableCell>
                  <TableCell className={"border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11"}>{patient.email}</TableCell>
                  <TableCell className={"border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11"}>{patient.gender}</TableCell>
                  <TableCell className={"border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11"}>{patient.dateOfBirth}</TableCell>
                  <TableCell className={"border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11"}>{patient.phoneNumber}</TableCell>
                  <TableCell className={"border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11"}>{patient.address}</TableCell>
                  <TableCell className={"border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11"}>{patient.medicationInformation}</TableCell>
                  <TableCell className={"border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11"}>{patient.medicalHistory}</TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

  )
}
export default ViewPatients;
