import {Lato, Mulish} from "next/font/google";

const MulishFont = Lato({ subsets: ["latin"],weight:["100","300","400","700"] });
import DefaultLayout from "@/layouts/dashboard-layout";

const DashboardLayout=({children}:{children:React.ReactNode})=>{


    return(
        <main className={`${MulishFont.className} bg-whiten dark:bg-neutral-950`}>
          <DefaultLayout>
              {children}
          </DefaultLayout>
        </main>
    )
}
export default DashboardLayout;
