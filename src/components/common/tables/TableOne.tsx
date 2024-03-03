import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import PatientsServices from "@/services/patients/patients.service";

const PatientsOverviewTable = () => {
  const {useFetchAllPatients}=PatientsServices();
  const {data:patientData,isLoading:isPatientDataLoading}=useFetchAllPatients();
  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 min-h-[200px] shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        Patients Overview
      </h4>

      <Table className={'bg-white'}>
        <TableHeader>
          <TableRow className={'border-b border-[#eee] bg-gray-2 text-left dark:bg-meta-4'}>
            <TableHead className={'min-w-[100px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11'}>ID</TableHead>
            <TableHead className={'min-w-[200px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11'}>Name</TableHead>
            <TableHead className={'min-w-[200px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11'}>Email</TableHead>
            <TableHead className={' px-4 py-4 font-medium text-black dark:text-white xl:pl-11'}>Gender</TableHead>
            <TableHead className={'min-w-[150px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11'}>DOB</TableHead>
            <TableHead className={'min-w-[200px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11'}>Address</TableHead>
            <TableHead className={' px-4 py-4 font-medium text-black dark:text-white xl:pl-11'}>Phone</TableHead>
            <TableHead className={'min-w-[200px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11'}>Medical History</TableHead>
          </TableRow>
        </TableHeader>
        {isPatientDataLoading?<TableBody>Loading</TableBody>:<TableBody>
          {patientData?.map((patient,index:number) => (
              <TableRow key={index}>
                <TableCell className={"border-t border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11"}>{index+1}</TableCell>
                <TableCell className={"border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11"}>{patient.name}</TableCell>
                <TableCell className={"border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11"}>{patient.email}</TableCell>
                <TableCell className={"border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11"}>{patient.gender}</TableCell>
                <TableCell className={"border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11"}>{patient.dateOfBirth.split("T")[0]}</TableCell>
                <TableCell className={"border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11"}>{patient.address}</TableCell>
                <TableCell className={"border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11"}>{patient.phone}</TableCell>
                <TableCell className={"border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11"}>{patient.medicalHistory}</TableCell>
              </TableRow>
          ))}
        </TableBody>}
      </Table>
    </div>
  );
};

export default PatientsOverviewTable;
