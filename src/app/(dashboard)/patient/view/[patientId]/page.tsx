import SinglePatient from "@/components/modules/patients/single-patient";

const SinglePatientPage=async ({params}:{params:{patientId:string}})=>{
    const {patientId}=params;
    return(
            <SinglePatient id={patientId}/>
    )

}
export default SinglePatientPage;
