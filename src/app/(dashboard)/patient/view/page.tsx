"use client"

import Breadcrumb from "@/components/common/breadcrumbs/Breadcrumb";
import PatientsServices from "@/services/patients/patients.service";
import {DataTable} from "@/components/ui/data-table";
import {PATIENT_COLS} from "@/app/(dashboard)/patient/view/patient-columns";

const ViewPatients=()=>{
  const {useFetchAllPatients}=PatientsServices();
  const {data:patientData,isLoading:isPatientLoading}=useFetchAllPatients();
  return(
      <div>
        <Breadcrumb pageName={"View Patients"}/>
        {patientData&&<DataTable columns={PATIENT_COLS} data={patientData}/>}
      </div>

  )
}
export default ViewPatients;
