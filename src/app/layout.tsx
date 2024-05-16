import "./css/style.css";
import type { Metadata } from "next";
import NavBar from "./Components/NavBar/NavBar";
import Footer from "./Components/Footer/Footer";
import { RootContextProvider } from "../context";
import { AuthContextProvider } from "../context/AuthContext";
import { Suspense } from "react";
import Loading from "./loading";
import Head from "next/head";


export const metadata: Metadata = {

  title: "Online-Khabar Calendar",
  description: "यो ‘अनलाइन क्यालेन्डर’ नेपालको आधिकारीक तथा विश्वव्यापी रूपमा नेपालीहरूले व्यापक प्रयोग गर्ने विक्रम संवत् क्यालेण्डर अथवा पात्रो (BS Calendar) को डिजिटल संस्करण हो ।",
  openGraph: {
    title: "Online Khabar Calendar",
    description: "यो ‘अनलाइन क्यालेन्डर’ नेपालको आधिकारीक तथा विश्वव्यापी रूपमा नेपालीहरूले व्यापक प्रयोग गर्ने विक्रम संवत् क्यालेण्डर अथवा पात्रो (BS Calendar) को डिजिटल संस्करण हो ।",
    images: ["https://backend-calendar.onlinekhabar.com/storage/files/OKCal/ok-calendar-logo.png"],
    url: "https://calendar.onlinekhabar.com",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    site: "@online_khabar_calendar",
    title: "Online Khabar Calendar",
    description: "यो ‘अनलाइन क्यालेन्डर’ नेपालको आधिकारीक तथा विश्वव्यापी रूपमा नेपालीहरूले व्यापक प्रयोग गर्ने विक्रम संवत् क्यालेण्डर अथवा पात्रो (BS Calendar) को डिजिटल संस्करण हो ।",
    images: "https://backend-calendar.onlinekhabar.com/storage/files/OKCal/ok-calendar-logo.png",
  },

};


async function getItem() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/calendar/today`, {
    cache: "no-store",
  });
  return response.json()
}

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data, time } = await getItem();
  return (
    <html lang="en">
      <head>
        <link rel="icon" href={`/img/favicon${data.bs_date_en}.ico`} type="image/x-icon" sizes="16x16" />
      </head>
      <body>
        <AuthContextProvider>
          <RootContextProvider>
            <NavBar currentdate={data} />
            {/* <Suspense fallback={<Loading />}> */}
            {children}
            {/* </Suspense> */}
            <Footer />
          </RootContextProvider>
        </AuthContextProvider>
      </body>
    </html>
  );
}
