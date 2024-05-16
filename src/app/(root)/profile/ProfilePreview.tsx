
import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';

const ProfilePreview = ({ onClose, image }) => {
    return (
        <>
            <div className="custom__popup active popup__big image__preview">
                <div className="overlay" onClick={onClose}></div>
                <div className="custom__popup__model">

                    <div className="">

                        <div onClick={onClose} className="close__popup">
                        <FaTimes />
                        </div>
                        <img src={image} alt="User Profile" />
                    </div>


                </div>
            </div>
        </>
    );
};

export default ProfilePreview;