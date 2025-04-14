import { useEffect, useRef, useState } from 'react';

const useWatchTime = (videoRef) => {
    const [watchTime, setWatchTime] = useState(0);
    const intervalRef = useRef(null);

    useEffect(() => {
        const handleTimeUpdate = () => {
            if (videoRef.current) {
                setWatchTime(Math.floor(videoRef.current.currentTime));
            }
        };

        const handlePlay = () => {
            intervalRef.current = setInterval(handleTimeUpdate, 1000);
        };

        const handlePause = () => {
            clearInterval(intervalRef.current);
        };

        const handleEnded = () => {
            clearInterval(intervalRef.current);
        };

        const videoElement = videoRef.current;

        if (videoElement) {
            videoElement.addEventListener('play', handlePlay);
            videoElement.addEventListener('pause', handlePause);
            videoElement.addEventListener('ended', handleEnded);
        }

        return () => {
            clearInterval(intervalRef.current);
            if (videoElement) {
                videoElement.removeEventListener('play', handlePlay);
                videoElement.removeEventListener('pause', handlePause);
                videoElement.removeEventListener('ended', handleEnded);
            }
        };
    }, [videoRef]);

    return watchTime;
};

export default useWatchTime;