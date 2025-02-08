import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "WealthWise",
  description: "One  stop Finance Platform",
  // icons: {
  //   icon: [
  //     {
  //       src: "/favicon.ico",
  //       sizes: "16x16",
  //       type: "image/ico",
  //     },
  //   ],
  // },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className} `}>
          {/* Header */}
          <Header />
          <main className="min-h-screen">{children}</main>
          <Toaster richColors />
          {/* footer */}
          <footer className="bg-blue-50 py-5">
            <div className="container mx-auto px-4 text-center text-gray-600">
              <p>Copyright 2024 WealthWise</p>
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
