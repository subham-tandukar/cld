"use client"
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useRoot } from '../../../context';
import Loading from '../../loading';
import { arabicToDevanagari, formattedEngDate, formattedNepDate } from '../../../hooks';
import Share from '../../Components/Share/Share';

const Bullion = () => {

    const { siteSetting, bullionData, loading } = useRoot();

    const [bullionFilter, setBullionFilter] = useState<string>("tola");



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
                            {siteSetting.gold_silver_page_title_np || "सुन-चाँदी"}
                        </li>
                    </ul>
                </div>

                <div className="ok-bg">
                    <div className="ok-desc-content">
                        <div className="ok-tab-flex">

                            <h4 className='ok-main-title'>
                                {siteSetting.gold_silver_page_title_np || "सुन-चाँदी"}
                            </h4>

                            <Share
                                endpoint="bullion"
                                title={`${siteSetting?.gold_silver_page_title_np} - Online Khabar Calendar`}
                                imageUrl={`${siteSetting?.gold_silver_page_thumbnail ? siteSetting?.gold_silver_page_thumbnail : siteSetting?.main_logo}`}
                            />
                        </div>
                        <div className="ok-content mt-2">
                            {
                                siteSetting.gold_silver_page_description_np ?
                                    (

                                        <p

                                            dangerouslySetInnerHTML={{ __html: siteSetting.gold_silver_page_description_np }}
                                        />
                                    ) : (
                                        <>
                                            <p>
                                                बुलियन भनेको सुन, चाँदी, वा अन्य बहुमूल्य धातुहरूलाई बुझाउँछ जुन तिनीहरूको शुद्धता र दुर्लभताको लागि चिनिने गरिन्छ । नेपालमा, सुन-चाँदीलाई वस्तुको रूपमा व्यापार गरिन्छ र प्रायः यसलाई लगानीको रूपमा लिइदै आएको छ।
                                            </p>
                                            <p></p>
                                            <p>
                                                बुलियनको मूल्य (दैनिक सुन चाँदीको दर - Daily Gold Silver price) दैनिक रूपमा उतार चढाव हुन सक्छ । किनकि यो बजारको माग, आर्थिक अवस्था, र भूराजनीतिक घटनाक्रमहरुका कारण अथवा अन्य विभिन्न कारकहरूद्वारा प्रभावित भइरहन्छ।
                                            </p>
                                        </>
                                    )
                            }

                        </div>
                    </div>


                    <div className="">

                        <div className="tab-nav rashifal">
                            <div className="wrapper">
                                <div className="btn__wrapper">
                                    <div className="category__btn">
                                        <input type="radio" onChange={() => {
                                            setBullionFilter("tola");
                                        }}
                                            checked={bullionFilter === "tola"}
                                            id="tola"
                                            name="bullion" />

                                        <label className="category__label " htmlFor="tola">रू प्रति तोला</label>
                                    </div>
                                    <div className="category__btn">
                                        <input type="radio" onChange={() => {
                                            setBullionFilter("gram");
                                        }}
                                            checked={bullionFilter === "gram"}
                                            id="gram"
                                            name="bullion" />

                                        <label className="category__label " htmlFor="gram">रू प्रति १० ग्राम</label>
                                    </div>

                                </div>
                            </div>
                        </div>

                        {
                            loading ? (
                                <Loading />
                            ) : (

                                <>
                                    {
                                        bullionData.length > 0 ? (
                                            <div className="bullion__table">
                                                <div className="ok__table">
                                                    <table >
                                                        <thead>
                                                            <tr>
                                                                <th>मिति</th>
                                                                <th>
                                                                    छापावाल
                                                                </th>
                                                                <th>
                                                                    तेजाबी
                                                                </th>
                                                                <th>
                                                                    चाँदी
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                bullionData.slice(0, 26).map((item) => (
                                                                    <tr>
                                                                        <td>
                                                                            {formattedNepDate(item.date_bs)} - {formattedEngDate(item.date)}
                                                                        </td>
                                                                        <td>
                                                                            {
                                                                                bullionFilter === "tola" ? (
                                                                                    <>
                                                                                        {arabicToDevanagari(item.gold_hallmark_tola)}
                                                                                    </>
                                                                                ) : (
                                                                                    <>
                                                                                        {arabicToDevanagari(item.gold_hallmark_gm)}
                                                                                    </>
                                                                                )
                                                                            }

                                                                        </td>
                                                                        <td>
                                                                            {
                                                                                bullionFilter === "tola" ? (
                                                                                    <>
                                                                                        {arabicToDevanagari(item.gold_tejabi_tola)}
                                                                                    </>
                                                                                ) : (
                                                                                    <>
                                                                                        {arabicToDevanagari(item.gold_tejabi_gm)}
                                                                                    </>
                                                                                )
                                                                            }

                                                                        </td>
                                                                        <td className='tx-align-l'>
                                                                            {
                                                                                bullionFilter === "tola" ? (
                                                                                    <>
                                                                                        {arabicToDevanagari(item.silver_tola)}
                                                                                    </>
                                                                                ) : (
                                                                                    <>
                                                                                        {arabicToDevanagari(item.silver_gm)}
                                                                                    </>
                                                                                )
                                                                            }

                                                                        </td>
                                                                    </tr>
                                                                ))
                                                            }
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        ) : (

                                            <p>कुनै डाटा उपलब्ध छैन</p>

                                        )
                                    }
                                </>
                            )
                        }


                    </div>
                </div>


            </div >
        </>
    );
};

export default Bullion;