"use client"

import Breadcrumb from "@/components/common/breadcrumbs/Breadcrumb";
import {DOC_COLS} from "@/app/(dashboard)/documents/docs-columns";
import LoadingPage from "@/components/common/loaders/loading-page";
import DocumentService from "@/services/documents/documents.service";
import {DocumentsDataTable} from "@/components/ui/data-table/documents";

const ViewDocs=()=>{
  const {useFetchAllDocuments}=DocumentService();
  const {data:docsData,isLoading:isDocsDataLoading}=useFetchAllDocuments();
    if(isDocsDataLoading){
        return <LoadingPage/>
    }
  return(
      <div>
        <Breadcrumb pageName={"Documents"}/>
          {/*@ts-ignore*/}
        {docsData&&<DocumentsDataTable columns={DOC_COLS} data={docsData}/>}
      </div>
  )
}
export default ViewDocs;
