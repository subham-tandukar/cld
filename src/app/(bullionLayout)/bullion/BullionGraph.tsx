"use client"

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useRoot } from '../../../context';
import { arabicToDevanagari, formattedEngDate, formattedNepDate } from '../../../hooks';
import Loading from '../../loading';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const BullionGraph = () => {
    const { siteSetting, bullionData, loading } = useRoot();

    const bullion = bullionData && bullionData.length > 0
    const bullionGraph = bullion && bullionData.slice(0, 7)


    const hallmarkData = bullion && bullionGraph.map((item) => item.gold_hallmark_tola)
    const tejabiData = bullion && bullionGraph.map((item) => item.gold_tejabi_tola)
    const silverData = bullion && bullionGraph.map((item) => item.silver_tola)
    const bullionDate = bullion && bullionGraph.map((item) => item.date)

    const formattedBullionData = bullionDate && bullionDate.length > 0 && bullionDate.map((item) => item.split("-").slice(1, 3).join("-"))
    console.log("bulkion", formattedBullionData)
    // Configuring the Line chart data
    const chartData = {
        labels: formattedBullionData,
        datasets: [
            {
                label: siteSetting?.hallmark_title_np || 'छापावाल',
                data: hallmarkData,
                backgroundColor: 'rgba(255, 215, 0, 0.2)', // Golden color with alpha for background
                borderColor: 'rgba(255, 215, 0, 1)',
                borderWidth: 1,
            },
            {
                label: siteSetting?.tejabi_title_np || 'तेजाबी',
                data: tejabiData,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
            },
            {
                label: siteSetting?.silver_title_np || 'चाँदी',
                data: silverData,
                backgroundColor: 'rgba(192, 192, 192, 0.2)', // Silver color with alpha for background
                borderColor: 'rgba(192, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };


    return (
        <>


            <div className="card-all-festivals">
                <h3>
                    {
                        siteSetting?.gold_silver_graph_title_np
                        ||
                        "सुन-चाँदीको ट्रेन्ड"
                    }

                </h3>

                <div className="ok-graph">
                    <Line height={270} width={270} data={chartData}
                        options={{
                            maintainAspectRatio: false,
                            scales: {
                                x: {
                                    title: {
                                        display: true,
                                        text: 'Date',
                                    },
                                    type: 'category',
                                    labels: formattedBullionData,
                                },
                                y: {
                                    title: {
                                        display: true,
                                        text: 'Tola',
                                    },
                                },
                            },
                        }} />
                </div>
            </div>
        </>
    );
};

export default BullionGraph