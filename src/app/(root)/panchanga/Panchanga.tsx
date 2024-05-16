"use client"
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Loading from '../../loading';
import { arabicToDevanagari } from '../../../hooks';
import { useRoot } from '../../../context';
import Share from '../../Components/Share/Share';


const Panchanga = () => {
    const { siteSetting } = useRoot();
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const getList = async () => {
        const saitapi = `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/calendar/panchangas`;

        try {
            setLoading(true)
            const response = await fetch(saitapi, {
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
        getList()
    }, [])

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
                            {siteSetting.panchanga_title_np}
                        </li>
                    </ul>
                </div>

                <div className="ok-bg">

                    <div className="ok-desc-content">
                        <div className="ok-tab-flex">
                            <h4 className='ok-main-title'>
                                {siteSetting.panchanga_title_np}
                            </h4>
                            <Share
                                endpoint="panchanga"
                                title={`${siteSetting?.panchanga_title_np} - Online Khabar Calendar`}
                                imageUrl={`${siteSetting?.panchanga_thumbnail ? siteSetting?.panchanga_thumbnail : siteSetting?.main_logo}`}
                            />
                        </div>
                        <div className="ok-content mt-2">
                            <p
                                dangerouslySetInnerHTML={{ __html: siteSetting.panchanga_description_np }}
                            />
                        </div>
                    </div>


                    {
                        loading ? (
                            <Loading />
                        ) : (
                            <>
                                {
                                    data && data.length > 0 ? (
                                        <>
                                            {
                                                data.map((item) => (

                                                    <div key={item.id} className="panchanga  ok-panchanga-container">
                                                        <div className="">

                                                            <h2 className='ok-title'>{item.bs_month_np} {item.bs_date_np}, {item.bs_year_np} को पञ्चाङ्गहरु</h2>
                                                        </div>
                                                        <div className="panchanga__data">
                                                            <div className="wrapper">
                                                                <div className="title">तारिख:</div>
                                                                <div className="txt small-eng-font">{item.ad_month_en} {item.ad_date_en}, {item.ad_year_en}</div>
                                                            </div>
                                                            <div className="wrapper">
                                                                <div className="title">पक्ष:</div>
                                                                <div className="txt">{item.panchanga.pakshya_np}</div>
                                                            </div>
                                                            <div className="wrapper">
                                                                <div className="title">सूर्योदय</div>
                                                                <div className="txt">{item.panchanga.sunrise_np}</div>
                                                            </div>
                                                            <div className="wrapper">
                                                                <div className="title">सूर्यास्त:</div>
                                                                <div className="txt">{item.panchanga.sunset_np}</div>
                                                            </div>
                                                            <div className="wrapper">
                                                                <div className="title">चन्द्र राशि:</div>
                                                                <div className="txt">{item.panchanga.chandra_rashi_np}</div>
                                                            </div>
                                                            <div className="wrapper">
                                                                <div className="title">सूर्य राशि:</div>
                                                                <div className="txt">{item.panchanga.surya_rashi_np}</div>
                                                            </div>


                                                            <div className="wrapper">
                                                                <div className="title">नक्षत्र समाप्ति समय:</div>
                                                                <div className="txt">{item.panchanga.nakshatra_end_time_np}</div>
                                                            </div>
                                                            <div className="wrapper">
                                                                <div className="title">योग:</div>
                                                                <div className="txt">{item.panchanga.yog_np}</div>
                                                            </div>
                                                            <div className="wrapper">
                                                                <div className="title"> प्रथम करण:</div>
                                                                <div className="txt">{item.panchanga.pratham_karan_np}</div>
                                                            </div>
                                                            <div className="wrapper">
                                                                <div className="title">अयान:</div>
                                                                <div className="txt">{item.panchanga.ayan_np}</div>
                                                            </div>
                                                            <div className="wrapper">
                                                                <div className="title">ऋतु:</div>
                                                                <div className="txt">{item.panchanga.ritu_np}</div>
                                                            </div>
                                                            <div className="wrapper">
                                                                <div className="title">तिथी:</div>
                                                                <div className="txt">{item.tithi?.tithi_title_np} {item.tithi?.tithi_end_time_np} बजेसम्म</div>
                                                            </div>

                                                            <div className="wrapper">
                                                                <div className="title">करण १:</div>
                                                                <div className="txt">{item.panchanga.pratham_karan_np ? item.panchanga.pratham_karan_np : "-"}</div>
                                                            </div>
                                                            <div className="wrapper">
                                                                <div className="title">करण २:</div>
                                                                <div className="txt">{item.panchanga.dutiya_karan_np ? item.panchanga.dutiya_karan_np : "-"}</div>
                                                            </div>

                                                        </div>
                                                    </div>
                                                ))
                                            }
                                        </>
                                    ) : (
                                        <div className='ok-no-data'>
                                            कुनै डाटा उपलब्ध छैन
                                        </div>
                                    )
                                }
                            </>
                        )
                    }
                </div>

            </div>

        </>
    );
};

export default Panchanga;