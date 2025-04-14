
import React, { useState, useEffect } from 'react';

/**
 * Toast notification component
 * @param {Object} props - Component props
 * @param {string} props.type - 'success', 'error', 'info', 'warning'
 * @param {string} props.message - Notification message
 * @param {number} props.duration - Duration in ms
 * @param {Function} props.onClose - Close callback
 */
export const Toast = ({ type = 'info', message, duration = 3000, onClose }) => {
    const [isVisible, setIsVisible] = useState(true);
    
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300); // Allow time for exit animation
        }, duration);
        
        return () => clearTimeout(timer);
    }, [duration, onClose]);
    
    // Toast styles
    const getToastStyles = () => {
        const baseStyles = {
            padding: '12px 20px',
            borderRadius: '8px',
            marginBottom: '10px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: 'white',
            fontSize: '0.9rem',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(-20px)',
            transition: 'opacity 0.3s ease, transform 0.3s ease',
            width: '300px',
            maxWidth: '90vw'
        };
        
        // Type-specific styles
        const typeStyles = {
            success: {
                backgroundColor: '#65a30d',
                borderLeft: '4px solid #4d7c0f'
            },
            error: {
                backgroundColor: '#ef4444',
                borderLeft: '4px solid #b91c1c'
            },
            info: {
                backgroundColor: '#3a86ff',
                borderLeft: '4px solid #2563eb'
            },
            warning: {
                backgroundColor: '#f59e0b',
                borderLeft: '4px solid #d97706'
            }
        };
        
        return { ...baseStyles, ...typeStyles[type] };
    };
    
    // Icon based on type
    const getIcon = () => {
        const icons = {
            success: (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
            ),
            error: (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="15" y1="9" x2="9" y2="15"></line>
                    <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
            ),
            info: (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
            ),
            warning: (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
            )
        };
        
        return icons[type];
    };
    
    return (
        <div style={getToastStyles()}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {getIcon()}
                <span>{message}</span>
            </div>
            <button
                onClick={() => {
                    setIsVisible(false);
                    setTimeout(onClose, 300);
                }}
                style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'white',
                    opacity: 0.7,
                    cursor: 'pointer',
                    padding: '0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        </div>
    );
};

/**
 * Toast notification container and manager
 */
const NotificationSystem = () => {
    const [notifications, setNotifications] = useState([]);
    
    // Add new notification
    const addNotification = (notification) => {
        const id = Date.now();
        setNotifications(prev => [...prev, { ...notification, id }]);
        return id;
    };
    
    // Remove notification by id
    const removeNotification = (id) => {
        setNotifications(prev => prev.filter(notification => notification.id !== id));
    };
    
    // Expose methods globally
    useEffect(() => {
        window.notifications = {
            success: (message, duration) => 
                addNotification({ type: 'success', message, duration }),
            error: (message, duration) => 
                addNotification({ type: 'error', message, duration }),
            info: (message, duration) => 
                addNotification({ type: 'info', message, duration }),
            warning: (message, duration) => 
                addNotification({ type: 'warning', message, duration }),
            remove: removeNotification
        };
        
        return () => {
            delete window.notifications;
        };
    }, []);
    
    return (
        <div style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end'
        }}>
            {notifications.map(notification => (
                <Toast
                    key={notification.id}
                    type={notification.type}
                    message={notification.message}
                    duration={notification.duration}
                    onClose={() => removeNotification(notification.id)}
                />
            ))}
        </div>
    );
};

export default NotificationSystem;