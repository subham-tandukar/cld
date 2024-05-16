import EnglishCalendarComponent from "../../Components/Calendar/EnglishCalendar/Page";

type Props = {
  searchParams: {
    year: string;
    month: string;
    calendarType: string;
    ad_month_en: string;
    ad_year_en: string;
  };
};
export async function generateMetadata({ searchParams }) {
  console.log("params", searchParams.year);
  const { year, month } = searchParams ?? {};
  console.log("Year:", year);
  console.log("Month:", month);

  const englishMonths = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];

  try {
    let title;
    if (month && englishMonths[parseInt(month) - 1]) {
      title = `${englishMonths[parseInt(month) - 1]} ${year} - OnlineKhabar`;
    } else {
      title = `Online-Khabar Calendar`;
    }

    const image = "https://backend-calendar.onlinekhabar.com/storage/files/OKCal/ok-calendar-logo.png";

    console.log("Metadata:", { title, image });

    return { title, image };
  } catch (error) {
    console.error("Error fetching metadata", error);
  }
}


async function getTimeAndDate() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/calendar/today`, {
    cache: "no-store"
  });
  const { data, time } = await response.json();

  return {
    year: data.bs_year_en,
    month: data.bs_month_code_en,
    currentdate: data,
    currenttime: time,
    ad_year_en: data.ad_year_en,
    ad_month_en: data.ad_month_code_en,
  };
}

export default async function Home({ searchParams }: Props) {
  const { year, month, currentdate, currenttime, ad_year_en, ad_month_en } =
    await getTimeAndDate();

  if (searchParams.year && searchParams.month) {
    return (
      <>
        <EnglishCalendarComponent
          ad_year_en={parseInt(searchParams.year)}
          ad_month_en={parseInt(searchParams.month)}
          currentdate={currentdate}
          currenttime={currenttime}
          month={searchParams.month}
          isParam="true"
        />
      </>
    );
  }

  return (
    <>
      <EnglishCalendarComponent
        ad_year_en={parseInt(ad_year_en)}
        ad_month_en={parseInt(ad_month_en)}
        currentdate={currentdate}
        currenttime={currenttime}
        month={month}
        isParam="false"
      />
    </>
  );
}