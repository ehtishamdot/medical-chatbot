import Breadcrumb from "@/components/common/breadcrumbs/Breadcrumb";
import AddPatientForm from "@/components/modules/patients/add-patient-form";

const NewPatient=()=>{
  return(
      <div>
          <Breadcrumb pageName={"Add Patients"}/>
          <AddPatientForm/>
      </div>
  )
}
export default NewPatient;
