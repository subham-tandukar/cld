"use client"
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { MdChevronLeft, MdChevronRight, MdOutlineFormatListBulleted, MdOutlineKeyboardArrowDown } from "react-icons/md";
import Choosedate from '../../Offcanvas/Popup/Choosedate';
import { PageProps } from "../../../../types/Calendartypes";
import ScheduleOffcanvas from "../../Offcanvas/ScheduleOffCanvas/ScheduleOffcanvas";
import NextMonth from "./NextMonth";
import EnglishDayOffCanvas from "../../Offcanvas/DayOffCanvas/EnglishDayOffcanvas";
import PreviousMonths from "./PreviousMonth";
import NotFound from "../../../not-found";
import { useRoot } from "../../../../context";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import moment from "moment";
import Loading from "../../../loading";
import { useRouter } from 'next/navigation';
import Image from "next/image";
import NepaliDate from "nepali-date-converter";
import { englishYearList, limitedEngYearList } from "../../../../hooks";
import Select from 'react-select';
import { FiSunrise, FiSunset } from "react-icons/fi";
import Festival from "../../Events/Festival/Festival";
import { FaBell, FaCalendarAlt, FaPlus } from "react-icons/fa";
import Clock from 'react-clock';
import 'react-clock/dist/Clock.css';
import Share from "../../Share/Share";

