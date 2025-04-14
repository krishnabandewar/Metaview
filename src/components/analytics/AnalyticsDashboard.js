import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const AnalyticsDashboard = ({ data }) => {
    const { isDarkMode } = useTheme();

    const watchTimeData = {
        labels: data.watchTime.map(item => item.date),
        datasets: [
            {
                label: 'Watch Time (minutes)',
                data: data.watchTime.map(item => item.minutes),
                borderColor: isDarkMode ? '#4CAF50' : 'rgba(76, 175, 80, 0.8)',
                backgroundColor: isDarkMode ? 'rgba(76, 175, 80, 0.1)' : 'rgba(76, 175, 80, 0.1)',
                tension: 0.4
            }
        ]
    };

    const earningsData = {
        labels: data.earnings.map(item => item.date),
        datasets: [
            {
                label: 'Earnings (WRT)',
                data: data.earnings.map(item => item.amount),
                borderColor: isDarkMode ? '#4CAF50' : 'rgba(76, 175, 80, 0.8)',
                backgroundColor: isDarkMode ? 'rgba(76, 175, 80, 0.1)' : 'rgba(76, 175, 80, 0.1)',
                tension: 0.4
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: isDarkMode ? '#ffffff' : '#666666'
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                },
                ticks: {
                    color: isDarkMode ? '#ffffff' : '#666666'
                }
            },
            x: {
                grid: {
                    color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                },
                ticks: {
                    color: isDarkMode ? '#ffffff' : '#666666'
                }
            }
        }
    };

    return (
        <div style={{
            backgroundColor: isDarkMode ? '#2a2a2a' : '#ffffff',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: isDarkMode ? '0 2px 4px rgba(0,0,0,0.2)' : '0 2px 4px rgba(0,0,0,0.03)',
            border: `1px solid ${isDarkMode ? '#3a3a3a' : '#e0e0e0'}`
        }}>
            <h2 style={{
                fontSize: '1.5rem',
                color: isDarkMode ? '#ffffff' : '#000000',
                marginBottom: '20px'
            }}>
                Analytics Dashboard
            </h2>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '20px',
                marginBottom: '20px'
            }}>
                <div style={{
                    backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5',
                    padding: '20px',
                    borderRadius: '8px'
                }}>
                    <h3 style={{
                        fontSize: '1.1rem',
                        color: isDarkMode ? '#ffffff' : '#000000',
                        marginBottom: '10px'
                    }}>
                        Total Watch Time
                    </h3>
                    <div style={{
                        fontSize: '2rem',
                        fontWeight: '600',
                        color: isDarkMode ? '#4CAF50' : '#4CAF50'
                    }}>
                        {data.totalWatchTime} minutes
                    </div>
                </div>

                <div style={{
                    backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5',
                    padding: '20px',
                    borderRadius: '8px'
                }}>
                    <h3 style={{
                        fontSize: '1.1rem',
                        color: isDarkMode ? '#ffffff' : '#000000',
                        marginBottom: '10px'
                    }}>
                        Total Earnings
                    </h3>
                    <div style={{
                        fontSize: '2rem',
                        fontWeight: '600',
                        color: isDarkMode ? '#4CAF50' : '#4CAF50'
                    }}>
                        {data.totalEarnings} WRT
                    </div>
                </div>

                <div style={{
                    backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5',
                    padding: '20px',
                    borderRadius: '8px'
                }}>
                    <h3 style={{
                        fontSize: '1.1rem',
                        color: isDarkMode ? '#ffffff' : '#000000',
                        marginBottom: '10px'
                    }}>
                        Average Watch Time
                    </h3>
                    <div style={{
                        fontSize: '2rem',
                        fontWeight: '600',
                        color: isDarkMode ? '#4CAF50' : '#4CAF50'
                    }}>
                        {data.averageWatchTime} minutes
                    </div>
                </div>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                gap: '20px'
            }}>
                <div style={{
                    backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5',
                    padding: '20px',
                    borderRadius: '8px'
                }}>
                    <h3 style={{
                        fontSize: '1.1rem',
                        color: isDarkMode ? '#ffffff' : '#000000',
                        marginBottom: '20px'
                    }}>
                        Watch Time Trend
                    </h3>
                    <Line data={watchTimeData} options={chartOptions} />
                </div>

                <div style={{
                    backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5',
                    padding: '20px',
                    borderRadius: '8px'
                }}>
                    <h3 style={{
                        fontSize: '1.1rem',
                        color: isDarkMode ? '#ffffff' : '#000000',
                        marginBottom: '20px'
                    }}>
                        Earnings Trend
                    </h3>
                    <Line data={earningsData} options={chartOptions} />
                </div>
            </div>

            <div style={{
                marginTop: '20px',
                backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5',
                padding: '20px',
                borderRadius: '8px'
            }}>
                <h3 style={{
                    fontSize: '1.1rem',
                    color: isDarkMode ? '#ffffff' : '#000000',
                    marginBottom: '20px'
                }}>
                    Engagement Metrics
                </h3>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '20px'
                }}>
                    <div>
                        <div style={{
                            fontSize: '0.9rem',
                            color: isDarkMode ? '#999999' : '#666666',
                            marginBottom: '4px'
                        }}>
                            Likes
                        </div>
                        <div style={{
                            fontSize: '1.5rem',
                            fontWeight: '600',
                            color: isDarkMode ? '#ffffff' : '#000000'
                        }}>
                            {data.engagement.likes}
                        </div>
                    </div>
                    <div>
                        <div style={{
                            fontSize: '0.9rem',
                            color: isDarkMode ? '#999999' : '#666666',
                            marginBottom: '4px'
                        }}>
                            Comments
                        </div>
                        <div style={{
                            fontSize: '1.5rem',
                            fontWeight: '600',
                            color: isDarkMode ? '#ffffff' : '#000000'
                        }}>
                            {data.engagement.comments}
                        </div>
                    </div>
                    <div>
                        <div style={{
                            fontSize: '0.9rem',
                            color: isDarkMode ? '#999999' : '#666666',
                            marginBottom: '4px'
                        }}>
                            Shares
                        </div>
                        <div style={{
                            fontSize: '1.5rem',
                            fontWeight: '600',
                            color: isDarkMode ? '#ffffff' : '#000000'
                        }}>
                            {data.engagement.shares}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard; 