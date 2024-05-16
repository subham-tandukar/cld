"use client"
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { useRoot } from '../../../context';
import Share from '../../Components/Share/Share';
const Rashifal = ({ rashifaldata }) => {
    const { siteSetting, activeTab, setActiveTab } = useRoot();

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
                            राशिफल
                        </li>
                    </ul>
                </div>

                <div className="ok-bg">
                    <div className="ok-desc-content">
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
                        {/* <h4>
                        राशिफल
                    </h4> */}
                        {/* <div className='ok-rashifal-jyotish'>
                        <img src="./img/Uttam-Upadhya.jpg" alt="Uttam Upadhya, Onlinekhabar Rashifal" />
                        <div className='mt-1'>
                            <span>ज्यो.प. डा.उत्तम उपाध्याय न्यौपाने</span>
                            <div className="ok-content mt-1">
                                <p>
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati asperiores soluta debitis et tempore architecto vel autem repudiandae? Inventore vel repellendus velit dignissimos ipsum perferendis architecto, natus pariatur libero quas!
                                </p>
                            </div>
                        </div>
                    </div> */}
                        <div className="ok-content mt-2">
                            <p

                                dangerouslySetInnerHTML={{ __html: siteSetting.rashifal_description_np }}
                            />
                        </div>
                    </div>

                    <div className="ok-rashifal-container">
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
                                endpoint="rashifal"
                                title={`${siteSetting?.rashifal_title_np || "राशिफल"} - Online Khabar Calendar`}
                                imageUrl={`${siteSetting?.rashifal_thumbnail ? siteSetting?.rashifal_thumbnail : siteSetting?.main_logo}`}
                            />
                        </div>

                        <div className="grid-item grid-item-6 grid-gap-5 mt-2">
                            {
                                rashifaldata.length > 0 ? (
                                    <>
                                        {
                                            rashifaldata.map((item) => (
                                                <div key={item.slug}>
                                                    <Link href={`/rashifal/${item.slug}`} className="card-item">
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
                </div>
            </div>

        </>
    );
};

export default Rashifal;