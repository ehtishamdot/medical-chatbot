import QuestionsList from "@/components/modules/questions/QuestionsList";
import Breadcrumb from "@/components/common/breadcrumbs/Breadcrumb";

const QuestionsBySpecialization=({params}:{params:{specialization:string}})=>{
 const {specialization}=params;
 return(
     <div>
      <Breadcrumb pageName={decodeURIComponent(specialization)}/>
      <QuestionsList/>
     </div>
 )
}
export default QuestionsBySpecialization;
