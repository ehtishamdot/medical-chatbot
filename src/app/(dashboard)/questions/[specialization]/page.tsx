import QuestionsList from "@/components/modules/questions/QuestionsList";
import Breadcrumb from "@/components/common/breadcrumbs/Breadcrumb";
import {cookies} from "next/headers";

const QuestionsBySpecialization=({params}:{params:{specialization:string}})=>{
 const {specialization}=params;
    const unparsedUser=cookies().get("user")?.value;
    let user;
    if(unparsedUser){
        user=JSON.parse(unparsedUser);
    }
 return(
     <div>
      <Breadcrumb pageName={decodeURIComponent(specialization)}/>
      <QuestionsList user={user}/>
     </div>
 )
}
export default QuestionsBySpecialization;
