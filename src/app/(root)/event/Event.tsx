"use client"

import React, { useEffect, useState } from 'react';
import Calendar from "@sbmdkl/nepali-datepicker-reactjs";
import "@sbmdkl/nepali-datepicker-reactjs/dist/index.css";
import Loading from '../../loading';
import { arabicToDevanagari, getRemainingDays, nepaliDaysRemaining } from '../../../hooks';
import NepaliDateConverter from 'nepali-date-converter';
import Popup from './Popup';
import { AiOutlineEdit } from "react-icons/ai";
import { FaEye } from "react-icons/fa6";
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import ScheduleOffcanvas from '../../Components/Offcanvas/ScheduleOffCanvas/ScheduleOffcanvas';
import { useRoot } from '../../../context';
import Share from '../../Components/Share/Share';
import SelectYear from '../../Components/SelectYear/SelectYear';
interface Event {
    id: number;
    is_public_holiday: boolean;
    event_title_np: string;
    date: {
        bs_month_np: string;
        bs_date_np: string;
        bs_year_np: string;
        ad_date_en: string;
        ad_month_en: string;
        id: number;
        ad_year_en: string;
        ad_concat_date_en: string;
        bs_concat_date_en: string;

    }

}

interface EventData {
    id: number;
    event_title_np: string;
    is_public_holiday: boolean;
    date: {
        bs_concat_date_en: string;
        ad_concat_date_en: string;
        bs_date_np: string;
        day_np: string;
        bs_month_np: string;
        bs_year_np: string;
        ad_month_np: string;
        ad_date_np: string;
        ad_year_np: string;
    };
}
const Event = ({ currentdate }) => {
    const { siteSetting } = useRoot();
    const { data: session, status } = useSession();
    const [submitYear, setSubmitYear] = useState<string>(currentdate.bs_year_en);
    const [submitMonth, setSubmitMonth] = useState<string>(currentdate.bs_month_code_en);

    const [selectedYear, setSelectedYear] = useState(currentdate.bs_year_en);
    const [selectedMonth, setSelectedMonth] = useState(currentdate.bs_month_code_en);

    const [today, setToday] = useState('');

    const initialValue = {
        selectedDate: today,
    };

    const [formValue, setFormValue] = useState(initialValue);
    useEffect(() => {
        const currentDate = new NepaliDateConverter();
        setToday(currentDate.format('YYYY/M/D'))
        setFormValue({ selectedDate: currentDate.format('YYYY/M/D') });
    }, []);
    const handleDate = ({ bsDate }: { bsDate: string }) => {
        setFormValue({ ...formValue, selectedDate: bsDate });
    };

    const [eventList, setEventList] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    const getEventList = async () => {
        const EventApi = `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/calendar/events/months/bs/${submitYear}/${submitMonth}/?type=events`;

        try {
            setLoading(true)
            const response = await fetch(EventApi, {
                cache: "no-store"
            });

            if (!response.ok) {
                console.error("Failed to fetch data");
            }

            if (response.ok) {
                const data = await response.json();
                setEventList(data?.data);
                setLoading(false)
            }

        } catch (error) {
            console.error("Failed to fetch data");
            setEventList([]);
            setLoading(false)
        }
    };

    useEffect(() => {
        getEventList();
    }, [submitMonth, submitYear]);

    let newData: Event[] = [];
    eventList.forEach(event => {
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



    const [popup, setPopup] = useState(false)
    const handleClose = () => {
        setPopup(false)
    }
    const [eventInfo, setEventInfo] = useState([])
    const [eventData, setEventData] = useState([])

    const handleClick = (props, data) => {
        setEventData(props)
        setEventInfo(data)
        setPopup(!popup)
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        setSubmitYear(selectedYear)
        setSubmitMonth(selectedMonth)
    };

    const [isOffCanvasOpen, setIsOffCanvasOpen] = useState(false);

    const handleToggleOffCanvas = () => {
        setIsOffCanvasOpen(!isOffCanvasOpen);
    };

    const handleCloseOffCanvas = () => {
        setIsOffCanvasOpen(false);
    };

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
                            {siteSetting.events_title_np}
                        </li>
                    </ul>
                </div>

                <div className="ok-bg">
                    <div className="ok-desc-content">

                        <div className="ok-tab-flex">
                            <h4 className='ok-main-title'>
                                {siteSetting.events_title_np}
                            </h4>
                            <Share
                                endpoint="event"
                                title={`${siteSetting?.events_title_np} - Online Khabar Calendar`}
                                imageUrl={`${siteSetting?.events_thumbnail ? siteSetting?.events_thumbnail : siteSetting?.main_logo}`}
                            />
                        </div>
                        <div className="ok-content mt-2">
                            <p
                                dangerouslySetInnerHTML={{ __html: siteSetting.events_description_np }}
                            />
                        </div>
                    </div>
                    <div className="">
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
                                                <div className='ok-filter-month'>

                                                    <select
                                                        value={selectedMonth}
                                                        onChange={(e) => setSelectedMonth(e.target.value)}
                                                    >

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


                        </div>
                        <div className="">

                            {
                                loading ? (
                                    <Loading />
                                ) : (

                                    <>
                                        {
                                            newData.length > 0 ? (
                                                <div className="my__events">
                                                    <div className="ok__table">
                                                        <table >
                                                            <thead>

                                                                <tr>
                                                                    <th>मिति</th>
                                                                    <th>
                                                                        कार्यक्रमहरू
                                                                    </th>
                                                                    <th></th>
                                                                    <th></th>
                                                                </tr>

                                                            </thead>
                                                            <tbody>

                                                                {
                                                                    newData.map((event) => {
                                                                        const { bs_month_np, bs_date_np, bs_year_np, ad_date_en, ad_month_en, ad_year_en } = event.date
                                                                        const remainingDays = getRemainingDays(String(event.date.ad_concat_date_en))
                                                                        return (
                                                                            <tr key={event.id} >
                                                                                <td>
                                                                                    <span>{bs_month_np} {bs_date_np}, {bs_year_np}</span>
                                                                                    <span>{ad_date_en} {ad_month_en}, {ad_year_en}</span>
                                                                                </td>
                                                                                <td>
                                                                                    <span className={`ok-event-title ${event?.is_public_holiday ? "is-holiday" : ""}`}
                                                                                    >
                                                                                        {event.event_title_np}
                                                                                    </span>
                                                                                </td>
                                                                                <td>{nepaliDaysRemaining(remainingDays)}</td>
                                                                                <td>
                                                                                    <div className='ok-popup-cta'>
                                                                                        <span className='ok-cta' onClick={() => handleClick(event.date, event)}>
                                                                                            <FaEye />
                                                                                        </span>
                                                                                    </div>
                                                                                </td>
                                                                            </tr>
                                                                        )
                                                                    })
                                                                }
                                                            </tbody>
                                                        </table>

                                                    </div>
                                                </div>
                                            ) : (
                                                <div className=''>

                                                    {
                                                        status === 'unauthenticated' ? (

                                                            <Link href="/login" className='ok-add-events'>
                                                                इभेन्ट भेटिएन? इभेन्ट थप्नको लागि लगइन गर्नुहोस

                                                                <img src="img/arrow-right.svg" alt="" />

                                                            </Link>
                                                        ) : (
                                                            <div className='ok-add-events' onClick={handleToggleOffCanvas}>
                                                                इभेन्ट थप्नुहोस्
                                                                <img src="img/arrow-right.svg" alt="" />

                                                            </div>
                                                        )
                                                    }

                                                </div>
                                            )
                                        }
                                    </>
                                )
                            }


                        </div>
                    </div>
                </div>
            </div>


            {
                popup && <Popup title="इभेन्ट" onClose={handleClose} data={eventInfo} eventData={eventData} />
            }

            {isOffCanvasOpen && <ScheduleOffcanvas isDayCanvas={false} Selecteddate={eventData} onClose={handleCloseOffCanvas} />}

        </>
    );
};

export default Event;