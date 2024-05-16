"use client"
import React, { useEffect, useState } from 'react'
import Select from 'react-select';
import { limitedYearList, yearList } from '../../../hooks';
const SelectYear = ({ currentdate, selectedYear, setSelectedYear }) => {
    const yearData: number[] = yearList();
    const limitedYearData: number[] = limitedYearList();
    const [inputValue, setInputValue] = useState<string>('');
    const dropDownYear = yearData
        .filter((item) => item.toString().startsWith(inputValue)) // Filter years based on the input text
        .map((item) => ({
            value: item,
            label: item.toString(),
        }));

    const limitedDropDownYear = limitedYearData
        .filter((item) => item.toString().startsWith(inputValue)) // Filter years based on the input text
        .map((item) => ({
            value: item,
            label: item.toString(),
        }));
    useEffect(() => {
        if (currentdate) {
            setSelectedYear(Number(currentdate?.bs_year_en))
        }
    }, [currentdate])


    const customStyles = {
        menu: (provided, state) => ({
            ...provided,
            background: "#f9f9fd",
            border: "solid 1px #a0a0a0a6",
            boxShadow: "none",
            lineHeight: "20px",
            fontSize: "14px",
            top: "80%",
            width: "160px"
        }),
    }
    return (
        <div
            className="select__box select__yr-month p-0"
        >

            <Select
                placeholder="वर्ष रोज्नुहोस्"
                isSearchable
                styles={customStyles}
                noOptionsMessage={() => "तपाइले खोज्नुभएको वर्ष यहाँ लेख्नुहोस्"}
                options={inputValue ? dropDownYear : limitedDropDownYear} // Conditionally render the dropdown
                onInputChange={(newValue) => setInputValue(newValue)} // Track user input
                onChange={(selectedOption) => {

                    setSelectedYear(selectedOption && selectedOption.value)

                }
                }
                value={dropDownYear.find((option) => option.value === selectedYear)}
            />
        </div>
    )
}

export default SelectYear