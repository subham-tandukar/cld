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

const UpcomingEvent = ({ currentdate }) => {
    const { siteSetting } = useRoot();
    const [submitYear, setSubmitYear] = useState<string>(currentdate.bs_year_en);
    const [submitMonth, setSubmitMonth] = useState<string>(currentdate.bs_month_code_en);
    const [submitNextMonth, setSubmitNextMonth] = useState<any>(Number(currentdate.bs_month_code_en) === 12 ? 1 : Number(currentdate.bs_month_code_en) + 1);

    const [selectedYear, setSelectedYear] = useState(currentdate.bs_year_en);
    const [selectedMonth, setSelectedMonth] = useState("");


    const handleChangeYear = (e) => {
        const enteredYear = parseInt(e.target.value);
        const currentYear = currentdate.bs_year_en; // Get current Gregorian year

        // Check if the entered year is greater than or equal to the current year
        if (enteredYear >= currentYear) {
            setSelectedYear(enteredYear);
        }
        setSelectedMonth("")
    };

    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const getEventList = async () => {
        const eventapi = `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/calendar/upcoming?type=events&year=${submitYear}&months=${submitMonth},${submitNextMonth}`;

        try {
            setLoading(true)
            const response = await fetch(eventapi, {
                cache: "no-store"
            });
            if (!response.ok) {
                console.error("failed to fetch data");
            }
            if (response.ok) {
                const event = await response.json();
                setData(event?.data)
                setLoading(false)
            }
        } catch (error) {
            console.error("failed to fetch data");
            setData([])
            setLoading(false)
        }
    }

    useEffect(() => {
        getEventList()
    }, [submitYear, submitNextMonth, submitMonth])

    const [monthList, setMonthList] = useState<any[]>([]);

    const getMonthList = async () => {
        const eventapi = `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/helper/upcoming-months/${selectedYear}`;

        try {
            const response = await fetch(eventapi, {
                cache: "no-store"
            });
            if (!response.ok) {
                console.error("failed to fetch data");
            }
            if (response.ok) {
                const month = await response.json();
                setMonthList(month?.data)
            }
        } catch (error) {
            console.error("failed to fetch data");
            setMonthList([])
        }
    }

    useEffect(() => {
        getMonthList()
    }, [selectedYear])

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
        setSubmitNextMonth("")
    };

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
                            {siteSetting.upcoming_events_title_np}
                        </li>
                    </ul>
                </div>

                <div className="ok-bg">
                    <div className="ok-desc-content ">

                        <div className="ok-tab-flex">
                            <h4 className='ok-main-title'>
                                {siteSetting.upcoming_events_title_np}
                            </h4>
                            <Share
                                endpoint="upcoming-event"
                                title={`${siteSetting?.upcoming_events_title_np} - Online Khabar Calendar`}
                                imageUrl={`${siteSetting?.upcoming_events_thumbnail ? siteSetting?.upcoming_events_thumbnail : siteSetting?.main_logo}`}
                            />
                        </div>
                        <div className="ok-content mt-2">
                            <p
                                dangerouslySetInnerHTML={{ __html: siteSetting.upcoming_events_description_np }}
                            />
                        </div>
                    </div>

                    <div className="">

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
                                        onChange={handleChangeYear}
                                    />

                                </div> */}
                                    <SelectYear currentdate={currentdate} selectedYear={selectedYear} setSelectedYear={setSelectedYear} />

                                </div>

                                <div className='filter__flex'>
                                    <label className="mb-10 d-block">महिना रोज्नुहोस्</label>
                                    <div className='ok-filter-month'>

                                        <select
                                            value={selectedMonth}
                                            onChange={(e) => setSelectedMonth(e.target.value)}
                                        >

                                            <option value="" disabled>महिना रोज्नुहोस्</option>
                                            {
                                                monthList.map((item) => (

                                                    <option value={item} key={item}>{monthNames[item]}</option>
                                                ))
                                            }
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

                        {
                            loading ? (
                                <Loading />
                            ) : (
                                <>
                                    {newData && newData.length > 0 ? (
                                        <>

                                            <div className='mt-3'>
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
                                                                                            onClick={() => handleClick(holiday)}
                                                                                        >
                                                                                            {holiday.event_title_np}
                                                                                        </p>
                                                                                        <div className='ok-date-flex'>
                                                                                            <span>
                                                                                                {holiday.date.bs_month_np}{" "} {holiday.date.bs_date_np},{" "}
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
                                            कुनै पनि इभेन्ट छैन
                                        </div>
                                    )}

                                </>
                            )
                        }



                    </div>
                </div>
            </div>

            {
                popup && <Popup title="आगामी इभेन्टहरु" onClose={handleClose} data={eventInfo} eventData={eventData} />
            }

        </>
    );
};

export default UpcomingEvent;