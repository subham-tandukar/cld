"use client"
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useRoot } from '../../../context';
import Share from '../../Components/Share/Share';

const About = () => {

    const { siteSetting } = useRoot();
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
                            {
                                siteSetting?.about_title_np || "अनलाइन क्यालेन्डर"
                            }

                        </li>
                    </ul>
                </div>

                <div className="ok-bg">
                    <div className="ok-desc-content">
                        <div className="ok-tab-flex">

                            <h4 className='ok-main-title'>
                                {
                                    siteSetting?.about_title_np || "अनलाइन क्यालेन्डर"
                                }
                            </h4>

                            <Share
                                endpoint="about"
                                title={`${siteSetting?.about_title_np || "अनलाइन क्यालेन्डर"} - Online Khabar Calendar`}
                                imageUrl={`${siteSetting?.about_thumbnail ? siteSetting?.about_thumbnail : siteSetting?.main_logo}`}
                            />
                        </div>

                        <div className="ok-content mt-2">
                            <p

                                dangerouslySetInnerHTML={{ __html: siteSetting.footer_text_full_np }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default About;