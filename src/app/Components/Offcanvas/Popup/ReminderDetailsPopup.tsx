"use client"
import Image from 'next/image';
import React, { useState } from 'react'
import { FaTimes } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';

const ReminderDetailsPopup = ({ onClose }) => {

  return (
    <>
      <div className="custom__popup reminderdetail__popup active popup__small">
        <div className="overlay" onClick={onClose}></div>
        <div className="custom__popup__model">
          <div className="custom__popup__head">
            <div>
              <h2>रिमाइन्डर</h2>
            </div>
            <div className="reminder__popup__close close__popup" onClick={onClose}>
            <FaTimes />
            </div>
          </div>
          <div className="custom__popup__content">

            <div className="card-day-event">
              <div className="event-day-date">
                ६
                <span>सोम</span>
              </div>
              <div className="event-day-info">
                <a href="#">गोपालदाई संग मिटिङ</a>
                <span>साउन १५, २०८० - 26 Jul, 2023</span>
              </div>
              <div className="right-items">
                <div className="event-day-reminder">६ दिन बाँकी</div>
              </div>
            </div>

          </div>
        </div>
      </div>

    </>
  )
}

export default ReminderDetailsPopup;