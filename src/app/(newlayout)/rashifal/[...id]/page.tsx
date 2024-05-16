// "use client"
// import { error } from "console";
// import Link from "next/link";
// import SingleRashifal from "./SingleRahifal";
// import NotFound from "../../../not-found";
// import Head from "next/head";
// import { useEffect, useState } from "react";


// interface Params {
//   id: string;
// }

// const RashifalSingle: React.FC<{ params: Params }> = ({ params }) => {
//   const [loading, setLoading] = useState<boolean>(true);
//   const [singleData, setSingleData] = useState<any>([]); // Adjust type as per your API response
//   const [singleFooterData, setSingleFooterData] = useState<any>([]); // Adjust type as per your API response
//   const [rashifalData, setRashifalData] = useState<any>([]); // Adjust type as per your API response


//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true)
//         const response = await fetch(
//           `https://www.onlinekhabar.com/wp-json/okapi/v2/rashifal/${params.id}`,
//           {
//             cache: "no-store"
//           }
//         );
//         if (!response.ok) {
//           throw new Error("Failed to fetch data");
//         }
//         const data = await response.json();
//         setSingleData(data?.data?.rashi);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching single data:", error);
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [params.id]);

//   useEffect(() => {
//     const fetchFooterData = async () => {
//       try {
//         const response = await fetch(
//           `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/calendar/rashifal-footer/${params.id}`,
//           {
//             cache: "no-store"
//           }
//         );
//         if (!response.ok) {
//           throw new Error("Failed to fetch footer data");
//         }
//         const data = await response.json();
//         setSingleFooterData(data?.data);
//       } catch (error) {
//         console.error("Error fetching footer data:", error);
//       }
//     };

//     fetchFooterData();
//   }, [params.id]);

//   useEffect(() => {
//     const fetchRashifalData = async () => {
//       try {
//         const response = await fetch(
//           "https://www.onlinekhabar.com/wp-json/okapi/v2/rashi",
//           {
//             cache: "no-store"
//           }
//         );
//         if (!response.ok) {
//           throw new Error("Failed to fetch Rashifal data");
//         }
//         const data = await response.json();
//         setRashifalData(data?.data?.rashi);
//       } catch (error) {
//         console.error("Error fetching Rashifal data:", error);
//       }
//     };

//     fetchRashifalData();
//   }, []);


//   if (!singleData) {
//     return <NotFound />;
//   }

//   return (
//     <>
//       {
//         singleData && (
//           <head>
//             <title>{`${singleData?.name || ""} - Online Khabar Calendar`}</title>
//             {/* <meta name="description" content={singleData?.rashifal?.daily?.today} /> */}
//             {/* Add other meta tags as needed */}
//             <meta property="og:title" content={`${singleData?.name} ${singleData?.rashifal?.daily?.today}`} />
//             <meta property="og:description" content="" />
//             <meta property="og:image" content={singleData.icon} />
//             <meta property="og:image:width" content="1200" />
//             <meta property="og:image:height" content="630" />
//             <meta property="og:url" content={`https://calendar.onlinekhabar.com/rashifal/${params.id}`} />
//           </head>
//         )
//       }
//       <SingleRashifal loading={loading} singleFooterData={singleFooterData} singleData={singleData} params={params} rashifalData={rashifalData} />
//     </>
//   );
// };

// export default RashifalSingle;

import { error } from "console";
import Link from "next/link";
import SingleRashifal from "./SingleRahifal";
import NotFound from "../../../not-found";
import { Metadata, ResolvingMetadata } from "next";
import { cache } from "react";
import NepaliDate from "nepali-date-converter";
import { arabicToDevanagari, dayNames, monthNames } from "../../../../hooks";

const fetchSingleRashi = cache(async (id: string) => {

  const rashifalapi = `https://www.onlinekhabar.com/wp-json/okapi/v2/rashifal/type/daily`;
  // const rashifalapi = `https://www.onlinekhabar.com/wp-json/okapi/v2/rashifal/${id}`;
  try {
    const response = await fetch(rashifalapi, {
      cache: "no-store"
    });

    if (!response.ok) {
      throw new error("failed to fetch data");
    }
    const result = await response.json();

    const filteredList = result.filter((item) => {
      return (
        item.slug === id[0]
      )
    })
    return filteredList
  }
  catch (error) {
    console.error("error", error);
    return (
      <NotFound />
    )
  };
})


export async function generateMetadata({ params }: { params: { id: string } }, parent: ResolvingMetadata): Promise<Metadata> {

  // Get the current Nepali date
  const currentNepaliDate = new NepaliDate();

  // Extract the current year from the Nepali date
  const currentNepaliDay = currentNepaliDate.getDay();
  const currentNepaliTodayDate = currentNepaliDate.getDate();
  const currentNepaliMonth = currentNepaliDate.getMonth();
  const currentNepaliYear = currentNepaliDate.getYear();

  const rashiData = await fetchSingleRashi(params.id);
  const rashi = rashiData[0]
  const previousImg = (await parent).openGraph?.images || []

  const title = `${rashi?.name} - Online Khabar Calendar`
  const description = rashi?.rashifal
  const ogTitle = `${rashi?.name} - ${arabicToDevanagari(currentNepaliTodayDate)} ${monthNames[currentNepaliMonth]} ${arabicToDevanagari(currentNepaliYear)}, ${dayNames[currentNepaliDay]}`
  const imageUrl = rashi?.rashi_data?.icon
  // Set metadataBase for resolving images
  return {
    title: title ? title : "Online Khabar Calendar",
    description: description,
    openGraph: {
      title: ogTitle,
      description: description,
      images: [imageUrl, ...previousImg],
      url: `https://calendar.onlinekhabar.com/rashifal/${params.id}`,
    },
    twitter: {
      title: ogTitle,
      description: description,
      images: [imageUrl, ...previousImg],
    },
  }
}

const RashifalSingle = async ({ params }: any) => {


  let rashifalFooterdata;
  const rashifalFooterapi = `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/calendar/rashifal-footer/${params.id}`;

  try {
    const response = await fetch(rashifalFooterapi, {
      cache: "no-store"
    });

    if (!response.ok) {
      throw new error("failed to fetch data");
    }
    rashifalFooterdata = await response.json();
  }
  catch (error) {
    console.error("error", error);
    return (
      <NotFound />
    )
  };

  const singleFooterData = rashifalFooterdata?.data;

  let rashifal;
  // const rashiapi = `https://www.onlinekhabar.com/wp-json/okapi/v2/rashi`;
  const rashiapi = `https://www.onlinekhabar.com/wp-json/okapi/v2/rashifal/type/daily`;

  try {
    const response = await fetch(rashiapi, {
      cache: "no-store"
    });

    if (!response.ok) {
      throw new error("failed to fetch data");
    }
    rashifal = await response.json();
  }
  catch (error) {
    console.error("error", error);
    return (
      <NotFound />
    )
  };
  const rashifalData = rashifal


  return (
    <>
      <SingleRashifal singleFooterData={singleFooterData}  params={params} rashifalData={rashifalData} />
    </>
  );
};



// export async function generateMetadata(rashifalData) {
//   try {
//     const rashi = rashifalData?.data?.rashi;
//     const title = rashi?.name || "Online-Khabar Calendar";
//     const image = rashi?.icon;

//     console.log("Metadata:", { title, image });

//     return { title, image };
//   } catch (error) {
//     console.error("Error fetching metadata", error);
//   }
// }

export default RashifalSingle;