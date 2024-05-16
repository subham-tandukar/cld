"use client"

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useRoot } from '../../../context';
import { arabicToDevanagari, formattedEngDate, formattedNepDate } from '../../../hooks';
import Loading from '../../loading';

const TodayBullion = ({ isBtn }) => {
    const { siteSetting, bullionData, loading } = useRoot();

    const bullion = bullionData && bullionData.length > 0
    const todayBullion = bullion && bullionData[0]

    return (
        <>
            <div className="card-all-festivals">
                <h3>
                    {
                        siteSetting?.today_gold_silver_title_np ||
                        "आजको सुन, चाँदीको दर"
                    }

                </h3>

                {
                    loading ? (
                        <Loading />
                    )
                        : (
                            <div className="ok-bullion-container">
                                <div className="today-bullion">
                                    {
                                        todayBullion && (
                                            <>
                                                <div className='today-bullion-date'>
                                                    {formattedNepDate(todayBullion.date_bs)} - {formattedEngDate(todayBullion.date)}
                                                </div>
                                                <div className="bullion-grid">
                                                    <div>
                                                        {
                                                            siteSetting?.hallmark_thumbnail && (
                                                                <div className="bullion-img">
                                                                    <img src={siteSetting?.hallmark_thumbnail} alt={
                                                                        siteSetting?.hallmark_title_np ||
                                                                        "छापावाल"
                                                                    } />
                                                                </div>

                                                            )
                                                        }
                                                        <div>

                                                            <h2>
                                                                {
                                                                    siteSetting?.hallmark_title_np ||
                                                                    "छापावाल"
                                                                }
                                                            </h2>
                                                            <p>
                                                                {arabicToDevanagari(todayBullion.gold_hallmark_tola)}
                                                                <span>प्रति तोला</span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="bullion-grid">
                                                    <div>
                                                        {
                                                            siteSetting?.tejabi_thumbnail && (
                                                                <div className="bullion-img">
                                                                    <img src={siteSetting?.tejabi_thumbnail} alt={
                                                                        siteSetting?.tejabi_title_np ||
                                                                        "तेजाबी"
                                                                    } />
                                                                </div>

                                                            )
                                                        }
                                                        <div>
                                                            <h2>
                                                                {
                                                                    siteSetting?.tejabi_title_np ||
                                                                    "तेजाबी"
                                                                }

                                                            </h2>
                                                            <p>
                                                                {arabicToDevanagari(todayBullion.gold_tejabi_tola)}
                                                                <span>प्रति तोला</span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="bullion-grid">
                                                    <div>
                                                        {
                                                            siteSetting?.silver_thumbnail && (
                                                                <div className="bullion-img">
                                                                    <img src={siteSetting?.silver_thumbnail} alt={
                                                                        siteSetting?.silver_title_np ||
                                                                        "चाँदी"
                                                                    } />
                                                                </div>

                                                            )
                                                        }
                                                        <div>

                                                            <h2>
                                                                {
                                                                    siteSetting?.silver_title_np ||
                                                                    "चाँदी"
                                                                }
                                                            </h2>
                                                            <p>
                                                                {arabicToDevanagari(todayBullion.silver_tola)}
                                                                <span>प्रति तोला</span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        )
                                    }


                                </div>

                                {
                                    isBtn === "true" && (

                                        <div className='mt-2'>
                                            <Link className='btn btn-medium primary primary-gradient' href="/bullion">
                                                {siteSetting?.gold_silver_btn_text_np || "थप जानकारी"}
                                            </Link>
                                        </div>
                                    )
                                }
                            </div>

                        )
                }


            </div>



        </>
    );
};

export default TodayBullion