import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import DataContextProvider from "@/contexts/dataContext";
import { ToastContainer } from "react-toastify";
import AuthContextProvider from "@/contexts/authContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased max-w-full max-h-screen mb-40 md:pl-24`}
      >
        <ToastContainer
          toastClassName="max-w-[90vw] mt-1 mr-2"
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover={false}
          theme="dark"
        />
        <AuthContextProvider>
          <DataContextProvider>{children}</DataContextProvider>
        </AuthContextProvider>
        <Navigation></Navigation>
      </body>
    </html>
  );
}
