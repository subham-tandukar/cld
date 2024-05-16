"use client"
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Loading from '../../loading';
import { arabicToDevanagari, removeHTMLTags } from '../../../hooks';
import { useRoot } from '../../../context';
import Share from '../../Components/Share/Share';
import SelectYear from '../../Components/SelectYear/SelectYear';
const Sahit = ({ currentdate }) => {
    const searchParams = useSearchParams();
    const { siteSetting } = useRoot();
    const [saitData, setSaitdata] = useState<any[]>([]);
    const [saitList, setSaitList] = useState<any[]>([]);
    const [saitLoading, setSaitLoading] = useState<boolean>(true);
    const [saitid, setSaitId] = useState<string>("");
    const [saitName, setSaitName] = useState<string>("");
    const [submitYear, setSubmitYear] = useState<string>(currentdate.bs_year_en);
    const [submitMonth, setSubmitMonth] = useState<string>("-1");

    const [selectedYear, setSelectedYear] = useState(currentdate.bs_year_en);
    const [selectedMonth, setSelectedMonth] = useState("-1");

    const getSaitData = async () => {
        const saitapi = `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/calendar/sahits`;

        try {
            setSaitLoading(true)
            const response = await fetch(saitapi, {
                cache: "no-store"
            });
            if (!response.ok) {
                console.error("failed to fetch data");
            }
            const sait = await response.json();
            setSaitdata(sait?.data)

            if (sait?.data.length > 0) {
                setSaitId(sait?.data[0].id);
            }
            if (sait?.data.length > 0) {
                setSaitName(sait?.data[0].title_np);
            }
        } catch (error) {
            console.error("failed to fetch data");
            setSaitdata([])
        }
    }

    const getSaitList = async () => {
        const saitapi = `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/calendar/sahit/${submitYear}/${saitid}?month=${submitMonth}`;

        try {
            setSaitLoading(true)
            const response = await fetch(saitapi, {
                cache: "no-store"
            });
            if (!response.ok) {
                console.error("failed to fetch data");
            }
            if (response.ok) {
                const sait = await response.json();
                setSaitList(sait?.data)
                setSaitLoading(false)
            }
        } catch (error) {
            console.error("failed to fetch data");
            setSaitList([])
            setSaitLoading(false)
        }
    }

    useEffect(() => {
        getSaitData()
    }, [])

    useEffect(() => {
        getSaitList()
    }, [submitYear, saitid, submitMonth])

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

    // const containerRef = useRef<HTMLDivElement>(null);

    // const handleScroll = (e: React.WheelEvent<HTMLDivElement>) => {
    //     const container = containerRef.current;
    //     if (!container) return;

    //     const scrollLeft = container.scrollLeft;
    //     const maxScrollLeft = container.scrollWidth - container.clientWidth;

    //     if ((scrollLeft >= maxScrollLeft && e.deltaY > 0) || (scrollLeft <= 0 && e.deltaY < 0)) {
    //         // If scrolled to the end in either direction, or scrolled to the start in the opposite direction
    //         return true; // Allow default scrolling behavior
    //     }

    //     e.preventDefault();
    //     container.scrollLeft += e.deltaY;
    // };

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
                            {siteSetting.sahit_title_np}
                        </li>
                    </ul>
                </div>

                <div className="ok-bg">
                    <div className="ok-desc-content">
                        <div className="ok-tab-flex">
                            <h4 className='ok-main-title'>
                                {siteSetting.sahit_title_np}
                            </h4>
                            <Share
                                endpoint="sahit"
                                title={`${siteSetting?.sahit_title_np} - Online Khabar Calendar`}
                                imageUrl={`${siteSetting?.sahit_thumbnail ? siteSetting?.sahit_thumbnail : siteSetting?.main_logo}`}
                            />
                        </div>
                        <div className="ok-content mt-2">
                            <p
                                dangerouslySetInnerHTML={{ __html: siteSetting.sahit_description_np }}
                            />
                        </div>
                    </div>

                    <div className="ok-suvasait-container">
                        <div>
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
                            <div className="wrapper mt-3">
                                <div className="btn__wrapper"
                                //  onWheel={handleScroll} 
                                //  ref={containerRef}
                                >
                                    {
                                        saitData.length > 0 && (
                                            <>
                                                {
                                                    saitData.map((data) => (
                                                        <div className="category__btn" key={data.id}>
                                                            <input type="radio" onChange={() => {
                                                                setSaitId(data.id);
                                                                setSaitName(data.title_np)
                                                            }} checked={saitid === data.id} id={data.title_en} name="suvaSait" />
                                                            <div className="dot"></div>
                                                            <label className="category__label " htmlFor={data.title_en}>{data.title_np}</label>
                                                        </div>
                                                    ))
                                                }
                                            </>
                                        )
                                    }
                                </div>
                            </div>
                        </div>

                        <div>
                            {
                                saitLoading ? (
                                    <Loading />
                                ) : (
                                    <>
                                        {
                                            saitList.length > 0 ? (
                                                <>
                                                    {
                                                        submitMonth !== "-1" ? (
                                                            <div className='ok-text ok-title'>
                                                                {`${arabicToDevanagari(Number(submitYear))} ${monthNames[submitMonth]} महिनाको ${saitName}को साइतहरु हेर्नुहोस्`}
                                                            </div>
                                                        ) : (
                                                            <div className='ok-text ok-title'>
                                                                {`${arabicToDevanagari(Number(submitYear))} सालको ${saitName}का साइतहरु हेर्नुहोस्`}
                                                            </div>
                                                        )
                                                    }

                                                    <div className='sait-grid grid-item grid-item-2 grid-gap-5 mt-2'>
                                                        <>

                                                            {
                                                                saitList.map((data) => {
                                                                    return (
                                                                        <div key={data.id} className="">

                                                                            <div className="card-day-event">
                                                                                <div>
                                                                                    <div className="suvasait-label">
                                                                                        {data?.data[0]?.bs_year_np}, <span>{data?.data[0]?.bs_month_np}</span> महिनाका साईतहरु
                                                                                    </div>

                                                                                    <div className="sait-dates">
                                                                                        <>
                                                                                            {
                                                                                                data?.data.length > 0 ? (
                                                                                                    <>
                                                                                                        {
                                                                                                            data?.data.map((item) => (
                                                                                                                <div key={item.id}>
                                                                                                                    <span>{item.bs_date_np}</span>
                                                                                                                    <div className="sait-date-bottom">
                                                                                                                        {item.ad_date_np}
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                            ))
                                                                                                        }
                                                                                                    </>
                                                                                                ) : (
                                                                                                    <div className='ok-no-data'>
                                                                                                        No data found
                                                                                                    </div>
                                                                                                )
                                                                                            }
                                                                                        </>


                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                })
                                                            }
                                                        </>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className='ok-no-data'>
                                                    {
                                                        submitMonth !== "-1" ? (
                                                            <>
                                                                {`${arabicToDevanagari(Number(submitYear))} ${monthNames[submitMonth]} महिनामा ${saitName}को कुनै पनि साइत छैन`}
                                                            </>
                                                        ) : (
                                                            <>
                                                                {`${arabicToDevanagari(Number(submitYear))} सालमा ${saitName}को कुनै पनि साइत छैन`}
                                                            </>
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

        </>
    );
};

export default Sahit;