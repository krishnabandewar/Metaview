// frontend/src/components/EnhancedVideoPlayer.js
import React, { useRef, useEffect, useState } from 'react';
import useWatchTime from '../hooks/useWatchTime';
import { ethers } from 'ethers';
import RewardToken from '../contracts/RewardToken.json';
import contractAddresses from '../contracts/contractAddresses';
import { useTheme } from '../context/ThemeContext';

const REWARD_INTERVAL = 10; // Reward every 10 seconds
const REWARD_AMOUNT = ethers.utils.parseEther("1"); // 1 WRT token per claim

const EnhancedVideoPlayer = ({ onTimeUpdate }) => {
    const videoRef = useRef(null);
    const progressBarRef = useRef(null);
    const [watchTime, setWatchTime] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [isInFocusMode, setIsInFocusMode] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [canClaimReward, setCanClaimReward] = useState(false);
    const [lastClaimedTime, setLastClaimedTime] = useState(0);
    const [isClaiming, setIsClaiming] = useState(false);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [showQualityMenu, setShowQualityMenu] = useState(false);
    const [currentQuality, setCurrentQuality] = useState('1080p');
    const [showSubtitles, setShowSubtitles] = useState(false);
    const [isPictureInPicture, setIsPictureInPicture] = useState(false);
    const [showChapters, setShowChapters] = useState(false);
    const [hoverTime, setHoverTime] = useState(null);
    const [hoverPosition, setHoverPosition] = useState(0);
    const { isDarkMode } = useTheme();
    
    const controlsTimeout = useRef(null);
    const watchTimeInterval = useRef(null);
    
    const fileInputRef = useRef(null);
    const [localVideoUrl, setLocalVideoUrl] = useState(null);
    const [recentFiles, setRecentFiles] = useState([]);
    const [showFileMenu, setShowFileMenu] = useState(false);
    const [showRecentFiles, setShowRecentFiles] = useState(false);
    const [showAdvancedControls, setShowAdvancedControls] = useState(false);
    const [videoInfo, setVideoInfo] = useState(null);
    
    // Calculate milestone markers (every 10 seconds)
    const milestones = [];
    if (duration) {
        const secondsTotal = Math.floor(duration);
        for (let i = REWARD_INTERVAL; i <= secondsTotal; i += REWARD_INTERVAL) {
            const percentage = (i / duration) * 100;
            milestones.push({ second: i, percentage });
        }
    }
    
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;
        
        const handleTimeUpdate = () => {
            setWatchTime(Math.floor(video.currentTime));
            onTimeUpdate && onTimeUpdate(Math.floor(video.currentTime));
            
            // Update progress bar
            const progressPercentage = (video.currentTime / video.duration) * 100;
            if (progressBarRef.current) {
                progressBarRef.current.style.width = `${progressPercentage}%`;
            }
        };
        
        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);
        const handleLoadedMetadata = () => setDuration(video.duration);
        const handleFullscreenChange = () => setIsFullscreen(document.fullscreenElement !== null);
        
        // Event listeners
        video.addEventListener('timeupdate', handleTimeUpdate);
        video.addEventListener('play', handlePlay);
        video.addEventListener('pause', handlePause);
        video.addEventListener('loadedmetadata', handleLoadedMetadata);
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        
        return () => {
            video.removeEventListener('timeupdate', handleTimeUpdate);
            video.removeEventListener('play', handlePlay);
            video.removeEventListener('pause', handlePause);
            video.removeEventListener('loadedmetadata', handleLoadedMetadata);
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, [onTimeUpdate]);
    
    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            videoRef.current.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    };
    
    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !videoRef.current.muted;
            setIsMuted(videoRef.current.muted);
        }
    };
    
    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (videoRef.current) {
            videoRef.current.volume = newVolume;
            setIsMuted(newVolume === 0);
        }
    };
    
    // Toggle focus mode
    const toggleFocusMode = () => {
        setIsInFocusMode(!isInFocusMode);
    };
    
    // Add new function to handle reward claiming
    const handleClaimReward = async () => {
        if (!window.ethereum) {
            window.notifications?.error('Please install MetaMask to claim rewards');
            return;
        }

        if (watchTime < REWARD_INTERVAL || watchTime - lastClaimedTime < REWARD_INTERVAL) {
            window.notifications?.error('Not enough watch time to claim reward');
            return;
        }

        try {
            setIsClaiming(true);
            
            // Get the connected account
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const userAddress = accounts[0];

            // Connect to the contract
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const rewardToken = new ethers.Contract(
                contractAddresses.rewardToken,
                RewardToken.abi,
                signer
            );

            // Call the rewardUser function
            const tx = await rewardToken.rewardUser(userAddress, REWARD_AMOUNT);
            
            // Show pending notification
            window.notifications?.info('Transaction sent. Waiting for confirmation...');

            // Wait for transaction to be mined
            await tx.wait();

            // Show success notification
            window.notifications?.success(`Successfully claimed ${ethers.utils.formatEther(REWARD_AMOUNT)} WRT tokens!`);
            
            // Update state
            setLastClaimedTime(watchTime);
            setCanClaimReward(false);
        } catch (error) {
            console.error('Error claiming reward:', error);
            window.notifications?.error('Failed to claim reward. Please try again.');
        } finally {
            setIsClaiming(false);
        }
    };

    // Update useEffect to check for reward eligibility
    useEffect(() => {
        if (watchTime >= REWARD_INTERVAL && watchTime - lastClaimedTime >= REWARD_INTERVAL) {
            setCanClaimReward(true);
        }
    }, [watchTime, lastClaimedTime]);
    
    // Format time (mm:ss)
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };
    
    // Feature 1: Picture-in-Picture Mode
    const togglePictureInPicture = async () => {
        if (document.pictureInPictureElement) {
            await document.exitPictureInPicture();
            setIsPictureInPicture(false);
        } else if (document.pictureInPictureEnabled) {
            await videoRef.current.requestPictureInPicture();
            setIsPictureInPicture(true);
        }
    };

    // Feature 2: Keyboard Shortcuts
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (!videoRef.current) return;
            
            switch(e.key.toLowerCase()) {
                case ' ':
                case 'k':
                    handlePlayPause();
                    break;
                case 'f':
                    handleFullscreenToggle();
                    break;
                case 'm':
                    handleMuteToggle();
                    break;
                case 'arrowleft':
                    videoRef.current.currentTime -= 5;
                    break;
                case 'arrowright':
                    videoRef.current.currentTime += 5;
                    break;
                case 'arrowup':
                    setVolume(Math.min(1, volume + 0.1));
                    break;
                case 'arrowdown':
                    setVolume(Math.max(0, volume - 0.1));
                    break;
                case '>':
                    setPlaybackRate(Math.min(2, playbackRate + 0.25));
                    break;
                case '<':
                    setPlaybackRate(Math.max(0.5, playbackRate - 0.25));
                    break;
            }
        };

        document.addEventListener('keydown', handleKeyPress);
        return () => document.removeEventListener('keydown', handleKeyPress);
    }, [volume, playbackRate]);

    // Feature 3: Auto-hide Controls
    useEffect(() => {
        if (isPlaying) {
            controlsTimeout.current = setTimeout(() => {
                setShowControls(false);
            }, 3000);
        }
        return () => clearTimeout(controlsTimeout.current);
    }, [isPlaying, showControls]);

    // Feature 4: Quality Selection
    const qualityOptions = [
        { label: '1080p', value: '1080p' },
        { label: '720p', value: '720p' },
        { label: '480p', value: '480p' },
        { label: '360p', value: '360p' }
    ];

    // Feature 5: Chapter Navigation
    const chapters = [
        { time: 0, title: 'Introduction' },
        { time: 30, title: 'Getting Started' },
        { time: 60, title: 'Main Content' },
        { time: 90, title: 'Conclusion' }
    ];

    // Feature 6: Subtitle Toggle
    const toggleSubtitles = () => {
        setShowSubtitles(!showSubtitles);
        // In a real implementation, you would load subtitle tracks here
    };

    // Feature 7: Playback Speed Control
    const playbackRates = [0.5, 0.75, 1, 1.25, 1.5, 2];

    // Feature 8: Video Progress Preview
    const handleProgressHover = (e) => {
        const rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = x / rect.width;
        setHoverPosition(x);
        setHoverTime(duration * percentage);
    };

    // Feature 9: Playback Speed Control
    const handleSpeedChange = (e) => {
        const newSpeed = parseFloat(e.target.value);
        setPlaybackRate(newSpeed);
        if (videoRef.current) {
            videoRef.current.playbackRate = newSpeed;
        }
    };

    // Feature 10: Fullscreen with Focus Mode
    const handleFullscreenToggle = () => {
        if (!document.fullscreenElement) {
            videoRef.current.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    const handlePlayPause = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleMuteToggle = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const handleProgressChange = (e) => {
        const newTime = parseFloat(e.target.value);
        setWatchTime(newTime);
        if (videoRef.current) {
            videoRef.current.currentTime = newTime;
        }
    };

    const handleMouseMove = () => {
        setShowControls(true);
        clearTimeout(controlsTimeout.current);
        controlsTimeout.current = setTimeout(() => {
            setShowControls(false);
        }, 3000);
    };

    // Add function to handle local file selection with more features
    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith('video/')) {
            const url = URL.createObjectURL(file);
            setLocalVideoUrl(url);
            
            // Add to recent files
            const newRecentFile = {
                name: file.name,
                url: url,
                lastPlayed: new Date().toISOString()
            };
            setRecentFiles(prev => [newRecentFile, ...prev].slice(0, 10));
            
            // Get video information
            const video = document.createElement('video');
            video.src = url;
            video.onloadedmetadata = () => {
                setVideoInfo({
                    duration: video.duration,
                    width: video.videoWidth,
                    height: video.videoHeight,
                    format: file.type,
                    size: file.size
                });
            };
            
            // Reset video state
            setWatchTime(0);
            setLastClaimedTime(0);
            setCanClaimReward(false);
        }
    };

    // Add function to open recent file
    const openRecentFile = (file) => {
        setLocalVideoUrl(file.url);
        setWatchTime(0);
        setLastClaimedTime(0);
        setCanClaimReward(false);
        setShowRecentFiles(false);
    };

    // Add function to clear recent files
    const clearRecentFiles = () => {
        setRecentFiles([]);
        setShowRecentFiles(false);
    };

    // Add function to format file size
    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className={`video-container ${isInFocusMode ? 'focus-mode' : ''}`} style={{
            position: 'relative',
            width: '100%',
            maxWidth: '1200px',
            margin: '0 auto',
            backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
            display: 'flex',
            flexDirection: 'column',
            gap: '15px'
        }}>
            {/* Video element */}
            <div style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '16/9',
                backgroundColor: '#000000',
                borderRadius: '12px',
                overflow: 'hidden'
            }}>
                <video
                    ref={videoRef}
                    style={{
                        width: '100%',
                        height: '100%',
                        display: 'block',
                        objectFit: 'cover'
                    }}
                    onClick={handlePlayPause}
                    src={localVideoUrl || "/videos/sample.mp4"}
                >
                    Your browser does not support the video tag.
                </video>

                {/* Enhanced file menu button */}
                <div style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    display: 'flex',
                    gap: '10px',
                    zIndex: 10
                }}>
                    <button
                        onClick={() => setShowFileMenu(!showFileMenu)}
                        style={{
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '10px 15px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: '0.9rem',
                            transition: 'background-color 0.2s ease'
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                            <polyline points="13 2 13 9 20 9"></polyline>
                        </svg>
                        File
                    </button>

                    {/* File menu dropdown */}
                    {showFileMenu && (
                        <div style={{
                            position: 'absolute',
                            top: '100%',
                            right: 0,
                            backgroundColor: isDarkMode ? '#2a2a2a' : '#ffffff',
                            borderRadius: '6px',
                            padding: '10px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                            minWidth: '200px'
                        }}>
                            <button
                                onClick={() => fileInputRef.current.click()}
                                style={{
                                    width: '100%',
                                    padding: '8px 12px',
                                    border: 'none',
                                    background: 'none',
                                    color: isDarkMode ? '#ffffff' : '#000000',
                                    textAlign: 'left',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    '&:hover': {
                                        backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
                                    }
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                    <polyline points="17 8 12 3 7 8"></polyline>
                                    <line x1="12" y1="3" x2="12" y2="15"></line>
                                </svg>
                                Open File...
                            </button>
                            <button
                                onClick={() => setShowRecentFiles(!showRecentFiles)}
                                style={{
                                    width: '100%',
                                    padding: '8px 12px',
                                    border: 'none',
                                    background: 'none',
                                    color: isDarkMode ? '#ffffff' : '#000000',
                                    textAlign: 'left',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    '&:hover': {
                                        backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
                                    }
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M3 12h18M3 6h18M3 18h18"></path>
                                </svg>
                                Recent Files
                            </button>
                            <button
                                onClick={() => setShowAdvancedControls(!showAdvancedControls)}
                                style={{
                                    width: '100%',
                                    padding: '8px 12px',
                                    border: 'none',
                                    background: 'none',
                                    color: isDarkMode ? '#ffffff' : '#000000',
                                    textAlign: 'left',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    '&:hover': {
                                        backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
                                    }
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="12" y1="8" x2="12" y2="16"></line>
                                    <line x1="8" y1="12" x2="16" y2="12"></line>
                                </svg>
                                Advanced Controls
                            </button>
                        </div>
                    )}

                    {/* Recent files dropdown */}
                    {showRecentFiles && (
                        <div style={{
                            position: 'absolute',
                            top: '100%',
                            right: 0,
                            backgroundColor: isDarkMode ? '#2a2a2a' : '#ffffff',
                            borderRadius: '6px',
                            padding: '10px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                            minWidth: '300px',
                            maxHeight: '400px',
                            overflowY: 'auto'
                        }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '10px',
                                paddingBottom: '10px',
                                borderBottom: `1px solid ${isDarkMode ? '#3a3a3a' : '#e0e0e0'}`
                            }}>
                                <h3 style={{ margin: 0, color: isDarkMode ? '#ffffff' : '#000000' }}>Recent Files</h3>
                                <button
                                    onClick={clearRecentFiles}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: isDarkMode ? '#ffffff' : '#000000',
                                        cursor: 'pointer',
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        '&:hover': {
                                            backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
                                        }
                                    }}
                                >
                                    Clear All
                                </button>
                            </div>
                            {recentFiles.length > 0 ? (
                                recentFiles.map((file, index) => (
                                    <button
                                        key={index}
                                        onClick={() => openRecentFile(file)}
                                        style={{
                                            width: '100%',
                                            padding: '8px 12px',
                                            border: 'none',
                                            background: 'none',
                                            color: isDarkMode ? '#ffffff' : '#000000',
                                            textAlign: 'left',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            '&:hover': {
                                                backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
                                            }
                                        }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                                            <polyline points="13 2 13 9 20 9"></polyline>
                                        </svg>
                                        <div style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {file.name}
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: isDarkMode ? '#999999' : '#666666' }}>
                                            {new Date(file.lastPlayed).toLocaleDateString()}
                                        </div>
                                    </button>
                                ))
                            ) : (
                                <div style={{ color: isDarkMode ? '#999999' : '#666666', textAlign: 'center', padding: '20px' }}>
                                    No recent files
                                </div>
                            )}
                        </div>
                    )}

                    {/* Advanced controls panel */}
                    {showAdvancedControls && (
                        <div style={{
                            position: 'absolute',
                            top: '100%',
                            right: 0,
                            backgroundColor: isDarkMode ? '#2a2a2a' : '#ffffff',
                            borderRadius: '6px',
                            padding: '20px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                            minWidth: '300px'
                        }}>
                            <h3 style={{ margin: '0 0 15px 0', color: isDarkMode ? '#ffffff' : '#000000' }}>Video Information</h3>
                            {videoInfo ? (
                                <div style={{ color: isDarkMode ? '#ffffff' : '#000000' }}>
                                    <div style={{ marginBottom: '10px' }}>
                                        <strong>Duration:</strong> {formatTime(videoInfo.duration)}
                                    </div>
                                    <div style={{ marginBottom: '10px' }}>
                                        <strong>Resolution:</strong> {videoInfo.width}x{videoInfo.height}
                                    </div>
                                    <div style={{ marginBottom: '10px' }}>
                                        <strong>Format:</strong> {videoInfo.format}
                                    </div>
                                    <div style={{ marginBottom: '10px' }}>
                                        <strong>Size:</strong> {formatFileSize(videoInfo.size)}
                                    </div>
                                </div>
                            ) : (
                                <div style={{ color: isDarkMode ? '#999999' : '#666666' }}>
                                    No video information available
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept="video/*"
                    style={{ display: 'none' }}
                />

                {/* Controls overlay */}
                <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                    padding: '25px 20px 20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    opacity: showControls ? 1 : 0,
                    transition: 'opacity 0.3s ease'
                }}>
                    {/* Progress bar */}
                    <div style={{
                        width: '100%',
                        height: '6px',
                        background: 'rgba(255,255,255,0.2)',
                        borderRadius: '3px',
                        cursor: 'pointer',
                        position: 'relative'
                    }}>
                        <div style={{
                            width: `${(watchTime / duration) * 100}%`,
                            height: '100%',
                            background: '#000000',
                            borderRadius: '3px',
                            transition: 'width 0.1s linear'
                        }} />
                        
                        {/* Milestone markers */}
                        {milestones.map((milestone, index) => (
                            <div
                                key={index}
                                className="milestone-marker"
                                style={{
                                    position: 'absolute',
                                    left: `${milestone.percentage}%`,
                                    top: '0',
                                    width: '2px',
                                    height: '100%',
                                    background: '#ffffff',
                                    transform: 'translateX(-50%)'
                                }}
                                title={`${milestone.second} second reward`}
                            />
                        ))}
                    </div>
                    
                    {/* Bottom controls */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        color: '#ffffff',
                        padding: '0 10px'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <button
                                onClick={handlePlayPause}
                                style={{
                                    background: 'rgba(0, 0, 0, 0.5)',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '48px',
                                    height: '48px',
                                    color: '#fff',
                                    cursor: 'pointer',
                                    padding: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    {isPlaying ? (
                                        <>
                                            <rect x="6" y="4" width="4" height="16" />
                                            <rect x="14" y="4" width="4" height="16" />
                                        </>
                                    ) : (
                                        <polygon points="5 3 19 12 5 21 5 3" />
                                    )}
                                </svg>
                            </button>
                            
                            <div style={{ fontSize: '16px', fontWeight: '500' }}>
                                {formatTime(watchTime)} / {formatTime(duration)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Watch time display */}
            <div className="watch-time" style={{
                padding: '20px',
                backgroundColor: isDarkMode ? '#2a2a2a' : '#ffffff',
                borderRadius: '12px',
                border: `1px solid ${isDarkMode ? '#3a3a3a' : '#e0e0e0'}`,
                fontSize: '1.1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: isDarkMode ? '0 2px 4px rgba(0,0,0,0.2)' : '0 2px 4px rgba(0,0,0,0.03)',
                transition: 'all 0.3s ease'
            }}>
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px',
                    color: isDarkMode ? '#ffffff' : '#000000'
                }}>
                    <span role="img" aria-label="timer" style={{ 
                        fontSize: '1.4rem',
                        filter: isDarkMode ? 'brightness(0.9)' : 'none'
                    }}>⏱️</span>
                    <span style={{ 
                        fontWeight: '600',
                        color: isDarkMode ? '#4CAF50' : '#000000'
                    }}>Watch Time:</span> 
                    <span style={{ 
                        color: isDarkMode ? '#ffffff' : '#000000',
                        opacity: 0.9
                    }}>
                        {Math.floor(watchTime / 60)} minutes {watchTime % 60} seconds
                    </span>
                </div>
                
                <div style={{ 
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    position: 'relative',
                    cursor: 'help',
                    padding: '8px',
                    borderRadius: '6px',
                    transition: 'background-color 0.2s ease',
                    '&:hover': {
                        backgroundColor: isDarkMode ? 'rgba(76, 175, 80, 0.1)' : 'rgba(0, 0, 0, 0.05)'
                    }
                }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" 
                        stroke={isDarkMode ? '#4CAF50' : '#000000'} 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="16" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                    <div style={{
                        position: 'absolute',
                        bottom: '100%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '250px',
                        background: isDarkMode ? '#2a2a2a' : '#ffffff',
                        color: isDarkMode ? '#ffffff' : '#000000',
                        padding: '14px',
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        boxShadow: isDarkMode ? '0 4px 12px rgba(0,0,0,0.3)' : '0 4px 12px rgba(0,0,0,0.1)',
                        opacity: 0,
                        visibility: 'hidden',
                        transition: 'opacity 0.3s, visibility 0.3s',
                        pointerEvents: 'none',
                        textAlign: 'center',
                        lineHeight: '1.5',
                        zIndex: 100,
                        border: `1px solid ${isDarkMode ? '#3a3a3a' : '#e0e0e0'}`
                    }}>
                        Watch for {REWARD_INTERVAL} seconds to earn a reward. Click the claim button to receive your tokens!
                    </div>
                </div>
            </div>

            {/* Claim reward button */}
            <div style={{
                marginTop: '20px',
                display: 'flex',
                justifyContent: 'center'
            }}>
                <button
                    onClick={handleClaimReward}
                    disabled={!canClaimReward || isClaiming}
                    style={{
                        backgroundColor: canClaimReward ? '#4CAF50' : 'rgba(76, 175, 80, 0.3)',
                        color: '#ffffff',
                        padding: '12px 24px',
                        borderRadius: '8px',
                        border: 'none',
                        cursor: canClaimReward && !isClaiming ? 'pointer' : 'not-allowed',
                        fontSize: '1.1rem',
                        fontWeight: '500',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        transition: 'all 0.2s ease',
                        opacity: isClaiming ? 0.7 : 1,
                        boxShadow: isDarkMode ? '0 2px 4px rgba(0,0,0,0.2)' : '0 2px 4px rgba(0,0,0,0.1)',
                        width: '100%',
                        justifyContent: 'center'
                    }}
                >
                    {isClaiming ? (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <path d="M12 6v6l4 2"></path>
                            </svg>
                            Claiming...
                        </>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6"></path>
                                <polyline points="4 8 12 2 20 8"></polyline>
                            </svg>
                            {canClaimReward ? 'Claim Reward' : `Watch ${10 - Math.min(watchTime, 10)}s more to claim`}
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

const VideoCard = ({ video, onClick }) => {
    return (
        <div className="video-card">
            <Thumbnail src={video.thumbnail} />
            <VideoInfo 
                title={video.title}
                creator={video.creator}
                views={video.views}
                duration={video.duration}
            />
            <RewardBadge amount={video.rewardAmount} />
        </div>
    );
};

const TokenBalance = ({ balance, onTransfer }) => {
    return (
        <div className="token-balance">
            <TokenIcon />
            <BalanceDisplay amount={balance} />
            <TransferButton onClick={onTransfer} />
            <TransactionHistory />
        </div>
    );
};

const AnalyticsDashboard = ({ data }) => {
    return (
        <div className="analytics-dashboard">
            <WatchTimeChart data={data.watchTime} />
            <EarningsChart data={data.earnings} />
            <EngagementMetrics data={data.engagement} />
            <Demographics data={data.demographics} />
        </div>
    );
};

export default EnhancedVideoPlayer;