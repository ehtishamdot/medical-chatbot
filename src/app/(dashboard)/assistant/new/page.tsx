import Breadcrumb from "@/components/common/breadcrumbs/Breadcrumb";
import AddAssistantForm from "@/components/modules/assistants/add-assistant-form";

const NewPatient=()=>{
  return(
      <div>
          <Breadcrumb pageName={"Add Assistant"}/>
          <AddAssistantForm/>
      </div>
  )
}
export default NewPatient;
