import NepaliCalenderComponent from "../../Components/Calendar/NepalICalendar/Page";

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

  const nepalimonths = [
    "Baisakh",
    "Jestha",
    "Ashadh",
    "Shrawan",
    "Bhadra",
    "Ashwin",
    "Kartik",
    "Mangsir",
    "Poush",
    "Magh",
    "Falgun",
    "Chaitra"
  ];

  try {
    const title = year && month ?
      `${nepalimonths[parseInt(month) - 1]} ${year} - OnlineKhabar` :
      "OnlineKhabar"; // Set a default title if year or month is undefined
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
  };
}

export default async function Home({ searchParams }: Props) {
  const { year, month, currentdate, currenttime } =
    await getTimeAndDate();
  if (searchParams.year && searchParams.month) {
    return (
      <>
        <NepaliCalenderComponent
          year={searchParams.year}
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
      <NepaliCalenderComponent
        year={year}
        currentdate={currentdate}
        currenttime={currenttime}
        month={month}
        isParam="false"
      />
    </>
  );
}