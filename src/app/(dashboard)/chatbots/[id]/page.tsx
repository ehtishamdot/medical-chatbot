import QuestionsList from "@/components/modules/questions/QuestionsList";
import Breadcrumb from "@/components/common/breadcrumbs/Breadcrumb";
import {cookies} from "next/headers";
import {notFound} from "next/navigation";

const ChatbotDetails=({params,searchParams}:{params:{id:string};searchParams:{specificity:string}})=>{
 const {id}=params;
 const {specificity}=searchParams;
 console.log(specificity,'specificity')

 if(!id||!specificity){
     notFound();
 }
 return(
     <div>
      {/*<Breadcrumb pageName={decodeURIComponent(name)}/>*/}
      <QuestionsList specificity={specificity} id={id}/>
     </div>
 )
}
export default ChatbotDetails;
