
import React, { useState, useEffect, useRef } from 'react';
import { CelebrationAnimation } from '../animations/backgroundAnimations';

const REWARD_RATE = 10; // 10 tokens per 5 minutes
const REWARD_INTERVAL = 5; // Every 5 minutes

const RewardVisualizer = ({ watchTime, userAddress }) => {
    const [earnedTokens, setEarnedTokens] = useState(0);
    const [showCelebration, setShowCelebration] = useState(false);
    const [rewardHistory, setRewardHistory] = useState([]);
    const prevMinutesRef = useRef(Math.floor(watchTime / 60));
    
    useEffect(() => {
        const minutes = Math.floor(watchTime / 60);
        const tokensEarned = Math.floor(minutes / REWARD_INTERVAL) * REWARD_RATE;
        
        // Check if we've reached a new reward milestone
        if (
            minutes >= REWARD_INTERVAL && 
            minutes % REWARD_INTERVAL === 0 && 
            minutes !== prevMinutesRef.current &&
            minutes / REWARD_INTERVAL > rewardHistory.length
        ) {
            // Add to reward history
            const newReward = {
                id: Date.now(),
                tokens: REWARD_RATE,
                timestamp: new Date().toISOString(),
                watchTime: minutes
            };
            
            setRewardHistory(prev => [...prev, newReward]);
            setShowCelebration(true);
            
            // Hide celebration after 3 seconds
            setTimeout(() => {
                setShowCelebration(false);
            }, 3000);
        }
        
        setEarnedTokens(tokensEarned);
        prevMinutesRef.current = minutes;
    }, [watchTime, rewardHistory.length]);
    
    // Animated counter effect
    const AnimatedCounter = ({ value, duration = 1000 }) => {
        const [displayValue, setDisplayValue] = useState(0);
        const previousValueRef = useRef(0);
        
        useEffect(() => {
            let startTime;
            let animationFrame;
            const startValue = previousValueRef.current;
            
            const step = (timestamp) => {
                if (!startTime) startTime = timestamp;
                const progress = Math.min((timestamp - startTime) / duration, 1);
                
                const currentValue = Math.floor(
                    startValue + progress * (value - startValue)
                );
                
                setDisplayValue(currentValue);
                
                if (progress < 1) {
                    animationFrame = requestAnimationFrame(step);
                } else {
                    previousValueRef.current = value;
                }
            };
            
            animationFrame = requestAnimationFrame(step);
            
            return () => {
                cancelAnimationFrame(animationFrame);
            };
        }, [value, duration]);
        
        return <span>{displayValue}</span>;
    };
    
    return (
        <div className="rewards-section" style={{
            marginTop: '30px',
            padding: '25px',
            backgroundColor: '#f7fee7',
            border: '1px solid #bef264',
            borderRadius: '12px',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease'
        }}>
            <h3 style={{
                fontSize: '1.3rem',
                color: '#3f6212',
                margin: '0 0 20px 0',
                fontWeight: '600'
            }}>Your Earned Rewards</h3>
            
            {/* Token visualization */}
            <div style={{
                position: 'relative',
                width: '150px',
                height: '150px',
                margin: '0 auto 20px',
                background: 'radial-gradient(circle, #bef264 0%, #65a30d 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'inset 0 0 20px rgba(0,0,0,0.1), 0 10px 20px rgba(190, 242, 100, 0.3)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                transform: showCelebration ? 'scale(1.05)' : 'scale(1)',
                animation: showCelebration ? 'pulse 1s' : 'none'
            }}>
                <div style={{
                    fontSize: '2.5rem',
                    fontWeight: '700',
                    color: '#ffffff',
                    textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}>
                    <AnimatedCounter value={earnedTokens} />
                    <span style={{ fontSize: '1rem', opacity: 0.9, marginLeft: '4px' }}>WRT</span>
                </div>
            </div>
            
            <div style={{
                margin: '20px auto',
                maxWidth: '80%',
                height: '6px',
                background: '#e5e7eb',
                borderRadius: '3px',
                overflow: 'hidden',
                position: 'relative'
            }}>
                <div style={{
                    height: '100%',
                    width: `${(watchTime/60 % REWARD_INTERVAL) / REWARD_INTERVAL * 100}%`,
                    background: 'linear-gradient(to right, #65a30d, #bef264)',
                    borderRadius: '3px',
                    transition: 'width 0.3s ease'
                }}/>
                
                <div style={{
                    position: 'absolute',
                    top: '-20px',
                    left: '0',
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.7rem',
                    color: '#65a30d'
                }}>
                    <span>0 min</span>
                    <span>{REWARD_INTERVAL} min</span>
                </div>
            </div>
            
            <div style={{
                margin: '25px 0 15px',
                fontSize: '0.9rem',
                color: '#4d7c0f'
            }}>
                <div>You earn {REWARD_RATE} WRT tokens for every {REWARD_INTERVAL} minutes watched</div>
                <div style={{ marginTop: '8px', fontSize: '0.8rem' }}>
                    Contract: <span style={{ fontFamily: 'monospace' }}>
                        {userAddress?.slice(0, 6)}...{userAddress?.slice(-4)}
                    </span>
                </div>
            </div>
            
            {/* Reward history */}
            {rewardHistory.length > 0 && (
                <div style={{ 
                    marginTop: '25px',
                    borderTop: '1px dashed #bef264',
                    paddingTop: '15px'
                }}>
                    <h4 style={{ 
                        fontSize: '1rem',
                        color: '#3f6212',
                        marginBottom: '10px'
                    }}>Reward History</h4>
                    
                    <div style={{
                        maxHeight: '150px',
                        overflowY: 'auto',
                        padding: '5px',
                        marginTop: '10px'
                    }}>
                        {rewardHistory.map((reward, index) => (
                            <div key={reward.id} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                padding: '8px 12px',
                                marginBottom: '8px',
                                backgroundColor: 'rgba(190, 242, 100, 0.15)',
                                borderRadius: '6px',
                                fontSize: '0.85rem',
                                animation: 'fadeIn 0.5s'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10" />
                                        <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                                        <line x1="9" y1="9" x2="9.01" y2="9" />
                                        <line x1="15" y1="9" x2="15.01" y2="9" />
                                    </svg>
                                    <span>{reward.tokens} WRT earned</span>
                                </div>
                                <div style={{ color: '#65a30d' }}>
                                    at {reward.watchTime} min
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            {earnedTokens > 0 && (
                <button 
                    style={{ 
                        marginTop: '20px',
                        backgroundColor: '#65a30d',
                        padding: '12px 24px',
                        borderRadius: '8px',
                        border: 'none',
                        color: 'white',
                        fontSize: '0.95rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        transition: 'all 0.2s ease'
                    }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <polyline points="19 12 12 19 5 12"></polyline>
                    </svg>
                    Claim Rewards
                </button>
            )}
            
            {/* Celebration animation */}
            <CelebrationAnimation isActive={showCelebration} />
        </div>
    );
};

export default RewardVisualizer;