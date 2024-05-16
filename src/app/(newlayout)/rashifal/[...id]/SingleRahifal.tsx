"use client"

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useRoot } from '../../../../context';
import Image from 'next/image';

import SidebarRashifal from './SidebarRahifal';
import Loading from '../../../loading';
import Head from 'next/head';
import NotFound from '../../../not-found';
import Share from '../../../Components/Share/Share';
import NepaliDate from 'nepali-date-converter';
import { arabicToDevanagari, dayNames, monthNames } from '../../../../hooks';
import useSWR from 'swr';
interface Rashifal {
    slug: string;
    name: string;
    rashifal: any;
    rashi_data: {
        icon: any,
        rashi_letters: string,
        subha_rang: string,
        mitra_rashi: string,
        lucky_day_number: string,
    };
    // Add other properties as needed
}

const SingleRashifal = ({ rashifalData, params, singleFooterData, }) => {
    const { setSingleRashi, siteSetting, activeTab,
        setActiveTab } = useRoot()
    const [data, setData] = useState<Rashifal[]>([]);
    const [filteredData, setFilteredData] = useState<Rashifal | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const fetcher = async (url: string) => {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Failed to fetch');
        }

        return response.json();
    };

    const getType = (activeTab) => {
        if (activeTab.tab1) {
            return "daily";
        } else if (activeTab.tab2) {
            return "monthly";
        } else if (activeTab.tab3) {
            return "yearly";
        }
        return "daily"; // Default type
    };

    const { data: fetchedData } = useSWR(`https://www.onlinekhabar.com/wp-json/okapi/v2/rashifal/type/${getType(activeTab)}`,
        fetcher
    );


    useEffect(() => {
        if (fetchedData) {
            setData(fetchedData);
        }
    }, [fetchedData]);

    useEffect(() => {
        if (!fetchedData) {
            setLoading(true)
        } else {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        if (data) {
            const filteredList = data.filter((item) => {
                return (
                    item.slug === params.id[0]
                )
            })
            setFilteredData(filteredList[0])
        }
    }, [data])


    useEffect(() => {
        setSingleRashi(filteredData)
        scrollToRashifalContainer()
    }, [filteredData, params])

    const scrollToRashifalContainer = () => {
        const rashifalContainer = document.getElementById('ok-rashifal-container');
        if (rashifalContainer) {
            const offset = 100; // Adjust the offset value according to your needs
            const topPos = rashifalContainer.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top: topPos, behavior: 'smooth' });
        }
    };
    const handleTab1 = () => {
        setActiveTab({
            tab1: true,
            tab2: false,
            tab3: false,
        })
    }
    const handleTab2 = () => {
        setActiveTab({
            tab1: false,
            tab2: true,
            tab3: false,
        })
    }
    const handleTab3 = () => {
        setActiveTab({
            tab1: false,
            tab2: false,
            tab3: true,
        })
    }

    // Get the current Nepali date
    const currentNepaliDate = new NepaliDate();

    // Extract the current year from the Nepali date
    const currentNepaliDay = currentNepaliDate.getDay();
    const currentNepaliTodayDate = currentNepaliDate.getDate();
    const currentNepaliMonth = currentNepaliDate.getMonth();
    const currentNepaliYear = currentNepaliDate.getYear();

    return (
        <>

            <div className="okv4-container">
                <div className="ok-breadcrumb">
                    <ul>
                        <li>
                            <Link href="https://www.onlinekhabar.com/" target='_blank'>अनलाइनखबर</Link>
                        </li>
                        <li>
                            <Link href="/">क्यालेन्डर</Link>
                        </li>
                        <li>
                            <Link href="/rashifal">राशिफल</Link>
                        </li>
                        {
                            filteredData && filteredData.name && (

                                <li className='active'>
                                    {filteredData.name}
                                </li>
                            )
                        }
                    </ul>
                </div>

                {/* {
                    loading ? (
                        <Loading />
                    ) : (
                        <> */}

                <div className="ok-bg">
                    <>
                        {
                            // loading ? (
                            //     <Loading />
                            // ) :
                            filteredData && (
                                <>
                                    <div className="ok-desc-content ">
                                        <div className="ok-single-rashifal-banner">
                                            <img width={900} height={400} src={siteSetting.rashifal_background_image
                                            } alt="" />
                                            <div className="banner-content">
                                                <h2>
                                                    {siteSetting.rashifal_heading_np}
                                                </h2>
                                                <p>
                                                    {siteSetting.rashifal_sub_heading_np}
                                                </p>
                                                {
                                                    siteSetting.jyotish_url && (
                                                        <Link href={siteSetting.jyotish_url || "#"} target='_blank'>
                                                            {siteSetting.jyotish_url_text}
                                                        </Link>

                                                    )
                                                }

                                            </div>
                                            {
                                                siteSetting.jyotish_name_np && (

                                                    <div className="banner-badge">
                                                        {siteSetting.jyotish_name_np}
                                                    </div>
                                                )
                                            }
                                        </div>
                                        <div className="ok-content mt-2">
                                            <p

                                                dangerouslySetInnerHTML={{ __html: siteSetting.rashifal_description_np }}
                                            />
                                        </div>
                                    </div>

                                    <div className="ok-rashifal-container" id="ok-rashifal-container">
                                        <div className="ok-tab-flex">

                                            <div className="tab-nav rashifal">
                                                <div className="wrapper">
                                                    <div className="btn__wrapper">
                                                        <div className={`category__btn ${activeTab.tab1 === true ? "active" : ""}`} onClick={handleTab1}>
                                                            <input type="radio" id="todayRashi" name="category" />
                                                            <label className="category__label " htmlFor="todayRashi">दैनिक</label>
                                                        </div>
                                                        <div className={`category__btn ${activeTab.tab2 === true ? "active" : ""}`} onClick={handleTab2}>
                                                            <input type="radio" id="weeklyRashi" name="category" />
                                                            <label className="category__label" htmlFor="weeklyRashi">मासिक</label>
                                                        </div>
                                                        <div className={`category__btn ${activeTab.tab3 === true ? "active" : ""}`} onClick={handleTab3}>
                                                            <input type="radio" id="monthlyRashi" name="category" />
                                                            <label className="category__label" htmlFor="monthlyRashi">बार्षिक</label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <Share
                                                endpoint={`rashifal/${params.id}`}
                                                title={`${filteredData && filteredData?.name} - ${arabicToDevanagari(currentNepaliTodayDate)} ${monthNames[currentNepaliMonth]} ${arabicToDevanagari(currentNepaliYear)}, ${dayNames[currentNepaliDay]}`}
                                                imageUrl={filteredData && filteredData?.rashi_data?.icon}
                                            />

                                        </div>

                                        <div className="ok-rashifal-single-details mt-3">
                                            <div className="ok-rashifal-flex">
                                                <div className="single-rashi-img">
                                                    <img src={filteredData && filteredData?.rashi_data?.icon} alt="" />
                                                </div>
                                                <div className="rashi-content-details">

                                                    <div className="rashi-name-info">
                                                        <h5>{filteredData && filteredData.name} <span>{filteredData && filteredData?.rashi_data?.rashi_letters}</span></h5>
                                                    </div>

                                                    <div className="tab-container entry-content">
                                                        {/* {
                                                                activeTab.tab1 && (
                                                                    <> */}
                                                        <div className="ok-news-post-hour rashifal-date">
                                                            <span>
                                                                {
                                                                    activeTab.tab1 ? (
                                                                        `${arabicToDevanagari(currentNepaliTodayDate)} ${monthNames[currentNepaliMonth]} ${arabicToDevanagari(currentNepaliYear)}, ${dayNames[currentNepaliDay]}`
                                                                    )
                                                                        : activeTab.tab2 ? (
                                                                            `${monthNames[currentNepaliMonth]} ${arabicToDevanagari(currentNepaliYear)}`
                                                                        )
                                                                            : activeTab.tab3 ? (
                                                                                `${arabicToDevanagari(currentNepaliYear)} | वार्षिक राशिफल`
                                                                            )
                                                                                : null
                                                                }
                                                            </span>
                                                        </div>

                                                        <div className="rashi-contenT">
                                                            <p>
                                                                {filteredData && filteredData?.rashifal}
                                                            </p>

                                                        </div>


                                                    </div>
                                                </div>

                                            </div>

                                            {
                                                filteredData?.rashi_data?.subha_rang || filteredData?.rashi_data?.mitra_rashi || filteredData?.rashi_data?.lucky_day_number ? (

                                                    <div className="ok-subha-rang">
                                                        {
                                                            filteredData?.rashi_data?.subha_rang && <span><b>शुभ रङ</b> : {filteredData?.rashi_data?.subha_rang}</span>
                                                        }

                                                        {
                                                            filteredData?.rashi_data?.mitra_rashi && <span><b>मित्र राशि</b> : {filteredData?.rashi_data?.mitra_rashi}</span>
                                                        }

                                                        {
                                                            filteredData?.rashi_data?.lucky_day_number && <span><b>भाग्यशाली दिन र नंबर</b> :{filteredData?.rashi_data?.lucky_day_number}</span>
                                                        }
                                                    </div>
                                                ) : null
                                            }

                                            <div className="rashi-profile-list-mobile">
                                                <SidebarRashifal />
                                            </div>

                                            <div className="ok-block-rashifal mt-2">
                                                {/* <div className="rashifal-icon-cards grid-item grid-item-6 grid-gap-20">
                        {
                            rashifalData.length > 0 && (
                                <>
                                    {
                                        rashifalData.map((item) => (
                                            <Link key={item.slug} href={`/rashifal/${item.slug}`} className={`card-item ${item.slug === params.id ? "active-card" : ""}`}>
                                                <img src={item.icon} alt={item.name} />
                                                <h5>{item.name}</h5>
                                            </Link>
                                        ))
                                    }
                                </>
                            )
                        }


                    </div> */}

                                                <div className="grid-item grid-item-6 grid-gap-5 mt-2">
                                                    {
                                                        rashifalData.length > 0 ? (
                                                            <>
                                                                {
                                                                    rashifalData.map((item) => (
                                                                        <div key={item.slug} className={`${item.slug === params.id[0] ? "active-card" : ""}`}>
                                                                            <Link key={item.slug} href={`/rashifal/${item.slug}`} className={`card-item`}>
                                                                                <img src={item?.rashi_data?.icon} alt={item.name} />
                                                                                <h5>{item.name}</h5>
                                                                                <span>{item?.rashi_data?.rashi_letters}</span>
                                                                            </Link>
                                                                        </div>
                                                                    ))
                                                                }
                                                            </>
                                                        ) : (
                                                            <div>कुनै डाटा उपलब्ध छैन</div>
                                                        )
                                                    }
                                                </div>
                                            </div>

                                            {
                                                singleFooterData.footer_details_np && (

                                                    <div className="ok-rashi-more-content  entry-content mt-4">
                                                        <p

                                                            dangerouslySetInnerHTML={{ __html: singleFooterData.footer_details_np }}
                                                        />
                                                    </div>
                                                )
                                            }
                                        </div>
                                    </div>
                                </>
                                // ) : (
                                //     <NotFound />
                            )
                        }
                    </>
                </div>
                {/* </>
                    )
                }
 */}


            </div>

        </>
    );
};

export default SingleRashifal;