"use client"

import Link from 'next/link';
import React, { useEffect, useState } from 'react';

import BullionGraph from './BullionGraph';
import TodayBullion from './ForexCalculator';


const ForexSidebar = () => {

    return (
        <>
            <TodayBullion isBtn="false" />

            <BullionGraph />

        </>
    );
};

export default ForexSidebar