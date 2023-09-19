import "./globals.css";
import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import Providers from "@/components/Providers";


const font = JetBrains_Mono({ subsets: ["cyrillic"] });

export const metadata: Metadata = {
  title: "Gabeth",
  description: "Gabeth.ai: Your Ultimate AI Assistant.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" id="mode" className="dark">
      <body
        className={`${font.className} dark:bg-neutral-950 bg-white dark:text-neutral-200`}
      >
        <main>
        <Providers>
          <Toaster />
          {children}
        </Providers>
        </main>
      </body>
    </html>
  );
}
