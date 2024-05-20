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
    const { siteSetting, bullionData, forexData, loading } = useRoot();

    const forex = forexData && forexData.length > 0
    const forexGraph = forex && forexData.slice(0, 7)


    const forexGraphData = forex && forexGraph.map((item) => item.rates[1].buy)
    const bullionDate = forex && forexGraph.map((item) => item.date)

    console.log("bulkion", forexGraphData)
    // Configuring the Line chart data
    const chartData = {
        labels: bullionDate,
        datasets: [
            {
                label: siteSetting?.hallmark_title_np || 'छापावाल',
                data: forexGraphData,
                backgroundColor: 'rgba(29, 99, 237, 0.2)', // Golden color with alpha for background
                borderColor: 'rgba(29, 99, 237, 1)',
                borderWidth: 1,
            },

        ],
    };
    let delayed;

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
                                    labels: bullionDate,
                                },
                                y: {
                                    title: {
                                        display: true,
                                        text: 'Tola',
                                    },
                                },
                            },
                            interaction: {
                                intersect: false,
                                mode: 'index',
                            },

                            animation: {
                                onComplete: () => {
                                    delayed = true;
                                },
                                delay: (context) => {
                                    let delay = 0;
                                    if (context.type === 'data' && context.mode === 'default' && !delayed) {
                                        delay = context.dataIndex * 300 + context.datasetIndex * 100;
                                    }
                                    return delay;
                                },
                            },
                        }} />
                </div>
            </div>
        </>
    );
};

export default BullionGraph