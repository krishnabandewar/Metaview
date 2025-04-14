import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import RewardToken from '../contracts/RewardToken.json';
import contractAddresses from '../contracts/contractAddresses';

const UserDashboard = ({ userAddress, watchTime }) => {
    const [tokenBalance, setTokenBalance] = useState('0');
    const [rewardHistory, setRewardHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [totalEarned, setTotalEarned] = useState('0');
    const [activeTab, setActiveTab] = useState('overview');

    // Fetch user's token balance and reward history
    useEffect(() => {
        const fetchUserData = async () => {
            if (!userAddress) return;
            
            try {
                setIsLoading(true);
                
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const rewardToken = new ethers.Contract(
                    contractAddresses.rewardToken,
                    RewardToken.abi,
                    provider
                );
                
                // Get token balance
                const balance = await rewardToken.balanceOf(userAddress);
                setTokenBalance(ethers.utils.formatEther(balance));
                
                // Get reward history from events (last 20 events)
                const filter = rewardToken.filters.Transfer(null, userAddress);
                const events = await rewardToken.queryFilter(filter, -10000, 'latest');
                
                // Format and sort events
                const formattedEvents = await Promise.all(events.map(async (event) => {
                    const block = await provider.getBlock(event.blockNumber);
                    return {
                        txHash: event.transactionHash,
                        amount: ethers.utils.formatEther(event.args.value),
                        timestamp: new Date(block.timestamp * 1000),
                        blockNumber: event.blockNumber
                    };
                }));
                
                // Sort by most recent first
                const sortedEvents = formattedEvents.sort((a, b) => b.blockNumber - a.blockNumber);
                setRewardHistory(sortedEvents);
                
                // Calculate total earned
                const total = formattedEvents.reduce((acc, event) => {
                    return acc + parseFloat(event.amount);
                }, 0);
                setTotalEarned(total.toFixed(2));
                
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchUserData();
    }, [userAddress]);
    
    // Format date for display
    const formatDate = (date) => {
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    
    // Truncate transaction hash
    const truncateHash = (hash) => {
        return `${hash.substring(0, 6)}...${hash.substring(hash.length - 4)}`;
    };
    
    // Format account address
    const formatAddress = (address) => {
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    };

    return (
        <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 5px 20px rgba(0,0,0,0.05)',
            overflow: 'hidden'
        }}>
            <div style={{
                backgroundColor: '#000000',
                background: 'linear-gradient(135deg, #000000 0%, #2d2d2d 100%)',
                padding: '30px',
                color: '#ffffff',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                    backgroundImage: 'radial-gradient(circle at 20% 150%, rgba(76, 175, 80, 0.15) 0%, rgba(0, 0, 0, 0) 50%)',
                    zIndex: 0
                }}></div>
                
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <h2 style={{ 
                        margin: '0 0 8px 0', 
                        fontSize: '2rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                    }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"></path>
                            <path d="M4 6v12c0 1.1.9 2 2 2h14v-4"></path>
                            <path d="M18 12a2 2 0 0 0 0 4h2v-4h-2z"></path>
                        </svg>
                        Your Rewards Dashboard
                    </h2>
                    
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px', 
                        opacity: 0.8,
                        fontSize: '0.95rem',
                        marginTop: '16px'
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            padding: '8px 16px',
                            borderRadius: '50px'
                        }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                            </svg>
                            {userAddress ? formatAddress(userAddress) : 'Wallet not connected'}
                        </div>
                        
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            padding: '8px 16px',
                            borderRadius: '50px'
                        }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                            {Math.floor(watchTime / 60)} minutes {watchTime % 60} seconds
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Tab Navigation */}
            <div style={{
                display: 'flex',
                borderBottom: '1px solid #eaeaea',
                backgroundColor: '#ffffff'
            }}>
                <button 
                    onClick={() => setActiveTab('overview')}
                    style={{
                        padding: '16px 24px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        borderBottom: activeTab === 'overview' ? '3px solid #4CAF50' : '3px solid transparent',
                        cursor: 'pointer',
                        fontWeight: activeTab === 'overview' ? '600' : '500',
                        fontSize: '1rem',
                        color: '#000000',
                        transition: 'all 0.2s ease'
                    }}
                >
                    Overview
                </button>
                <button 
                    onClick={() => setActiveTab('history')}
                    style={{
                        padding: '16px 24px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        borderBottom: activeTab === 'history' ? '3px solid #4CAF50' : '3px solid transparent',
                        cursor: 'pointer',
                        fontWeight: activeTab === 'history' ? '600' : '500',
                        fontSize: '1rem',
                        color: '#000000',
                        transition: 'all 0.2s ease'
                    }}
                >
                    Reward History
                </button>
            </div>
            
            {/* Tab Content */}
            <div style={{ padding: '30px' }}>
                {isLoading ? (
                    <div style={{ 
                        textAlign: 'center', 
                        padding: '60px 40px',
                        color: '#000000'
                    }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            border: '3px solid #f3f3f3',
                            borderTop: '3px solid #4CAF50',
                            borderRadius: '50%',
                            margin: '0 auto 20px',
                            animation: 'spin 1s linear infinite'
                        }}></div>
                        <p style={{ fontSize: '1.1rem', fontWeight: '500' }}>Loading your rewards data...</p>
                        <style>{`
                            @keyframes spin {
                                0% { transform: rotate(0deg); }
                                100% { transform: rotate(360deg); }
                            }
                        `}</style>
                    </div>
                ) : (
                    <>
                        {activeTab === 'overview' && (
                            <div>
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(3, 1fr)',
                                    gap: '24px',
                                    marginBottom: '40px'
                                }}>
                                    <div style={{
                                        padding: '24px',
                                        backgroundColor: '#ffffff',
                                        borderRadius: '12px',
                                        border: '1px solid #eaeaea',
                                        boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}>
                                        <div style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            height: '4px',
                                            background: 'linear-gradient(90deg, #4CAF50, #81c784)'
                                        }}></div>
                                        
                                        <div style={{ 
                                            fontSize: '1rem', 
                                            color: '#666666', 
                                            marginBottom: '12px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                        }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <circle cx="12" cy="12" r="10"></circle>
                                                <path d="M16 6v6a2 2 0 0 1-2 2H8"></path>
                                                <polyline points="9 10 8 12 10 12"></polyline>
                                            </svg>
                                            Current Balance
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{ fontSize: '2.2rem', fontWeight: '700', color: '#000000' }}>{tokenBalance}</span>
                                            <span style={{ 
                                                fontSize: '1.1rem', 
                                                fontWeight: '600', 
                                                color: '#4CAF50',
                                                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                                                padding: '4px 8px',
                                                borderRadius: '4px'
                                            }}>WRT</span>
                                        </div>
                                    </div>
                                    
                                    <div style={{
                                        padding: '24px',
                                        backgroundColor: '#ffffff',
                                        borderRadius: '12px',
                                        border: '1px solid #eaeaea',
                                        boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}>
                                        <div style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            height: '4px',
                                            background: 'linear-gradient(90deg, #4CAF50, #81c784)'
                                        }}></div>
                                        
                                        <div style={{ 
                                            fontSize: '1rem', 
                                            color: '#666666', 
                                            marginBottom: '12px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                        }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <line x1="12" y1="1" x2="12" y2="23"></line>
                                                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                                            </svg>
                                            Total Earned
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{ fontSize: '2.2rem', fontWeight: '700', color: '#000000' }}>{totalEarned}</span>
                                            <span style={{ 
                                                fontSize: '1.1rem', 
                                                fontWeight: '600', 
                                                color: '#4CAF50',
                                                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                                                padding: '4px 8px',
                                                borderRadius: '4px'
                                            }}>WRT</span>
                                        </div>
                                    </div>
                                    
                                    <div style={{
                                        padding: '24px',
                                        backgroundColor: '#ffffff',
                                        borderRadius: '12px',
                                        border: '1px solid #eaeaea',
                                        boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}>
                                        <div style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            height: '4px',
                                            background: 'linear-gradient(90deg, #4CAF50, #81c784)'
                                        }}></div>
                                        
                                        <div style={{ 
                                            fontSize: '1rem', 
                                            color: '#666666', 
                                            marginBottom: '12px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                        }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                                                <polyline points="17 6 23 6 23 12"></polyline>
                                            </svg>
                                            Reward Transactions
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{ fontSize: '2.2rem', fontWeight: '700', color: '#000000' }}>{rewardHistory.length}</span>
                                            <span style={{ 
                                                fontSize: '1.1rem', 
                                                fontWeight: '600', 
                                                color: '#4CAF50',
                                                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                                                padding: '4px 8px',
                                                borderRadius: '4px'
                                            }}>Claims</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <h3 style={{ margin: '0 0 20px 0', color: '#000000', fontSize: '1.3rem' }}>Recent Rewards</h3>
                                
                                <div style={{ marginTop: '16px' }}>
                                    {rewardHistory.length > 0 ? (
                                        <div style={{ 
                                            borderRadius: '8px',
                                            overflow: 'hidden',
                                            border: '1px solid #e0e0e0'
                                        }}>
                                            {rewardHistory.slice(0, 5).map((reward, index) => (
                                                <div key={index} style={{
                                                    padding: '16px',
                                                    borderBottom: index < rewardHistory.length - 1 ? '1px solid #e0e0e0' : 'none',
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    backgroundColor: index % 2 === 0 ? '#f8f8f8' : '#ffffff'
                                                }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <circle cx="12" cy="12" r="10"></circle>
                                                            <rect x="9" y="9" width="6" height="6"></rect>
                                                        </svg>
                                                        <div>
                                                            <div style={{ fontSize: '0.95rem', fontWeight: '500', color: '#000000' }}>
                                                                Received {reward.amount} WRT
                                                            </div>
                                                            <div style={{ fontSize: '0.8rem', color: '#666666', marginTop: '3px' }}>
                                                                Tx: {truncateHash(reward.txHash)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div style={{ textAlign: 'right' }}>
                                                        <div style={{ fontSize: '0.9rem', fontWeight: '500', color: '#000000' }}>
                                                            {formatDate(reward.timestamp)}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div style={{ 
                                            textAlign: 'center', 
                                            padding: '30px', 
                                            backgroundColor: '#f8f8f8',
                                            borderRadius: '8px',
                                            border: '1px solid #e0e0e0',
                                            color: '#666666'
                                        }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#666666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 16px' }}>
                                                <path d="M19.439 7.85c-.049.322.059.648.289.878l1.568 1.568c.47.47.706 1.087.706 1.704s-.235 1.233-.706 1.704l-1.611 1.611a.98.98 0 0 1-.837.276c-.47-.07-.802-.48-.968-.925a2.501 2.501 0 1 0-3.214 3.214c.446.166.855.497.925.968a.979.979 0 0 1-.276.837l-1.61 1.61a2.404 2.404 0 0 1-1.705.707 2.402 2.402 0 0 1-1.704-.706l-1.568-1.568a1.026 1.026 0 0 0-.877-.29c-.493.074-.84.504-1.02.968a2.5 2.5 0 1 1-3.237-3.237c.464-.18.894-.527.967-1.02a1.026 1.026 0 0 0-.289-.877l-1.568-1.568A2.402 2.402 0 0 1 1.998 10c0-.617.236-1.234.706-1.704L4.23 6.77c.24-.24.581-.353.917-.303.515.077.877.528 1.073 1.01a2.5 2.5 0 1 0 3.259-3.259c-.482-.196-.933-.558-1.01-1.073-.05-.336.062-.676.303-.917l1.525-1.525A2.402 2.402 0 0 1 12 0c.617 0 1.234.236 1.704.706l1.568 1.568c.23.23.556.338.877.29.493-.074.84-.504 1.02-.968a2.5 2.5 0 1 1 3.237 3.237c-.464.18-.894.527-.967 1.02z"></path>
                                            </svg>
                                            <p style={{ fontSize: '1.1rem', fontWeight: '500', marginBottom: '8px' }}>No rewards yet</p>
                                            <p>Watch videos to start earning WRT tokens!</p>
                                        </div>
                                    )}
                                    
                                    {rewardHistory.length > 5 && (
                                        <div style={{ textAlign: 'center', marginTop: '20px' }}>
                                            <button 
                                                onClick={() => setActiveTab('history')}
                                                style={{
                                                    backgroundColor: 'transparent',
                                                    border: '1px solid #000000',
                                                    borderRadius: '6px',
                                                    padding: '8px 16px',
                                                    color: '#000000',
                                                    cursor: 'pointer',
                                                    fontSize: '0.9rem',
                                                    fontWeight: '500'
                                                }}
                                            >
                                                View All Rewards
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                        
                        {activeTab === 'history' && (
                            <div>
                                <h3 style={{ margin: '0 0 20px 0', color: '#000000', fontSize: '1.3rem' }}>Reward History</h3>
                                
                                {rewardHistory.length > 0 ? (
                                    <div style={{ 
                                        borderRadius: '8px',
                                        overflow: 'hidden',
                                        border: '1px solid #e0e0e0'
                                    }}>
                                        <div style={{
                                            padding: '16px',
                                            backgroundColor: '#f2f2f2',
                                            borderBottom: '1px solid #e0e0e0',
                                            display: 'flex',
                                            fontWeight: '600',
                                            color: '#000000'
                                        }}>
                                            <div style={{ flex: '2' }}>Transaction</div>
                                            <div style={{ flex: '1', textAlign: 'center' }}>Amount</div>
                                            <div style={{ flex: '1', textAlign: 'right' }}>Time</div>
                                        </div>
                                        
                                        {rewardHistory.map((reward, index) => (
                                            <div key={index} style={{
                                                padding: '16px',
                                                borderBottom: index < rewardHistory.length - 1 ? '1px solid #e0e0e0' : 'none',
                                                display: 'flex',
                                                alignItems: 'center',
                                                backgroundColor: index % 2 === 0 ? '#f8f8f8' : '#ffffff'
                                            }}>
                                                <div style={{ flex: '2', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                                                    </svg>
                                                    <a 
                                                        href={`https://sepolia.etherscan.io/tx/${reward.txHash}`} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        style={{
                                                            color: '#000000',
                                                            textDecoration: 'none',
                                                            fontWeight: '500',
                                                            fontSize: '0.95rem'
                                                        }}
                                                    >
                                                        {truncateHash(reward.txHash)}
                                                    </a>
                                                </div>
                                                <div style={{ flex: '1', textAlign: 'center', fontWeight: '500', color: '#000000' }}>
                                                    {reward.amount} WRT
                                                </div>
                                                <div style={{ flex: '1', textAlign: 'right', fontSize: '0.9rem', color: '#666666' }}>
                                                    {formatDate(reward.timestamp)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div style={{ 
                                        textAlign: 'center', 
                                        padding: '40px', 
                                        backgroundColor: '#f8f8f8',
                                        borderRadius: '8px',
                                        border: '1px solid #e0e0e0',
                                        color: '#666666'
                                    }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#666666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 16px' }}>
                                            <circle cx="12" cy="12" r="10"></circle>
                                            <line x1="12" y1="8" x2="12" y2="12"></line>
                                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                        </svg>
                                        <p style={{ fontSize: '1.1rem', fontWeight: '500', marginBottom: '8px' }}>No reward history found</p>
                                        <p>Once you claim rewards, they'll appear here.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default UserDashboard; 