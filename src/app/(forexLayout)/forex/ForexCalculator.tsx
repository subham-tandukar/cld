"use client"

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useRoot } from '../../../context';
import { arabicToDevanagari, formattedEngDate, formattedNepDate } from '../../../hooks';
import Loading from '../../loading';

const ForexCalculator = ({ isBtn }) => {
    const { siteSetting, forexData, loading } = useRoot();




    const [forex, setForex] = useState<any[]>([]);
    const [selectedData, setSelectedData] = useState<any[]>([]);
    const [convertedData, setConvertedData] = useState<any[]>([]);

    const [selectedAmount, setSelectedAmount] = useState<any>("1");
    const [convertedAmount, setConvertedAmount] = useState<any>("");
    const [fromCurrency, setFromCurrency] = useState<any>("USD");
    const [toCurrency, setToCurrency] = useState<any>("INR");
    useEffect(() => {
        if (forexData) {
            const data = forexData?.rates || []
            setForex(data)

            const selected = data.filter((item) => {
                return item?.currency?.iso3 === "USD"
            })
            setSelectedData(selected)

            // const converted = data.filter((item) => {
            //     return item?.currency?.iso3 === "USD"
            // })
            // setConvertedData(converted)
        }
    }, [forexData])

    console.log('selectedData', selectedData);

    const convertCurrency = (amount, fromCurrency, toCurrency) => {
        if (forex) {

            const fromRate = forex.filter(rate => rate?.currency.iso3 === fromCurrency.toString());
            const toRate = forex.filter(rate => rate?.currency.iso3 === toCurrency.toString());

            const formData = fromRate.length > 0 && fromRate[0] || []
            const toData = toRate.length > 0 && toRate[0] || []
            console.log('formData', formData);
            console.log('toData', toData);
            console.log('amount', amount);
            let convertedAmount;
            if (formData.length > 0 && toData.length > 0) {

                convertedAmount = (amount.toString() / formData?.currency?.unit) * formData?.sell * (toData?.currency?.unit / toData?.sell);
            }
            console.log('convertedAmount',convertedAmount);
            // Calculate conversion
            return convertedAmount; // Return rounded to 2 decimal places
        }
    };

    useEffect(() => {
        const data = convertCurrency(selectedAmount, fromCurrency, toCurrency)
        setConvertedAmount(data)
    }, [forex])


    const handleFromChange = (e) => {
        setFromCurrency(e.target.value)
    }
    // const convertedAmount = convertCurrency(amount, fromCurrency, toCurrency);
    return (
        <>
            <div className="card-all-festivals">
                <h3>
                    {
                        siteSetting?.today_gold_silver_title_np ||
                        "मुद्रा रूपान्तरण"
                    }

                </h3>
                <div>
                    {/* <p>{amount} {fromCurrency} is approximately {convertedAmount} {toCurrency}</p> */}
                </div>
                <div className="forex-calculator">
                    <div className="amount-field forex-field">
                        <div>
                            <input type="text" value={selectedAmount} />
                        </div>
                        <div>
                            <select
                                onChange={handleFromChange}
                                value={fromCurrency}
                            >
                                {forex && forex.map((item) => (
                                    <option value={item?.currency?.iso3}>
                                        {item?.currency?.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="converted-field forex-field">
                        <div>
                            <input type="text" value={convertedAmount} />
                        </div>
                        <div>
                            <select
                                // onChange={handleFromChange}
                                value={toCurrency}
                            >
                                {forex && forex.map((item) => (
                                    <option value={item?.currency?.iso3}>
                                        {item?.currency?.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>


            </div>



        </>
    );
};

export default ForexCalculator