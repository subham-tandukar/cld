
"use client"

import React, { useEffect, useState } from 'react';
import NotFound from '../../../not-found';
import BS from './NepaliCalendar';
import { useSession } from 'next-auth/react';
import { useRoot } from '../../../../context';
import useSWR from 'swr';
import Skeleton from 'react-loading-skeleton';

interface CalendarData {
  currentMonthsAd: any;
  success: boolean;
  data: any;
}

interface Props {
  month: any;
  year: any;
  currentdate: string;
  currenttime: number;
  isParam: string;
}

const NepaliCalendarComponent: React.FC<Props> = ({
  month,
  year,
  currentdate,
  currenttime,
  isParam
}) => {
  const { data: session } = useSession();
  const token = session?.token ? session?.token : session?.user?.data?.token;
  const { eventCreated, baseUrl } = useRoot();
  const [currMonth, setcurrMonth] = useState("")
  const [loading, setLoading] = useState(true);

  const fetcher = async (url: string) => {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch');
    }

    return response.json();
  };

  const getPreviousMonth = (year: number, month: number) => {
    let previousMonth = month - 1;
    let previousYear = year;
    if (previousMonth < 1) {
      previousMonth = 12;
      previousYear--;
    }
    return { previousYear, previousMonth };
  };

  const getNextMonth = (year: number, month: any) => {
    let nextMonth = parseInt(month) + 1;
    let nextYear = year;
    if (nextMonth > 12) {
      nextMonth = 1;
      nextYear++;
    }
    return { nextYear, nextMonth };
  };

  const { previousYear, previousMonth } = getPreviousMonth(year, month);
  const { nextYear, nextMonth } = getNextMonth(year, month);


  const { data: calendarData, error: calendarError } = useSWR<CalendarData>(
    `${baseUrl}/api/v1/calendar/month/bs/${year}/${month}`,
    fetcher
  );

  const { data: previousData } = useSWR<CalendarData>(
    `${baseUrl}/api/v1/calendar/month/bs/${previousYear}/${previousMonth}`,
    fetcher
  );

  const { data: nextMonthData } = useSWR<CalendarData>(
    `${baseUrl}/api/v1/calendar/month/bs/${nextYear}/${nextMonth}`,
    fetcher
  );


  if (calendarError) {
    return <div>Error fetching next data. Please try again later.</div>;
  }

  if (month > 12 || month < 1) {
    return <NotFound />;
  }

  useEffect(() => {
    if (!calendarData || !previousData || !nextMonthData) {
      setLoading(true)
    } else {
      setLoading(false)
    }
  }, [calendarData, previousData, nextMonthData])

  return (
    <BS
      currMonth={calendarData?.currentMonthsAd}
      data={calendarData?.data || []}
      currentdate={currentdate}
      currenttime={currenttime}
      previousdata={previousData?.data || []}
      Nextmonthdata={nextMonthData?.data || []}
      loading={loading}
      isParam={isParam}
    />
  );
};

export default NepaliCalendarComponent;
