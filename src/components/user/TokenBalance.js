import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { ethers } from 'ethers';
import RewardToken from '../../contracts/RewardToken.json';
import contractAddresses from '../../contracts/contractAddresses';

const TokenBalance = ({ balance, onTransfer }) => {
    const { isDarkMode } = useTheme();
    const [isTransferring, setIsTransferring] = useState(false);
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');
    const [error, setError] = useState('');

    const handleTransfer = async () => {
        if (!window.ethereum) {
            setError('Please install MetaMask to transfer tokens');
            return;
        }

        if (!recipient || !amount) {
            setError('Please fill in all fields');
            return;
        }

        try {
            setIsTransferring(true);
            setError('');

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const rewardToken = new ethers.Contract(
                contractAddresses.rewardToken,
                RewardToken.abi,
                signer
            );

            const amountInWei = ethers.utils.parseEther(amount);
            const tx = await rewardToken.transfer(recipient, amountInWei);
            
            await tx.wait();
            onTransfer && onTransfer();
            
            setRecipient('');
            setAmount('');
        } catch (error) {
            setError(error.message);
        } finally {
            setIsTransferring(false);
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
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '20px'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                }}>
                    <div style={{
                        width: '48px',
                        height: '48px',
                        backgroundColor: isDarkMode ? '#4CAF50' : 'rgba(76, 175, 80, 0.1)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={isDarkMode ? '#ffffff' : '#4CAF50'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6"></path>
                            <polyline points="4 8 12 2 20 8"></polyline>
                        </svg>
                    </div>
                    <div>
                        <div style={{
                            fontSize: '0.9rem',
                            color: isDarkMode ? '#999999' : '#666666',
                            marginBottom: '4px'
                        }}>
                            Token Balance
                        </div>
                        <div style={{
                            fontSize: '1.5rem',
                            fontWeight: '600',
                            color: isDarkMode ? '#ffffff' : '#000000'
                        }}>
                            {ethers.utils.formatEther(balance)} WRT
                        </div>
                    </div>
                </div>
            </div>

            <div style={{
                marginBottom: '20px'
            }}>
                <h3 style={{
                    fontSize: '1.1rem',
                    color: isDarkMode ? '#ffffff' : '#000000',
                    marginBottom: '12px'
                }}>
                    Transfer Tokens
                </h3>
                
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                }}>
                    <input
                        type="text"
                        placeholder="Recipient Address"
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        style={{
                            padding: '12px',
                            borderRadius: '6px',
                            border: `1px solid ${isDarkMode ? '#3a3a3a' : '#e0e0e0'}`,
                            backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
                            color: isDarkMode ? '#ffffff' : '#000000',
                            fontSize: '1rem'
                        }}
                    />
                    
                    <input
                        type="number"
                        placeholder="Amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        style={{
                            padding: '12px',
                            borderRadius: '6px',
                            border: `1px solid ${isDarkMode ? '#3a3a3a' : '#e0e0e0'}`,
                            backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
                            color: isDarkMode ? '#ffffff' : '#000000',
                            fontSize: '1rem'
                        }}
                    />
                    
                    {error && (
                        <div style={{
                            color: '#ff4444',
                            fontSize: '0.9rem',
                            marginTop: '8px'
                        }}>
                            {error}
                        </div>
                    )}
                    
                    <button
                        onClick={handleTransfer}
                        disabled={isTransferring}
                        style={{
                            backgroundColor: isDarkMode ? '#4CAF50' : 'rgba(76, 175, 80, 0.1)',
                            color: isDarkMode ? '#ffffff' : '#4CAF50',
                            padding: '12px 20px',
                            borderRadius: '6px',
                            border: 'none',
                            cursor: isTransferring ? 'not-allowed' : 'pointer',
                            fontSize: '1rem',
                            fontWeight: '500',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            transition: 'all 0.2s ease',
                            opacity: isTransferring ? 0.7 : 1
                        }}
                    >
                        {isTransferring ? (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <path d="M12 6v6l4 2"></path>
                                </svg>
                                Transferring...
                            </>
                        ) : (
                            'Transfer Tokens'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TokenBalance; 