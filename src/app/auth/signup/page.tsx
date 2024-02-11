import SignupForm from "@/components/modules/auth/SignupForm";
import {getCountries} from "@/services/misc/misc.api";

const SignupPage=async ()=>{
  const data=await getCountries();
  return <SignupForm countries={data}/>
}
export default SignupPage
