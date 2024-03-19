"use client"

import Breadcrumb from "@/components/common/breadcrumbs/Breadcrumb";
import {DataTable} from "@/components/ui/data-table";
import LoadingPage from "@/components/common/loaders/loading-page";
import FeedbackService from "@/services/feedback/feedback.service";
import {FEEDBACK_COLS} from "@/app/(dashboard)/patient/feedback/patient-columns";

const ViewPatients=()=>{
  const {useFetchAllFeedback}=FeedbackService();
  const {data:feedback,isLoading:isFeedbackLoading}=useFetchAllFeedback();
  const feedbackData=feedback?.filter((el)=>el.Feedback.length>0);
  console.log(feedbackData,"feedback")
    if(isFeedbackLoading){
        return <LoadingPage/>
    }
  return(
      <div>
        <Breadcrumb pageName={"Patient Feedback"}/>
          {/*@ts-ignore*/}
        {feedbackData&&<DataTable columns={FEEDBACK_COLS} data={feedbackData}/>}
      </div>

  )
}
export default ViewPatients;
