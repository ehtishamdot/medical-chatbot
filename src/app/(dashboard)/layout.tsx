import {Lato, Mulish} from "next/font/google";

const MulishFont = Lato({ subsets: ["latin"],weight:["100","300","400","700"] });
import DefaultLayout from "@/layouts/dashboard-layout";
import {cookies} from "next/headers";

const DashboardLayout=({children}:{children:React.ReactNode})=>{
    let unParsedUser;
    const user=cookies().get("user")?.value;
    if(user){
        unParsedUser=JSON.parse(user);
    }

    return(
        <main className={`${MulishFont.className} bg-whiten dark:bg-neutral-950`}>
          <DefaultLayout user={unParsedUser}>
              {children}
          </DefaultLayout>
        </main>
    )
}
export default DashboardLayout;
