import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import TokenBalance from '../components/user/TokenBalance';
import VideoCard from '../components/video/VideoCard';
import { ethers } from 'ethers';
import RewardToken from '../contracts/RewardToken.json';
import contractAddresses from '../contracts/contractAddresses';

const Profile = () => {
    const { isDarkMode } = useTheme();
    const [account, setAccount] = useState('');
    const [balance, setBalance] = useState('0');
    const [watchHistory, setWatchHistory] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [activeTab, setActiveTab] = useState('watch-history');

    useEffect(() => {
        const loadAccount = async () => {
            if (window.ethereum) {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                setAccount(accounts[0]);
                loadBalance(accounts[0]);
            }
        };

        const loadBalance = async (address) => {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const rewardToken = new ethers.Contract(
                contractAddresses.rewardToken,
                RewardToken.abi,
                provider
            );
            const balance = await rewardToken.balanceOf(address);
            setBalance(balance);
        };

        loadAccount();
    }, []);

    // Mock data for watch history and favorites
    useEffect(() => {
        setWatchHistory([
            {
                id: 1,
                title: 'Introduction to Web3',
                thumbnail: '/thumbnails/web3-intro.jpg',
                duration: 1200,
                views: 1500,
                uploadDate: '2023-01-15',
                creator: {
                    name: 'Web3 Academy',
                    avatar: '/avatars/web3-academy.jpg'
                },
                rewardAmount: 1.5
            },
            // Add more mock videos
        ]);

        setFavorites([
            {
                id: 2,
                title: 'Smart Contract Development',
                thumbnail: '/thumbnails/smart-contract.jpg',
                duration: 1800,
                views: 2500,
                uploadDate: '2023-02-01',
                creator: {
                    name: 'Blockchain Dev',
                    avatar: '/avatars/blockchain-dev.jpg'
                },
                rewardAmount: 2.0
            },
            // Add more mock videos
        ]);
    }, []);

    return (
        <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '20px'
        }}>
            <div style={{
                display: 'flex',
                gap: '20px',
                marginBottom: '30px'
            }}>
                <div style={{
                    flex: '1',
                    backgroundColor: isDarkMode ? '#2a2a2a' : '#ffffff',
                    borderRadius: '12px',
                    padding: '20px',
                    boxShadow: isDarkMode ? '0 2px 4px rgba(0,0,0,0.2)' : '0 2px 4px rgba(0,0,0,0.03)',
                    border: `1px solid ${isDarkMode ? '#3a3a3a' : '#e0e0e0'}`
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '20px',
                        marginBottom: '20px'
                    }}>
                        <div style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            backgroundColor: isDarkMode ? '#4CAF50' : 'rgba(76, 175, 80, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={isDarkMode ? '#ffffff' : '#4CAF50'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                        </div>
                        <div>
                            <h2 style={{
                                fontSize: '1.5rem',
                                color: isDarkMode ? '#ffffff' : '#000000',
                                marginBottom: '4px'
                            }}>
                                User Profile
                            </h2>
                            <div style={{
                                fontSize: '0.9rem',
                                color: isDarkMode ? '#999999' : '#666666',
                                wordBreak: 'break-all'
                            }}>
                                {account}
                            </div>
                        </div>
                    </div>

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
                                Total Watch Time
                            </div>
                            <div style={{
                                fontSize: '1.5rem',
                                fontWeight: '600',
                                color: isDarkMode ? '#ffffff' : '#000000'
                            }}>
                                12 hours
                            </div>
                        </div>
                        <div>
                            <div style={{
                                fontSize: '0.9rem',
                                color: isDarkMode ? '#999999' : '#666666',
                                marginBottom: '4px'
                            }}>
                                Videos Watched
                            </div>
                            <div style={{
                                fontSize: '1.5rem',
                                fontWeight: '600',
                                color: isDarkMode ? '#ffffff' : '#000000'
                            }}>
                                24
                            </div>
                        </div>
                        <div>
                            <div style={{
                                fontSize: '0.9rem',
                                color: isDarkMode ? '#999999' : '#666666',
                                marginBottom: '4px'
                            }}>
                                Rewards Earned
                            </div>
                            <div style={{
                                fontSize: '1.5rem',
                                fontWeight: '600',
                                color: isDarkMode ? '#ffffff' : '#000000'
                            }}>
                                36 WRT
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ width: '400px' }}>
                    <TokenBalance balance={balance} />
                </div>
            </div>

            <div style={{
                backgroundColor: isDarkMode ? '#2a2a2a' : '#ffffff',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: isDarkMode ? '0 2px 4px rgba(0,0,0,0.2)' : '0 2px 4px rgba(0,0,0,0.03)',
                border: `1px solid ${isDarkMode ? '#3a3a3a' : '#e0e0e0'}`
            }}>
                <div style={{
                    display: 'flex',
                    gap: '20px',
                    marginBottom: '20px',
                    borderBottom: `1px solid ${isDarkMode ? '#3a3a3a' : '#e0e0e0'}`,
                    paddingBottom: '10px'
                }}>
                    <button
                        onClick={() => setActiveTab('watch-history')}
                        style={{
                            padding: '10px 20px',
                            borderRadius: '6px',
                            border: 'none',
                            backgroundColor: activeTab === 'watch-history' 
                                ? (isDarkMode ? '#4CAF50' : 'rgba(76, 175, 80, 0.1)')
                                : 'transparent',
                            color: activeTab === 'watch-history'
                                ? (isDarkMode ? '#ffffff' : '#4CAF50')
                                : (isDarkMode ? '#999999' : '#666666'),
                            cursor: 'pointer',
                            fontSize: '1rem',
                            fontWeight: '500'
                        }}
                    >
                        Watch History
                    </button>
                    <button
                        onClick={() => setActiveTab('favorites')}
                        style={{
                            padding: '10px 20px',
                            borderRadius: '6px',
                            border: 'none',
                            backgroundColor: activeTab === 'favorites'
                                ? (isDarkMode ? '#4CAF50' : 'rgba(76, 175, 80, 0.1)')
                                : 'transparent',
                            color: activeTab === 'favorites'
                                ? (isDarkMode ? '#ffffff' : '#4CAF50')
                                : (isDarkMode ? '#999999' : '#666666'),
                            cursor: 'pointer',
                            fontSize: '1rem',
                            fontWeight: '500'
                        }}
                    >
                        Favorites
                    </button>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '20px'
                }}>
                    {(activeTab === 'watch-history' ? watchHistory : favorites).map(video => (
                        <VideoCard
                            key={video.id}
                            video={video}
                            onClick={() => {
                                // Handle video click
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Profile; 