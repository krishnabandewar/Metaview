import React, { useState, useEffect } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import EnhancedVideoPlayer from './components/EnhancedVideoPlayer';
import EnhancedWalletConnect from './components/EnhancedWalletConnect';
import UserDashboard from './components/UserDashboard';
import NotificationSystem from './components/NotificationSystem';
import './App.css';

const AppContent = () => {
    const [account, setAccount] = useState(null);
    const [watchTime, setWatchTime] = useState(0);
    const [activePage, setActivePage] = useState('home');
    const [isLoaded, setIsLoaded] = useState(false);
    const { isDarkMode, toggleTheme } = useTheme();

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoaded(true);
        }, 100);
        
        return () => clearTimeout(timer);
    }, []);

    const handleTimeUpdate = (time) => {
        setWatchTime(time);
    };

    const handleConnect = (account) => {
        setAccount(account);
    };

    return (
        <>
            <NotificationSystem />
            
            <div className="App" style={{
                backgroundColor: isDarkMode ? '#1a1a1a' : '#f9fafb',
                minHeight: '100vh',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
                display: 'flex',
                flexDirection: 'column',
                opacity: isLoaded ? 1 : 0,
                transition: 'opacity 0.5s ease'
            }}>
                <nav style={{
                    backgroundColor: isDarkMode ? '#000000' : '#000000',
                    padding: '18px 40px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    zIndex: 1000,
                    position: 'relative'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
                        <div style={{ 
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}>
                            <div style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '8px',
                                background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polygon points="23 7 16 12 23 17 23 7"></polygon>
                                    <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                                </svg>
                            </div>
                            <h1 style={{ 
                                color: '#ffffff', 
                                margin: 0, 
                                fontSize: '1.8rem', 
                                fontWeight: '700',
                                letterSpacing: '0.5px'
                            }}>
                                <span style={{ color: '#4CAF50' }}>Meta</span>View
                            </h1>
                        </div>
                        
                        <div style={{ display: 'flex', gap: '24px' }}>
                            <button 
                                onClick={() => setActivePage('home')}
                                style={{
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    color: activePage === 'home' ? '#ffffff' : '#aaaaaa',
                                    fontSize: '1rem',
                                    fontWeight: '500',
                                    cursor: 'pointer',
                                    padding: '6px 10px',
                                    borderBottom: activePage === 'home' ? '2px solid #4CAF50' : '2px solid transparent',
                                    transition: 'all 0.2s ease',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                                </svg>
                                Home
                            </button>
                            <button 
                                onClick={() => setActivePage('rewards')}
                                style={{
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    color: activePage === 'rewards' ? '#ffffff' : '#aaaaaa',
                                    fontSize: '1rem',
                                    fontWeight: '500',
                                    cursor: 'pointer',
                                    padding: '6px 10px',
                                    borderBottom: activePage === 'rewards' ? '2px solid #4CAF50' : '2px solid transparent',
                                    opacity: account ? 1 : 0.5,
                                    pointerEvents: account ? 'auto' : 'none',
                                    transition: 'all 0.2s ease',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="8" r="7"></circle>
                                    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
                                </svg>
                                Rewards
                            </button>
                        </div>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <button
                            onClick={toggleTheme}
                            style={{
                                backgroundColor: 'transparent',
                                border: 'none',
                                color: '#ffffff',
                                cursor: 'pointer',
                                padding: '8px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            {isDarkMode ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="5"></circle>
                                    <line x1="12" y1="1" x2="12" y2="3"></line>
                                    <line x1="12" y1="21" x2="12" y2="23"></line>
                                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                                    <line x1="1" y1="12" x2="3" y2="12"></line>
                                    <line x1="21" y1="12" x2="23" y2="12"></line>
                                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                                </svg>
                            )}
                        </button>
                        
                        {account ? (
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '14px',
                                backgroundColor: 'rgba(76, 175, 80, 0.15)',
                                padding: '10px 16px',
                                borderRadius: '8px',
                                boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                                transition: 'all 0.2s ease',
                                cursor: 'pointer',
                                border: '1px solid rgba(76, 175, 80, 0.3)'
                            }}>
                                <div style={{
                                    width: '28px',
                                    height: '28px',
                                    borderRadius: '50%',
                                    backgroundColor: '#4CAF50',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="12" cy="7" r="4"></circle>
                                    </svg>
                                </div>
                                <div>
                                    <div style={{ 
                                        color: '#ffffff', 
                                        fontFamily: 'monospace', 
                                        fontSize: '0.9rem' 
                                    }}>
                                        {`${account.substring(0, 6)}...${account.substring(account.length - 4)}`}
                                    </div>
                                    <div style={{ color: '#ffffff', fontSize: '0.7rem', marginTop: '2px', fontWeight: '500' }}>Connected</div>
                                </div>
                            </div>
                        ) : (
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '8px 12px',
                                borderRadius: '8px',
                                border: '1px solid #4CAF50',
                                color: '#4CAF50',
                                fontSize: '0.9rem',
                                fontWeight: '500'
                            }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                </svg>
                                Wallet not connected
                            </div>
                        )}
                    </div>
                </nav>
                
                <main style={{
                    flex: 1,
                    padding: '40px',
                    maxWidth: '1400px',
                    margin: '0 auto',
                    width: '100%',
                    boxSizing: 'border-box'
                }}>
                    {activePage === 'home' && (
                        <>
                            {!account && (
                                <div style={{
                                    textAlign: 'center',
                                    marginBottom: '60px',
                                    animation: 'fadeInUp 0.5s ease'
                                }}>
                                    <div style={{ 
                                        display: 'inline-block',
                                        backgroundColor: 'rgba(76, 175, 80, 0.1)',
                                        borderRadius: '50px',
                                        padding: '8px 16px',
                                        color: '#4CAF50',
                                        fontWeight: '500',
                                        fontSize: '0.9rem',
                                        marginBottom: '20px'
                                    }}>
                                        Web3 Video Platform
                                    </div>
                                    
                                    <h2 style={{
                                        fontSize: '3.2rem',
                                        color: isDarkMode ? '#ffffff' : '#000000',
                                        marginBottom: '16px',
                                        fontWeight: '800',
                                        lineHeight: '1.2'
                                    }}>
                                        Watch Videos, <span style={{ color: '#4CAF50' }}>Earn Rewards</span>
                                    </h2>
                                    
                                    <p style={{
                                        fontSize: '1.2rem',
                                        color: isDarkMode ? '#aaaaaa' : '#555555',
                                        maxWidth: '700px',
                                        margin: '0 auto 32px',
                                        lineHeight: '1.6'
                                    }}>
                                        MetaView is a decentralized video platform where you earn WRT tokens for watching content. 
                                        Connect your wallet and start earning rewards for every 10 seconds of watch time!
                                    </p>
                                    
                                    <div style={{ 
                                        display: 'flex', 
                                        gap: '16px', 
                                        justifyContent: 'center',
                                        marginTop: '32px'
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px',
                                            backgroundColor: isDarkMode ? '#2a2a2a' : '#ffffff',
                                            padding: '16px 24px',
                                            borderRadius: '50px',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                            transition: 'all 0.2s ease',
                                            transform: 'translateY(0)'
                                        }}>
                                            <div style={{
                                                width: '36px',
                                                height: '36px',
                                                borderRadius: '50%',
                                                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <circle cx="12" cy="12" r="10"></circle>
                                                    <polyline points="12 6 12 12 16 14"></polyline>
                                                </svg>
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: '600', color: isDarkMode ? '#ffffff' : '#000000' }}>Watch videos</div>
                                                <div style={{ fontSize: '0.8rem', color: isDarkMode ? '#aaaaaa' : '#666666', marginTop: '2px' }}>High-quality content</div>
                                            </div>
                                        </div>
                                        
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px',
                                            backgroundColor: isDarkMode ? '#2a2a2a' : '#ffffff',
                                            padding: '16px 24px',
                                            borderRadius: '50px',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                            transition: 'all 0.2s ease',
                                            transform: 'translateY(0)'
                                        }}>
                                            <div style={{
                                                width: '36px',
                                                height: '36px',
                                                borderRadius: '50%',
                                                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <line x1="12" y1="1" x2="12" y2="23"></line>
                                                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                                                </svg>
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: '600', color: isDarkMode ? '#ffffff' : '#000000' }}>Earn tokens</div>
                                                <div style={{ fontSize: '0.8rem', color: isDarkMode ? '#aaaaaa' : '#666666', marginTop: '2px' }}>Every 10 seconds</div>
                                            </div>
                                        </div>
                                        
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px',
                                            backgroundColor: isDarkMode ? '#2a2a2a' : '#ffffff',
                                            padding: '16px 24px',
                                            borderRadius: '50px',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                            transition: 'all 0.2s ease',
                                            transform: 'translateY(0)'
                                        }}>
                                            <div style={{
                                                width: '36px',
                                                height: '36px',
                                                borderRadius: '50%',
                                                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                                                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                                                </svg>
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: '600', color: isDarkMode ? '#ffffff' : '#000000' }}>Claim rewards</div>
                                                <div style={{ fontSize: '0.8rem', color: isDarkMode ? '#aaaaaa' : '#666666', marginTop: '2px' }}>To your wallet</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            {!account ? (
                                <EnhancedWalletConnect onConnect={handleConnect} />
                            ) : null}
                            
                            <div style={{ 
                                marginTop: account ? '0' : '40px',
                                backgroundColor: isDarkMode ? '#2a2a2a' : '#ffffff',
                                padding: '30px',
                                borderRadius: '16px',
                                boxShadow: '0 8px 30px rgba(0,0,0,0.05)',
                                animation: 'fadeIn 0.5s ease',
                                border: '1px solid rgba(0,0,0,0.05)'
                            }}>
                                <h3 style={{ 
                                    margin: '0 0 24px 0', 
                                    fontSize: '1.5rem', 
                                    color: isDarkMode ? '#ffffff' : '#000000',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    paddingBottom: '16px',
                                    borderBottom: '1px solid #f0f0f0'
                                }}>
                                    <div style={{
                                        width: '36px',
                                        height: '36px',
                                        borderRadius: '10px',
                                        backgroundColor: '#000000',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polygon points="23 7 16 12 23 17 23 7"></polygon>
                                            <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                                        </svg>
                                    </div>
                                    Featured Video
                                </h3>
                                
                                <EnhancedVideoPlayer onTimeUpdate={handleTimeUpdate} />
                            </div>
                        </>
                    )}
                    
                    {activePage === 'rewards' && account && (
                        <UserDashboard userAddress={account} watchTime={watchTime} />
                    )}
                </main>
                
                <footer style={{
                    borderTop: '1px solid #eaeaea',
                    padding: '30px 40px',
                    backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
                    color: isDarkMode ? '#ffffff' : '#000000',
                    fontSize: '0.9rem'
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        maxWidth: '1400px',
                        margin: '0 auto',
                        alignItems: 'center'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{
                                width: '24px',
                                height: '24px',
                                borderRadius: '6px',
                                background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polygon points="23 7 16 12 23 17 23 7"></polygon>
                                    <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                                </svg>
                            </div>
                            <strong style={{ fontSize: '1.1rem' }}>
                                <span style={{ color: '#4CAF50' }}>Meta</span>View
                            </strong>
                            <span style={{ margin: '0 10px', color: '#dddddd' }}>|</span>
                            <span>© 2023 | Powered by Ethereum</span>
                        </div>
                        
                        <div style={{ display: 'flex', gap: '20px' }}>
                            <span style={{ 
                                position: 'relative', 
                                cursor: 'help',
                                padding: '5px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                borderRadius: '4px',
                                transition: 'all 0.2s ease',
                                ':hover': {
                                    backgroundColor: isDarkMode ? '#2a2a2a' : '#f5f5f5'
                                }
                            }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                                </svg>
                                How it works
                                <span style={{
                                    position: 'absolute',
                                    bottom: '100%',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    width: '250px',
                                    background: isDarkMode ? '#2a2a2a' : '#ffffff',
                                    color: isDarkMode ? '#ffffff' : '#000000',
                                    padding: '16px',
                                    borderRadius: '8px',
                                    fontSize: '0.85rem',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                                    opacity: 0,
                                    visibility: 'hidden',
                                    transition: 'opacity 0.3s, visibility 0.3s',
                                    pointerEvents: 'none',
                                    textAlign: 'center',
                                    lineHeight: '1.5',
                                    border: '1px solid #f0f0f0',
                                    zIndex: 100
                                }}>
                                    Watch videos to earn WRT tokens. You earn rewards for every 10 seconds of active watch time.
                                </span>
                            </span>
                            
                            <a href="#" style={{ 
                                color: isDarkMode ? '#ffffff' : '#000000', 
                                textDecoration: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '5px',
                                borderRadius: '4px',
                                transition: 'all 0.2s ease',
                                ':hover': {
                                    backgroundColor: isDarkMode ? '#2a2a2a' : '#f5f5f5'
                                }
                            }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"></path>
                                </svg>
                                Terms
                            </a>
                            
                            <a href="#" style={{ 
                                color: isDarkMode ? '#ffffff' : '#000000', 
                                textDecoration: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '5px',
                                borderRadius: '4px',
                                transition: 'all 0.2s ease',
                                ':hover': {
                                    backgroundColor: isDarkMode ? '#2a2a2a' : '#f5f5f5'
                                }
                            }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                </svg>
                                Privacy
                            </a>
                        </div>
                    </div>
                </footer>
                
                <style>{`
                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    
                    @keyframes fadeInUp {
                        from { 
                            opacity: 0;
                            transform: translateY(20px);
                        }
                        to { 
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                `}</style>
            </div>
        </>
    );
};

function App() {
    return (
        <ThemeProvider>
            <AppContent />
        </ThemeProvider>
    );
}

export default App;