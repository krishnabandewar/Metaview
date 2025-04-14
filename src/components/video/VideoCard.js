import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const VideoCard = ({ video, onClick }) => {
    const { isDarkMode } = useTheme();
    
    return (
        <div 
            className="video-card"
            onClick={onClick}
            style={{
                width: '100%',
                maxWidth: '320px',
                backgroundColor: isDarkMode ? '#2a2a2a' : '#ffffff',
                borderRadius: '12px',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: isDarkMode 
                        ? '0 8px 16px rgba(0,0,0,0.3)' 
                        : '0 8px 16px rgba(0,0,0,0.1)'
                }
            }}
        >
            <div style={{ position: 'relative', paddingTop: '56.25%' }}>
                <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                    }}
                />
                <div style={{
                    position: 'absolute',
                    bottom: '8px',
                    right: '8px',
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    color: '#ffffff',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '0.8rem'
                }}>
                    {formatDuration(video.duration)}
                </div>
            </div>
            
            <div style={{ padding: '12px' }}>
                <h3 style={{
                    margin: '0 0 8px 0',
                    fontSize: '1rem',
                    color: isDarkMode ? '#ffffff' : '#000000',
                    fontWeight: '600',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                }}>
                    {video.title}
                </h3>
                
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '8px'
                }}>
                    <img 
                        src={video.creator.avatar} 
                        alt={video.creator.name}
                        style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%'
                        }}
                    />
                    <span style={{
                        fontSize: '0.9rem',
                        color: isDarkMode ? '#cccccc' : '#666666'
                    }}>
                        {video.creator.name}
                    </span>
                </div>
                
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.8rem',
                    color: isDarkMode ? '#999999' : '#666666'
                }}>
                    <span>{formatViews(video.views)} views</span>
                    <span>{formatDate(video.uploadDate)}</span>
                </div>
                
                {video.rewardAmount > 0 && (
                    <div style={{
                        marginTop: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        color: '#4CAF50',
                        fontSize: '0.9rem'
                    }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6"></path>
                            <polyline points="4 8 12 2 20 8"></polyline>
                        </svg>
                        {video.rewardAmount} WRT
                    </div>
                )}
            </div>
        </div>
    );
};

const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const formatViews = (views) => {
    if (views >= 1000000) {
        return `${(views / 1000000).toFixed(1)}M`;
    }
    if (views >= 1000) {
        return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
};

const formatDate = (date) => {
    const now = new Date();
    const uploadDate = new Date(date);
    const diff = now - uploadDate;
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days < 1) return 'Today';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    if (days < 365) return `${Math.floor(days / 30)} months ago`;
    return `${Math.floor(days / 365)} years ago`;
};

export default VideoCard; 