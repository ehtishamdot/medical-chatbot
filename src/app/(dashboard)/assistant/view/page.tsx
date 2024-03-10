"use client"

import Breadcrumb from "@/components/common/breadcrumbs/Breadcrumb";
import {DataTable} from "@/components/ui/data-table";
import LoadingPage from "@/components/common/loaders/loading-page";
import AssistantService from "@/services/assistant/assistant.service";
import {ASSISTANT_COLS} from "@/app/(dashboard)/assistant/view/assistant-columns";

const ViewAssistants=()=>{
    const {useFetchAllAssistants}=AssistantService();
    const {data:assistantData,isLoading:isAssistantLoading}=useFetchAllAssistants();
    if(isAssistantLoading){
        return <LoadingPage/>
    }
    return(
        <div>
            <Breadcrumb pageName={"View Patients"}/>
            {/*@ts-ignore*/}
            {assistantData&&<DataTable columns={ASSISTANT_COLS} data={assistantData}/>}
        </div>

    )
}
export default ViewAssistants;
