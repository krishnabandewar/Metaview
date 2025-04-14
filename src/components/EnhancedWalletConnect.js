import React, { useState } from 'react';
import { ethers } from 'ethers';
import { useTheme } from '../context/ThemeContext';

const EnhancedWalletConnect = ({ onConnect }) => {
    const [isConnecting, setIsConnecting] = useState(false);
    const [error, setError] = useState(null);
    const { isDarkMode } = useTheme();
    
    const connectWallet = async () => {
        setIsConnecting(true);
        setError(null);
        
        try {
            if (!window.ethereum) {
                throw new Error("No Ethereum wallet found. Please install MetaMask.");
            }
            
            // Request account access
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const account = accounts[0];
            
            // Get provider and signer
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            
            // Pass the account address back to the parent component
            onConnect(account);
            
            // Add toast notification
            const notification = document.createElement('div');
            notification.className = 'wallet-notification';
            notification.innerHTML = `
                <div class="wallet-notification-content">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    <div>
                        <span>Wallet Connected</span>
                        <span class="wallet-address">${account.substring(0, 6)}...${account.substring(account.length - 4)}</span>
                    </div>
                </div>
            `;
            document.body.appendChild(notification);
            
            // Remove notification after 3 seconds
            setTimeout(() => {
                notification.style.opacity = '0';
                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 300);
            }, 3000);
            
            // Add notification styles
            const style = document.createElement('style');
            style.innerHTML = `
                .wallet-notification {
                    position: fixed;
                    top: 24px;
                    right: 24px;
                    background-color: ${isDarkMode ? '#2a2a2a' : 'white'};
                    border-radius: 12px;
                    padding: 16px;
                    box-shadow: 0 8px 30px rgba(0,0,0,0.12);
                    z-index: 9999;
                    transition: opacity 0.3s ease;
                    border: 1px solid rgba(76, 175, 80, 0.3);
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                }
                .wallet-notification-content {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .wallet-notification-content div {
                    display: flex;
                    flex-direction: column;
                }
                .wallet-notification-content span {
                    line-height: 1.5;
                    font-weight: 500;
                    color: ${isDarkMode ? '#ffffff' : '#000000'};
                }
                .wallet-address {
                    font-size: 0.8rem;
                    color: ${isDarkMode ? '#aaaaaa' : '#888'};
                    font-family: monospace;
                }
            `;
            document.head.appendChild(style);
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setIsConnecting(false);
        }
    };
    
    return (
        <div style={{
            padding: '36px',
            backgroundColor: isDarkMode ? '#2a2a2a' : '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.05)',
            textAlign: 'center',
            marginBottom: '40px',
            maxWidth: '700px',
            margin: '0 auto 40px',
            animation: 'fadeIn 0.5s ease',
            border: '1px solid rgba(0,0,0,0.05)'
        }}>
            <div style={{
                width: '72px',
                height: '72px',
                margin: '0 auto 24px',
                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
            </div>
            
            <h2 style={{ 
                fontSize: '1.8rem', 
                fontWeight: '700', 
                margin: '0 0 16px',
                color: isDarkMode ? '#ffffff' : '#000000'
            }}>
                Connect Your Wallet
            </h2>
            
            <p style={{ 
                fontSize: '1.1rem', 
                color: isDarkMode ? '#aaaaaa' : '#666666', 
                marginBottom: '32px',
                lineHeight: '1.6'
            }}>
                Connect your wallet to start earning rewards for watching videos.
                You earn WRT tokens for every 10 seconds of active watch time.
            </p>
            
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                maxWidth: '280px',
                margin: '0 auto'
            }}>
                <button 
                    onClick={connectWallet}
                    disabled={isConnecting}
                    style={{
                        backgroundColor: '#4CAF50',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '50px',
                        padding: '14px 24px',
                        fontSize: '1rem',
                        fontWeight: '600',
                        cursor: isConnecting ? 'default' : 'pointer',
                        boxShadow: '0 4px 14px rgba(76, 175, 80, 0.25)',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                        opacity: isConnecting ? 0.7 : 1,
                    }}
                >
                    {isConnecting ? (
                        <>
                            <svg 
                                style={{ animation: 'spin 1s linear infinite' }} 
                                xmlns="http://www.w3.org/2000/svg" 
                                width="18" 
                                height="18" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke="currentColor" 
                                strokeWidth="2" 
                                strokeLinecap="round" 
                                strokeLinejoin="round"
                            >
                                <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
                            </svg>
                            Connecting...
                        </>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            </svg>
                            Connect with MetaMask
                        </>
                    )}
                </button>
                
                <button 
                    style={{
                        backgroundColor: 'transparent',
                        color: isDarkMode ? '#aaaaaa' : '#666666',
                        border: `1px solid ${isDarkMode ? '#444444' : '#e0e0e0'}`,
                        borderRadius: '50px',
                        padding: '14px 24px',
                        fontSize: '0.9rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                    }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                    Learn how it works
                </button>
            </div>
            
            {error && (
                <div style={{
                    marginTop: '24px',
                    padding: '12px 16px',
                    backgroundColor: isDarkMode ? '#3a1a1a' : '#FFEBEE',
                    borderRadius: '8px',
                    color: '#D32F2F',
                    fontSize: '0.9rem',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    border: '1px solid rgba(211, 47, 47, 0.3)'
                }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    {error}
                </div>
            )}
            
            <div style={{
                marginTop: '32px',
                padding: '16px',
                backgroundColor: isDarkMode ? 'rgba(76, 175, 80, 0.1)' : 'rgba(76, 175, 80, 0.05)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                justifyContent: 'center',
                border: '1px dashed rgba(76, 175, 80, 0.3)'
            }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                <span style={{ 
                    color: isDarkMode ? '#4CAF50' : '#2E7D32', 
                    fontSize: '0.9rem', 
                    lineHeight: '1.5' 
                }}>
                    MetaView never has access to your wallet keys or funds
                </span>
            </div>
            
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(76, 175, 80, 0.3);
                }
                
                button:active {
                    transform: translateY(0);
                }
            `}</style>
        </div>
    );
};

export default EnhancedWalletConnect;