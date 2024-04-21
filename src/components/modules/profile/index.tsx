import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import ProfileUpdateForm from "@/components/modules/profile/profile-update-form";
import AccountSettingsForm from "@/components/modules/profile/account-settings-form";
import Breadcrumb from "@/components/common/breadcrumbs/Breadcrumb";
import {getCountries} from "@/services/misc/misc.api";
import {cookies} from "next/headers";
import ProfileTour from "@/components/widgets/tours/profile-tour";

export async function UserProfileUpdate() {
    const data=await getCountries();
    const unParsedUser=cookies().get("user")?.value;
    let user;
    if(unParsedUser){
        user=JSON.parse(unParsedUser);
    }
    return (
        <Tabs defaultValue="account">
            <Breadcrumb pageName="Profile" />
            <ProfileTour/>
            <TabsList defaultValue={"profile"}  className="grid w-[400px] mb-4 grid-cols-2">
                <TabsTrigger id={"profile"} value="profile">Profile</TabsTrigger>
                <TabsTrigger id={"account"} value="account">Account</TabsTrigger>
            </TabsList>
            <TabsContent className={'!w-full'} value="profile">
              <ProfileUpdateForm user={user} countries={data}/>
            </TabsContent>
            <TabsContent className={'!w-full'} value="account">
                <AccountSettingsForm user={user}/>
            </TabsContent>
        </Tabs>
    )
}