export const EnglishCalendar: React.FC<PageProps> = ({
  data,
  currentdate,
  currenttime,
  previousdata,
  Nextmonthdata,
  loading,
  isParam
}) => {
  const yearData: number[] = englishYearList();
  const limitedYearData: number[] = limitedEngYearList();
  const { animation, clickedDate, dropdownitem, setDropdownitem, setAnimation } = useRoot();
  const [isOffCanvasOpen, setIsOffCanvasOpen] = useState(false);
  const [isDayOffCanvasOpen, setDayisOffCanvasOpen] = useState<boolean>(false);
  const [Selecteddate, setSelecteddate] = useState<any | null>(null);
  const [ChoosedateOpen, Setchoosedate] = useState<boolean>(false);
  const calendardata = data;
  const router = useRouter();
  const { ad_year_en }: any = isNaN(parseInt(calendardata[0]?.bs_year_en)) ? {} : calendardata[0];
  const { ad_month_code_en } = calendardata[1] || {};
  const month = isNaN(parseInt(ad_month_code_en, 10)) ? 1 : parseInt(ad_month_code_en, 10);


  const handleToggleOffCanvas = () => {
    setIsOffCanvasOpen(!isOffCanvasOpen);
  };

  const handleChoosedate = () => {
    Setchoosedate(!ChoosedateOpen)
  };

  const handleChoosedateClose = () => {
    Setchoosedate(false);
  }

  const handleCloseOffCanvas = () => {
    setIsOffCanvasOpen(false);
  };

  const handleDayTogglecanvas = () => {
    setDayisOffCanvasOpen(!isDayOffCanvasOpen);
  };

  const handleDayCloseOffCanvas = () => {
    setDayisOffCanvasOpen(false);
  };

  const animationElement = document.getElementById('animation');
  useEffect(() => {
    scrollToContainer()
  }, [animationElement])

  const scrollToContainer = () => {

    if (animationElement) {
      const offset = 200; // Adjust the offset value according to your needs
      const topPos = animationElement.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: topPos, behavior: 'smooth' });
    }
  };


  const [OpenDropdown, setOpenDropdown] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Function to close dropdown when clicking outside
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDropdownClick = () => {
    setOpenDropdown(!OpenDropdown)
  }
  // if (!calendardata || calendardata.length === 0) {
  //   return <NotFound />;
  // }

  useEffect(() => {
    setDropdownitem("ई.सं.")
  }, [])

  // for loading skeleton 
  const numRows = 5;
  const numColumns = 7;

  const dataArray = Array.from({ length: numRows }, (_, rowIndex) =>
    Array.from({ length: numColumns }, (_, columnIndex) => rowIndex * numColumns + columnIndex + 1)
  );

  const handleTodayCanvas = () => {
    setSelecteddate(currentdate)
  }



  // To get current dynamic time
  const [currentTime, setCurrentTime] = useState<string>(
    moment().format('LTS')
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(moment().format('LTS'));
    }, 1000);

    // Cleanup function to clear the interval when component unmounts or when the dependency array changes
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array so that the effect runs only once

  // Extracting only the numbers and colons from the string
  const numbersOnly = currentTime.replace(/[^\d:]/g, (match) => {
    // If the character is not a digit or colon, replace it with an empty string
    return match === "०" ? "०" :
      match === "१" ? "१" :
        match === "२" ? "२" :
          match === "३" ? "३" :
            match === "४" ? "४" :
              match === "५" ? "५" :
                match === "६" ? "६" :
                  match === "७" ? "७" :
                    match === "८" ? "८" :
                      match === "९" ? "९" :
                        ""; // Handle colons
  });

  // Function to get the current time in "08:39 AM" format
  const getCurrentTime = () => {
    moment.locale('en');
    // Use Moment.js to format the current time
    return moment().format('hh:mm A');
  };
  const currentEngTime = getCurrentTime();

  const [selectedMonth, setSelectedMonth] = useState<any | "">(Number(month));
  const [selectedCalendarType, setSelectedCalendarType] = useState(dropdownitem === "वि.सं." ? "bs" : "ad");

  const [dropDownYearValue, setDropDownYearValue] = useState<number | null>(Number(ad_year_en ? ad_year_en : currentdate.ad_year_en));
  const [inputValue, setInputValue] = useState<string>('');

  const dropDownYear = yearData
    .filter((item) => item.toString().startsWith(inputValue)) // Filter years based on the input text
    .map((item) => ({
      value: item,
      label: item.toString(),
    }));

  const limitedDropDownYear = limitedYearData
    .filter((item) => item.toString().startsWith(inputValue)) // Filter years based on the input text
    .map((item) => ({
      value: item,
      label: item.toString(),
    }));

  useEffect(() => {
    setDropDownYearValue(Number(ad_year_en ? ad_year_en : currentdate.ad_year_en))
    setSelectedMonth(Number(month))
  }, [month, ad_year_en, isParam])



  const currentEnglishYear = new Date().getFullYear();

  const [eventList, setEventList] = useState<Event[]>([]);

  const getEventList = async () => {
    const upcomingeventapi = `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/calendar/trending-parvas`;

    try {
      const response = await fetch(upcomingeventapi, {
        cache: "no-store"
      });

      if (!response.ok) {
        console.error("Failed to fetch data");
      }

      if (response.ok) {
        const data = await response.json();
        setEventList(data?.data);
      }

    } catch (error) {
      console.error("Failed to fetch data");
      setEventList([]);
    }
  };

  useEffect(() => {
    getEventList();
  }, []);

  const customStyles = {
    menu: (provided, state) => ({
      ...provided,
      background: "#f9f9fd",
      border: "solid 1px #a0a0a0a6",
      boxShadow: "none",
      lineHeight: "20px",
      fontSize: "14px",
      top: "80%",
      width: "160px"
    }),
  }

  const [viewMode, setViewMode] = useState("calendarView");

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 640) {
        setViewMode("calendarView");
      } else {
        setViewMode("calendarView");
      }
    };

    // Call handleResize initially
    handleResize();

    // Add event listener to listen for resize events
    window.addEventListener('resize', handleResize);

    // Remove event listener when component unmounts
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // Empty dependency array ensures this effect runs only once

  const [clockValue, setClockValue] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setClockValue(new Date()), 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <div className="okv4-col order-2">
        <div className="ok-breadcrumb">
          <ul>
            <li>
              <Link href="https://www.onlinekhabar.com/" target='_blank'>अनलाइनखबर </Link>
            </li>
            <li className='active'>
              क्यालेन्डर
            </li>

          </ul>
        </div>
        <div className="calendar-dates">
          <div className="ok-block ok-block-cal-header">
            <div className="ok-block-cal-date-circle eng-font">
              <Link onClick={() => { setDropDownYearValue(null); setSelectedMonth("") }} href={`ad?year=${currentdate.ad_year_en}&month=${currentdate.ad_month_code_en}`}>
                {currentdate.ad_date_en}
              </Link>
            </div>
            <div className="ok-block-cal-date-circle-info">
              <div className="eng-font">
                {currentdate.ad_month_en} {currentdate.ad_year_en}
                <span className="eng-font">
                  {currentdate.ad_month_en} {currentdate.ad_date_en},{" "}
                  {currentdate.ad_year_en}
                </span>
                <span className="ok-season">
                  <Link href="#">
                    {/* <img src={currentdate.panchanga.hritu.icon} alt="Season" /> */}

                    ऋतु : <small>{currentdate.panchanga.hritu.title_np}</small>

                  </Link>
                </span>
              </div>
              <div className="flx flxwrp align-m ">
                <div className="okelem-panchanga-dropdwon today-panchanga">
                  आजको पञ्चाङ्ग
                  <span className="reveal-dropdown" onClick={() => {
                    handleDayTogglecanvas();
                    handleTodayCanvas()
                  }}>
                    <small className="panchanga-arrow">
                      <MdChevronRight width={30} />
                    </small>
                  </span>
                </div>
                <div className="okelem-panchanga-source">
                  <Link href="/permission-letter">
                    {/* <Image width={24} height={24} src="/img/toyanath-img.png" alt="" />
                    "तोयनाथ पञ्चाङ्ग" {" "}
                    <span>सँगको सहकार्यमा</span> */}
                    पञ्चाङ निर्णायक समितिद्वारा मान्यता प्राप्त
                  </Link>
                </div>
              </div>
              <div className="right-time-watch for-mobile">
                <div>
                  <Share
                    endpoint=""
                    title={`Online Khabar Calendar`}
                    imageUrl={`https://backend-calendar.onlinekhabar.com/storage/files/OKCal/ok-calendar-logo.png`}
                  />

                  <span className="right-time-watch-day">
                    {/* <Image width={38} height={38} src="/img/watch.png" alt="" /> */}
                    <Clock value={clockValue} />
                    {currentdate.day_np}
                    {/* <span>{arabicToDevanagari(currenttime)}</span> */}
                    <span>{currentEngTime}</span>
                  </span>
                  <span className="sun-rising-info">
                    <span>सूर्योदय {currentdate.panchanga.sunrise_np}</span>
                    <span>सूर्यास्त {currentdate.panchanga.sunset_np}</span>
                    {/* <span><FiSunrise /> {currentdate.panchanga.sunrise_np}</span>
                    <span><FiSunset /> {currentdate.panchanga.sunset_np}</span> */}
                  </span>
                </div>
              </div>
            </div>
            <div className="right-time-watch for-desktop">
              <div className="home-share-this">
                <Share
                  endpoint=""
                  title={`Online Khabar Calendar`}
                  imageUrl={`https://backend-calendar.onlinekhabar.com/storage/files/OKCal/ok-calendar-logo.png`}
                />
              </div>
              {/* <Image width={38} height={38} src="/img/watch.png" alt="" /> */}
              <Clock value={clockValue} />
              <div>
                <span className="right-time-watch-day">
                  {currentdate.day_np}
                  {/* <span>{arabicToDevanagari(currenttime)}</span> */}
                  <span>{currentEngTime}</span>
                </span>
                <span className="sun-rising-info">
                  <span>सूर्योदय {currentdate.panchanga.sunrise_np}</span>
                  <span>सूर्यास्त {currentdate.panchanga.sunset_np}</span>
                  {/* <span><FiSunrise /> {currentdate.panchanga.sunrise_np}</span>
                    <span><FiSunset /> {currentdate.panchanga.sunset_np}</span> */}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="for-mobile">
          <Festival festivaldata={eventList} />
        </div>

        <div className="okelm-calendar-card">
          <div className="okelm-calendar-card-filter">
            <div className="select-by-year-months flex">
              <div
                onClick={handleDropdownClick}
                className="select__box select__yr-month yr-month-wrapper"
                ref={dropdownRef}
              >
                {dropdownitem}
                <MdOutlineKeyboardArrowDown />
                {OpenDropdown && (
                  <div className="yr-month-dropdown">

                    <div onClick={() => { setDropdownitem("वि.सं."); setAnimation(false) }}>
                      <Link href={"bs"}>वि.सं. </Link>
                    </div>
                    <div onClick={() => { setDropdownitem("ई.सं."); setAnimation(false) }}>
                      <Link href={"ad"}>ई.सं.</Link>
                    </div>
                  </div>
                )}
              </div>

              <div
                className="select__box select__yr-month p-0"
              >

                <Select
                  placeholder="Select Year"
                  isSearchable
                  styles={customStyles}
                  noOptionsMessage={() => "No year available"}
                  options={inputValue ? dropDownYear : limitedDropDownYear}  // Conditionally render the dropdown
                  onInputChange={(newValue) => setInputValue(newValue)} // Track user input
                  onChange={(selectedOption) => {
                    setDropDownYearValue(selectedOption ? selectedOption.value : ad_year_en)
                    router.push(
                      `${selectedCalendarType}?year=${selectedOption ? selectedOption.value : ad_year_en}&month=${selectedMonth ? selectedMonth : selectedOption && selectedOption.value === currentEnglishYear ? Number(month) : 1}`
                    );
                  }
                  }
                  value={dropDownYear.find((option) => option.value === dropDownYearValue)}
                />
              </div>

              {/* <div
                    className="select__box select__yr-month"
                    onClick={handleChoosedate}
                  >
                    वर्ष र महिना रोज्नुहोस्
                  </div> */}
              <div>

                <select
                  value={selectedMonth}
                  onChange={(e) => {
                    setSelectedMonth(e.target.value);
                    router.push(
                      `${selectedCalendarType}?year=${dropDownYearValue ? dropDownYearValue : ad_year_en}&month=${e.target.value}`
                    );
                  }}
                >
                  {selectedCalendarType === 'bs' ? (
                    <>
                      <option value="" disabled>महिना रोज्नुहोस्</option>
                      <option value="1">बैशाख</option>
                      <option value="2">जेठ</option>
                      <option value="3">असार</option>
                      <option value="4">साउन</option>
                      <option value="5">भदौ</option>
                      <option value="6">असोज</option>
                      <option value="7">कार्तिक</option>
                      <option value="8">मंसिर</option>
                      <option value="9">पौष</option>
                      <option value="10">माघ</option>
                      <option value="11">फागुन</option>
                      <option value="12">चैत</option>
                    </>
                  ) : (
                    <>
                      <option value="" disabled>Select month</option>
                      <option value="1">January</option>
                      <option value="2">February</option>
                      <option value="3">March</option>
                      <option value="4">April</option>
                      <option value="5">May</option>
                      <option value="6">June</option>
                      <option value="7">July</option>
                      <option value="8">August</option>
                      <option value="9">September</option>
                      <option value="10">October</option>
                      <option value="11">November</option>
                      <option value="12">December</option>
                    </>
                  )}
                </select>
              </div>
            </div>
            <div className="jump-between-dates">
              {
                data.length > 0 ? (
                  <>
                    <Link
                      href={`ad?year=${Number(month) === 1 ? Number(ad_year_en) - 1 : Number(ad_year_en)}&month=${Number(month) === 1 ? 12 : Number(month) - 1
                        }`}
                      className="prev-date"
                      prefetch={false}
                      scroll={false}
                      onClick={() => setAnimation(false)}
                    >
                      <MdChevronLeft />
                    </Link>

                    {calendardata.length > 0 && (
                      <div key={1}>
                        <span className="current-date eng-font">
                          {calendardata[0].ad_month_en}{" "}
                          <span>{calendardata[0].ad_year_en}</span>
                        </span>
                      </div>
                    )}

                    <Link
                      href={`ad?year=${(month === 12 ? parseInt(ad_year_en) + 1 : parseInt(ad_year_en))}&month=${((month % 12) === 0 ? 1 : (month) + 1)}`}
                      className="next-date"
                      prefetch={false}
                      scroll={false}
                      onClick={() => setAnimation(false)}

                    >
                      <MdChevronRight />
                    </Link>
                  </>
                ) : null
              }
            </div>

            <div className="flx justify-between gap-1 align-m list-grid-view">
              <div>
                <div className="mobile-view">
                  <div className="ok-calendar-grid">

                    <div onClick={() => {
                      setViewMode("calendarView");
                      setAnimation(false)
                    }}
                      className={`calendar-view ${viewMode === "calendarView" ? "active" : ""}`}>
                      <FaCalendarAlt />
                    </div>

                    <div onClick={() => {
                      setViewMode("listView");
                      setAnimation(false)
                    }}
                      className={`mob-list-view ${viewMode === "listView" ? "active" : ""}`}>
                      <MdOutlineFormatListBulleted />
                    </div>
                  </div>

                </div>
              </div>
              <div className="schedule-btn-wrapper">
                <button
                  className="btn primary  schedule__offcanvas__btn"
                  onClick={handleToggleOffCanvas}
                >
                  रिमाइन्डर
                  <span className="add-scheule-btn"><FaPlus /></span>
                </button>
              </div>
            </div>
          </div>

          {
            viewMode === "calendarView" && (
              <div className="okelm-patro desktop-patro ">
                <div className="okelm-patro-row for-desktop">
                  <div className="okelm-patro-col heading">
                    आइतवार
                    <span>SUN</span>
                  </div>
                  <div className="okelm-patro-col heading">
                    सोमवार
                    <span>MON</span>
                  </div>
                  <div className="okelm-patro-col heading">
                    मंगलवार
                    <span>TUE</span>
                  </div>
                  <div className="okelm-patro-col heading">
                    बुधवार
                    <span>WED</span>
                  </div>
                  <div className="okelm-patro-col heading">
                    बिहीवार
                    <span>THU</span>
                  </div>
                  <div className="okelm-patro-col heading">
                    शुक्रवार
                    <span>FRI</span>
                  </div>
                  <div className="okelm-patro-col heading">
                    शनिवार
                    <span>SAT</span>
                  </div>
                </div>
                <div className="okelm-patro-row for-mobile mt-0">
                  <div className="okelm-patro-col heading">
                    आ
                    <span>S</span>
                  </div>
                  <div className="okelm-patro-col heading">
                    सो
                    <span>M</span>
                  </div>
                  <div className="okelm-patro-col heading">
                    मं
                    <span>T</span>
                  </div>
                  <div className="okelm-patro-col heading">
                    बु
                    <span>W</span>
                  </div>
                  <div className="okelm-patro-col heading">
                    बि
                    <span>T</span>
                  </div>
                  <div className="okelm-patro-col heading">
                    शु
                    <span>F</span>
                  </div>
                  <div className="okelm-patro-col heading">
                    श
                    <span>S</span>
                  </div>
                </div>
                {
                  !calendardata || calendardata.length === 0 ? (
                    <>
                      {
                        loading ? (
                          <div className="okelm-patro">

                            <div className="okelm-patro-row">
                              {dataArray.map((row, rowIndex) => (
                                <React.Fragment key={rowIndex}>
                                  {row.map((item, columnIndex) => (
                                    <div key={columnIndex} className="okelm-patro-col p-1">
                                      <Skeleton className="my-skeleton" />
                                    </div>
                                  ))}
                                </React.Fragment>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <NotFound />
                        )
                      }
                    </>
                  ) : (
                    <>

                      {
                        loading ? (
                          <div className="okelm-patro-row">
                            {dataArray.map((row, rowIndex) => (
                              <React.Fragment key={rowIndex}>
                                {row.map((item, columnIndex) => (
                                  <div key={columnIndex} className="okelm-patro-col p-1">
                                    <Skeleton className="my-skeleton" />
                                  </div>
                                ))}
                              </React.Fragment>
                            ))}
                          </div>
                        ) :
                          (
                            <div className="okelm-patro-row">
                              <PreviousMonths previousdata={previousdata} data={data} />
                              {data.length > 1 &&
                                data.map((item) => (
                                  <div
                                    key={item.id}
                                    onClick={() => {
                                      handleDayTogglecanvas();
                                      setSelecteddate(item);
                                    }}
                                    id={`${animation && item?.ad_full_date_en === clickedDate?.date ? "animation" : ""}`}
                                    className={`okelm-patro-col-day day__offcanvas__btn 

                              ${item.bs_date_np === currentdate.bs_date_np &&
                                        item.bs_month_code_en === currentdate.bs_month_code_en && ad_year_en === currentdate.ad_year_en
                                        && item.day_en === "Saturday"
                                        ? "is-today-holiday"
                                        :
                                        item.bs_date_np === currentdate.bs_date_np &&
                                          item.bs_month_code_en === currentdate.bs_month_code_en && ad_year_en === currentdate.ad_year_en
                                          && item?.events[0]?.is_public_holiday === true
                                          ? "is-today-holiday"
                                          :
                                          item.bs_date_np === currentdate.bs_date_np &&
                                            item.bs_month_code_en === currentdate.bs_month_code_en && ad_year_en === currentdate.ad_year_en
                                            ? "is-today"

                                            : item.day_en === "Saturday"
                                              ? "holiday"
                                              : item?.events[0]?.is_public_holiday === true ?
                                                "holiday" :
                                                ""
                                      }
                          ${animation && item?.ad_full_date_en === clickedDate?.date ? "animation" : ""}
                          `}
                                  >
                                    {item?.events.slice(0, 1).map((event, index) => (
                                      <span key={index} className="box-top"> {event?.event_title_np}</span>
                                    ))}
                                    <div
                                      className="okelm-patro-col heading"
                                    >
                                      <span className="eng-font">{item.ad_date_en}</span>


                                      {item?.events?.length - 1 >= 1 && (
                                        <span className="more-event">
                                          + {item?.events?.length - 1}
                                        </span>
                                      )}

                                      {item?.events?.length - 1 >= 1 && (
                                        <span className="for-mobile ok-bell-icon">
                                          <FaBell />
                                        </span>
                                      )}


                                    </div>
                                    <div className="col-text-left">
                                      <span>{item?.tithi?.tithi_title_np}</span>

                                    </div>
                                    <div className="eng-date">
                                      <span>{item.bs_date_np}</span>
                                    </div>
                                  </div>
                                ))}
                              <NextMonth data={data} Nextmonthdata={Nextmonthdata} />
                            </div>
                          )}
                    </>

                  )
                }

              </div>
            )
          }
        </div>

        {
          viewMode === "listView" && (
            <>
              {
                data.length > 0 && (
                  <div className="okelm-patro mobile-patro">
                    {
                      loading ? (
                        <div className="okelm-patro-col">
                          <Skeleton className="my-mob-skeleton" count={5} />
                        </div>
                      ) :
                        (
                          <div className="okelm-patro-col">
                            {data.length > 1 &&
                              data.map((item) => {
                                return (

                                  <div
                                    key={item.id}
                                    onClick={() => {
                                      handleDayTogglecanvas();
                                      setSelecteddate(item);
                                    }}
                                    className={`okelm-patro-col-day day__offcanvas__btn 
    
                                    ${item.bs_date_np === currentdate.bs_date_np &&
                                        item.bs_month_code_en === currentdate.bs_month_code_en && ad_year_en === currentdate.ad_year_en
                                        && item.day_en === "Saturday"
                                        ? "is-today-holiday"
                                        :
                                        item.bs_date_np === currentdate.bs_date_np &&
                                          item.bs_month_code_en === currentdate.bs_month_code_en && ad_year_en === currentdate.ad_year_en
                                          && item?.events[0]?.is_public_holiday === true
                                          ? "is-today-holiday"
                                          :
                                          item.bs_date_np === currentdate.bs_date_np &&
                                            item.bs_month_code_en === currentdate.bs_month_code_en && ad_year_en === currentdate.ad_year_en
                                            ? "is-today"

                                            : item.day_en === "Saturday"
                                              ? "holiday"
                                              : item?.events[0]?.is_public_holiday === true ?
                                                "holiday" :
                                                ""
                                      }
                  `}
                                  >

                                    <div className="mob-col-left">
                                      <span className="mob-date eng-font">{item.ad_date_en}</span>
                                      <span className="mob-day eng-font">{item.day_en.slice(0, 3)}</span>
                                    </div>
                                    <div className="mob-col-right">
                                      <div className="mob-first-col">
                                        <span className="mob-col-text-left">{item?.tithi?.tithi_title_np}</span>

                                        {item?.events.slice(0, 2).map((event, index) => (
                                          <span key={index} className="mob-box-top"> {event?.event_title_np}</span>
                                        ))}
                                      </div>

                                      <div className="mob-last-col">
                                        <span className="mob-eng-date">{item.bs_date_np}</span>
                                        <span className="mob-more-event">
                                          {item?.events?.length - 2 >= 1 && (
                                            <>
                                              + {item?.events?.length - 2}
                                            </>
                                          )}
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                )
                              })}
                          </div>

                        )}


                  </div>
                )
              }
            </>
          )
        }

      </div>
      {isOffCanvasOpen && <ScheduleOffcanvas isDayCanvas={false} Selecteddate={Selecteddate} onClose={handleCloseOffCanvas} />}
      {ChoosedateOpen && <Choosedate currentdate={currentdate} currentYear={ad_year_en} currentMonth={month} onClose={handleChoosedateClose} />}
      {isDayOffCanvasOpen && (
        <EnglishDayOffCanvas
          data={data}
          handleDayCloseOffCanvas={handleDayCloseOffCanvas}
          Selecteddate={Selecteddate}
          currentdate={currentdate}
        />
      )}
    </>
  );
};

export default EnglishCalendar;