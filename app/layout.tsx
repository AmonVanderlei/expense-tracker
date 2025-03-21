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
  title: "Expense Tracker",
  description: "Manage your finances easily and smartly.",
  applicationName: "Expense Tracker",
  authors: [
    { name: "Amon Vanderlei", url: "https://github.com/AmonVanderlei" },
  ],
  creator: "Amon Vanderlei",
  keywords: [
    "Personal finance",
    "Expense manager",
    "Financial planning",
    "Budget control",
    "Expense tracker",
    "Savings",
    "Money management",
    "Finance tracker",
  ],
  category: "finance",
  themeColor: "#010414",
  colorScheme: "dark",
  openGraph: {
    title: "Expense Tracker",
    description:
      "Expense Tracker is an intuitive app designed to help you organize your personal finances. With features for recording transactions, tracking expenses, planning monthly budgets, and monitoring upcoming bills, Expense Tracker puts you in control of your money.",
    url: "https://expense-tracker-amonvanderlei.vercel.app/",
    type: "website",
    images: [
      {
        url: "https://expense-tracker-amonvanderlei.vercel.app/icons/android-chrome-512x512.png",
        width: 512,
        height: 512,
        alt: "Expense Tracker - Manage your finances easily",
      },
    ],
  },
  icons: {
    icon: [
      { rel: "icon", url: "/favicon.ico" },
      { rel: "icon", sizes: "16x16", url: "/icons/favicon-16x16.png" },
      { rel: "icon", sizes: "32x32", url: "/icons/favicon-32x32.png" },
    ],
    apple: "/icons/apple-touch-icon.png",
  },
  viewport: "width=device-width, initial-scale=1.0",
  robots: {
    index: true,
    follow: true,
  },
  manifest: "/manifest.json",
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
        <link rel="manifest" href="/manifest.json" />
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
          <Navigation />
        </AuthContextProvider>
      </body>
    </html>
  );
}
