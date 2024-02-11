import "./globals.css";
import type { Metadata } from "next";
import {JetBrains_Mono} from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import AuthProvider from "@/providers/AuthProvider";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import InterceptorInitialization from "@/lib/interceptor-initialization";


const font = JetBrains_Mono({ subsets: ["cyrillic"] });

export const metadata: Metadata = {
  title: "Esper Wise",
  description: "Esper Wise: Your Ultimate AI Assistant.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" id="mode" className="light">
      <body
        className={`${font.className} dark:bg-neutral-950  dark:text-neutral-200`}
      >
        <main>
        <AuthProvider>
            <ReactQueryProvider>
                <InterceptorInitialization/>
                <Toaster />
                {children}
            </ReactQueryProvider>
        </AuthProvider>
        </main>
      </body>
    </html>
  );
}
