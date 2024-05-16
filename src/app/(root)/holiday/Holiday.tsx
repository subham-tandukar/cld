"use client"
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Loading from '../../loading';
import { arabicToDevanagari, getRemainingDays, nepaliDaysRemaining } from '../../../hooks';
import Popup from '../event/Popup';
import { useRoot } from '../../../context';
import Share from '../../Components/Share/Share';
import SelectYear from '../../Components/SelectYear/SelectYear';

interface EventData {
    id: number;
    event_category: string;
    event_title_np: string;
    is_public_holiday: boolean;
    date: {
        bs_concat_date_en: string;
        ad_concat_date_en: string;
        bs_date_np: string;
        day_np: string;
        bs_month_np: string;
        bs_year_np: string;
        ad_month_en: string;
        ad_date_en: string;
        ad_year_en: string;
    };
}

const Holiday = ({ currentdate }) => {
    const searchParams = useSearchParams();
    const { siteSetting } = useRoot();
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [submitYear, setSubmitYear] = useState<string>(currentdate.bs_year_en);
    const [submitMonth, setSubmitMonth] = useState<string>("-1");

    const [selectedYear, setSelectedYear] = useState(currentdate.bs_year_en);
    const [selectedMonth, setSelectedMonth] = useState("-1");

    const getHolidayList = async () => {
        const holidayapi = `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/calendar/holidays/bs/${submitYear}?month=${submitMonth}`;

        try {
            setLoading(true)
            const response = await fetch(holidayapi, {
                cache: "no-store"
            });
            if (!response.ok) {
                console.error("failed to fetch data");
            }
            if (response.ok) {
                const sait = await response.json();
                setData(sait?.data)
                setLoading(false)
            }
        } catch (error) {
            console.error("failed to fetch data");
            setData([])
            setLoading(false)
        }
    }


    useEffect(() => {
        getHolidayList()
    }, [submitYear, submitMonth])

    let newData: EventData[] = [];

    data.forEach(event => {
        const existingEventIndex = newData.findIndex(item => item.date.bs_concat_date_en === event.date.bs_concat_date_en);
        if (existingEventIndex !== -1) {
            // If the event's date matches an existing event in newData, append the event_title_np to the existing one
            newData[existingEventIndex].event_title_np += ` | ${event.event_title_np}`;
        } else {
            // If the event's date doesn't match any existing event in newData, push the event into newData
            newData.push({
                ...event,
                event_title_np: event.event_title_np
            });
        }
    });


    const handleSubmit = (event) => {
        event.preventDefault();
        setSubmitYear(selectedYear)
        setSubmitMonth(selectedMonth)
    };

    const monthNames = [
        "सबै",
        "बैशाख",
        "जेठ",
        "असार",
        "साउन",
        "भदौ",
        "असोज",
        "कार्तिक",
        "मंसिर",
        "पौष",
        "माघ",
        "फागुन",
        "चैत",
    ]

    const [popup, setPopup] = useState(false)
    const handleClose = () => {
        setPopup(false)
    }
    const [eventInfo, setEventInfo] = useState([])
    const [eventData, setEventData] = useState([])
    const handleClick = (props) => {
        setEventData(props.date)
        setEventInfo(props)
        setPopup(!popup)
    }

    return (
        <>

            <div className="okv4-container">

                <div className="ok-breadcrumb">
                    <ul>
                        <li>
                            <Link href="https://www.onlinekhabar.com/" target='_blank'>अनलाइनखबर </Link>
                        </li>
                        <li>
                            <Link href="/">क्यालेन्डर</Link>
                        </li>
                        <li className='active'>
                            {siteSetting.holidays_title_np}
                        </li>
                    </ul>
                </div>
                <div className="ok-bg">

                    <div className="ok-desc-content">
                        <div className="ok-tab-flex">

                            <h4 className='ok-main-title'>
                                {siteSetting.holidays_title_np}
                            </h4>
                            
                            <Share
                                endpoint="holiday"
                                title={`${siteSetting?.holidays_title_np} - Online Khabar Calendar`}
                                imageUrl={`${siteSetting?.holidays_thumbnail ? siteSetting?.holidays_thumbnail : siteSetting?.main_logo}`}
                            />
                        </div>
                        <div className="ok-content mt-2">
                            <p
                                dangerouslySetInnerHTML={{ __html: siteSetting.holidays_description_np }}
                            />
                        </div>
                    </div>

                    <div className="">

                        <div>
                            <form onSubmit={handleSubmit}>

                                <div className='filter__flex filter-border'>
                                    <div>

                                        <div className='filter__flex'>
                                            <label htmlFor="number" className="mb-10 d-block">
                                                वर्ष रोज्नुहोस्
                                            </label>
                                            {/* <div className='ok-filter-year mt-1'>

                                        <input
                                            type="number"
                                            id="number"
                                            value={selectedYear}
                                            onChange={(e) => setSelectedYear(e.target.value)}
                                        />

                                    </div> */}
                                            <SelectYear currentdate={currentdate} selectedYear={selectedYear} setSelectedYear={setSelectedYear} />
                                        </div>

                                        <div className='filter__flex'>
                                            <label className="mb-10 d-block">महिना रोज्नुहोस्</label>
                                            <div className=' ok-filter-month'>

                                                <select
                                                    value={selectedMonth}
                                                    onChange={(e) => setSelectedMonth(e.target.value)}
                                                >
                                                    <option value="-1">सबै</option>
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

                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div >
                                        <input
                                            type="submit"
                                            className="btn btn-medium primary primary-gradient"
                                            value="जानुहोस्"
                                        />
                                    </div>
                                </div>
                            </form>
                        </div>


                        {
                            loading ? (
                                <Loading />
                            ) : (
                                <>
                                    {newData && newData.length > 0 ? (
                                        <>

                                            {
                                                submitMonth !== "-1" ? (
                                                    <div className='ok-text  ok-title'>
                                                        {/* {`${arabicToDevanagari(Number(submitYear))} ${monthNames[submitMonth]} महिनाको बिदाहरु हेर्नुहोस्`} */}
                                                        {/* {`${arabicToDevanagari(Number(submitYear))} ${monthNames[submitMonth]} महिनाको बिदाहरु हेर्नुहोस्`} */}
                                                        {`बि.सं. ${arabicToDevanagari(Number(submitYear))} ${monthNames[submitMonth]} महिनाको सार्वजनिक बिदाहरु (${arabicToDevanagari(data.length)} दिन)`}

                                                    </div>
                                                ) : (
                                                    <div className='ok-text  ok-title'>
                                                        {/* {`${arabicToDevanagari(Number(submitYear))} सालको बिदाहरु हेर्नुहोस्`} */}
                                                        {`बि.सं. ${arabicToDevanagari(Number(submitYear))} सालको सार्वजनिक बिदाहरु (${arabicToDevanagari(data.length)} दिन)`}
                                                    </div>
                                                )
                                            }
                                            <div className=' mt-2'>
                                                <div className="grid-item grid-item-2 grid-gap-5 ">
                                                    {
                                                        <>
                                                            {
                                                                newData.map((holiday) => {
                                                                    const remainingDays = getRemainingDays(String(holiday?.date?.ad_concat_date_en))
                                                                    return (
                                                                        <div key={holiday.id}>
                                                                            <div className={`card-day-event ${holiday.is_public_holiday === true ? 'is-holiday' : ''}`}>
                                                                                <div className="event-day-date">
                                                                                    {holiday.date.bs_date_np}
                                                                                    <span>{holiday.date.day_np.replace("वार", "")}</span>
                                                                                </div>
                                                                                <div className='flex gap-1'>
                                                                                    <div className="event-day-info">
                                                                                        <p
                                                                                            className='cursor'
                                                                                            onClick={() => handleClick(holiday)}>
                                                                                            {holiday.event_title_np}
                                                                                        </p>
                                                                                        <div className='ok-date-flex isholiday'>
                                                                                            <span>
                                                                                                {holiday.date.bs_month_np}{" "} {holiday.date.bs_date_np}, {" "}
                                                                                                {holiday.date.bs_year_np}

                                                                                            </span>
                                                                                            -
                                                                                            <span className='eng-font'>
                                                                                                {holiday.date.ad_month_en.slice(0, 3)}
                                                                                                {" "}
                                                                                                {holiday.date.ad_date_en},{" "}
                                                                                                {holiday.date.ad_year_en}
                                                                                            </span>
                                                                                        </div>
                                                                                    </div>

                                                                                    <div className="event-day-reminder">{nepaliDaysRemaining(remainingDays)}</div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                })
                                                            }
                                                        </>
                                                    }
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className='ok-no-data'>
                                            {
                                                submitMonth !== "-1" ? (
                                                    <>
                                                        {`${arabicToDevanagari(Number(submitYear))} ${monthNames[submitMonth]} महिनामा कुनै पनि बिदा छैन`}
                                                    </>
                                                ) : (
                                                    <>
                                                        {`${arabicToDevanagari(Number(submitYear))} सालमा कुनै पनि बिदा छैन`}
                                                    </>
                                                )
                                            }
                                        </div>
                                    )}

                                </>
                            )
                        }



                    </div>
                </div>
            </div>

            {
                popup && <Popup title="बिदाहरु" onClose={handleClose} data={eventInfo} eventData={eventData} />
            }

        </>
    );
};

export default Holiday;