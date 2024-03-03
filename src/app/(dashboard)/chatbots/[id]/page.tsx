import QuestionsList from "@/components/modules/questions/QuestionsList";
import {notFound} from "next/navigation";

const ChatbotDetails=({params,searchParams}:{params:{id:string};searchParams:{specificity:string;diseaseId:string}})=>{
 const {id}=params;
 const {specificity,diseaseId}=searchParams;

 if(!id||!specificity){
     notFound();
 }
 if(specificity==="DISEASE_SPECIFIC"&&!diseaseId){
     notFound();
 }
 return(
     <div>
      <QuestionsList diseaseId={diseaseId} specificity={specificity} id={id}/>
     </div>
 )
}
export default ChatbotDetails;
