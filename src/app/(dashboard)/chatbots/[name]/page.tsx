import QuestionsList from "@/components/modules/questions/QuestionsList";
import Breadcrumb from "@/components/common/breadcrumbs/Breadcrumb";

const ChatbotDetails=({params}:{params:{name:string}})=>{
 const {name}=params;
 return(
     <div>
      <Breadcrumb pageName={decodeURIComponent(name)}/>
      <QuestionsList/>
     </div>
 )
}
export default ChatbotDetails;
