import QuestionsList from "@/components/modules/questions/QuestionsList";
import Breadcrumb from "@/components/common/breadcrumbs/Breadcrumb";
import {cookies} from "next/headers";

const ChatbotDetails=({params}:{params:{name:string}})=>{
 const {name}=params;
 const unparsedUser=cookies().get("user")?.value;
 let user;
 if(unparsedUser){
     user=JSON.parse(unparsedUser);
 }
 return(
     <div>
      <Breadcrumb pageName={decodeURIComponent(name)}/>
      <QuestionsList user={user}/>
     </div>
 )
}
export default ChatbotDetails;
