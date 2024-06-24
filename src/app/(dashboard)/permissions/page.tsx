"use client"

import Breadcrumb from "@/components/common/breadcrumbs/Breadcrumb";
import LoadingPage from "@/components/common/loaders/loading-page";
import {DocumentsDataTable} from "@/components/ui/data-table/documents";
import UsersService from "@/services/users/users.service";
import {USER_COLS} from "@/app/(dashboard)/permissions/user-columns";

const ViewDocs=()=>{
  const {useFetchAllUsers}=UsersService();
  const {data:userData,isLoading:iseUserDataPending}=useFetchAllUsers();
    if(iseUserDataPending){
        return <LoadingPage/>
    }
  return(
      <div>
        <Breadcrumb pageName={"Users"}/>
          {/*@ts-ignore*/}
        {userData&&<DocumentsDataTable columns={USER_COLS} data={userData}/>}
      </div>
  )
}
export default ViewDocs;
