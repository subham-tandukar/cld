"use client"
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useRoot } from '../../../../context';
import { getRemainingDays, nepaliDaysRemaining } from '../../../../hooks';
import Popup from '../../../(root)/event/Popup';
import Image from 'next/image';
import { MdChevronRight } from 'react-icons/md';

interface EventData {
  id: number;
  event_category: string;
  event_title_np: string;
  is_public_holiday: boolean;
  date: {
    bs_concat_date_en: string;
    ad_concat_date_en: string;
    bs_date_np: string;
    day_np: string;
    bs_month_np: string;
    bs_year_np: string;
    ad_month_en: string;
    ad_date_en: string;
    ad_year_en: string;
  };
}

const Holiday = ({ holidaydata }) => {
  const { animation, setAnimation, setClickedDate, dropdownitem } = useRoot();



  const [popup, setPopup] = useState(false)
  const handleClose = () => {
    setPopup(false)
  }
  const [eventInfo, setEventInfo] = useState([])
  const [eventData, setEventData] = useState([])
  const handleClick = (props) => {
    setEventData(props.date)
    setEventInfo(props)
    setPopup(!popup)
  }

  let newData: EventData[] = [];

  holidaydata.forEach(event => {
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
  const dataToShow = newData.slice(0, 5);
  return (
    <>
      <div className="ok-block ok-block-leftbar-events">
        <div className="ok-block-heading">
          <h3>आगामी बिदाहरु</h3>
          <div className="ok-block-heading-right-elem">
            <Link href="/upcoming-holiday" className="view-all-btn">
              <MdChevronRight width={30} />
            </Link>
          </div>
        </div>
        <div className=''>
          {dataToShow && dataToShow.length > 0 ? (
            dataToShow.map((holiday) => {
              const remainingDays = getRemainingDays(String(holiday?.date?.ad_concat_date_en))
              return (
                <div key={holiday.id} className={`card-day-event ${holiday.is_public_holiday === true ? 'is-holiday' : ''}`}>
                  <div className="event-day-date">
                    {holiday.date.bs_date_np}
                    <span>{holiday.date.day_np.replace("वार", "")}</span>
                  </div>
                  <div className='flex gap-1'>
                    <div className="event-day-info">
                      <p
                        className='cursor'
                        onClick={() => handleClick(holiday)}
                      >
                        {holiday.event_title_np}
                      </p>
                      <div className='ok-date-flex isholiday'>
                        <span>
                          {holiday.date.bs_month_np}{" "} {holiday.date.bs_date_np}, {" "}
                          {holiday.date.bs_year_np}

                        </span>
                        -
                        <span className='eng-font'>
                          {holiday.date.ad_month_en.slice(0, 3)}
                          {" "}
                          {holiday.date.ad_date_en},{" "}
                          {holiday.date.ad_year_en}
                        </span>
                      </div>
                    </div>
                    <div className="event-day-reminder">{nepaliDaysRemaining(remainingDays)}</div>
                  </div>
                </div>
              )
            })
          ) : (
            <div>कुनै आगामी बिदाहरू छैनन्</div>
          )}

        </div>

      </div>

      {
        popup && <Popup title="आगामी बिदाहरु" onClose={handleClose} data={eventInfo} eventData={eventData} />
      }
    </>
  );
};

export default Holiday;