
import React from 'react';

const LoadingSpinner = ({ size = 40, color = '#3a86ff', thickness = 4 }) => {
    return (
        <div 
            style={{
                display: 'inline-block',
                position: 'relative',
                width: `${size}px`,
                height: `${size}px`
            }}
        >
            <svg 
                viewBox="0 0 100 100" 
                xmlns="http://www.w3.org/2000/svg"
                style={{
                    animation: 'rotate 2s linear infinite',
                    width: '100%',
                    height: '100%',
                    transformOrigin: 'center center',
                }}
            >
                <style>
                    {`
                    @keyframes rotate {
                        100% {
                            transform: rotate(360deg);
                        }
                    }
                    @keyframes dash {
                        0% {
                            stroke-dasharray: 1, 200;
                            stroke-dashoffset: 0;
                        }
                        50% {
                            stroke-dasharray: 89, 200;
                            stroke-dashoffset: -35px;
                        }
                        100% {
                            stroke-dasharray: 89, 200;
                            stroke-dashoffset: -124px;
                        }
                    }
                    `}
                </style>
                <circle 
                    cx="50" 
                    cy="50" 
                    r="45"
                    fill="none"
                    stroke={color}
                    strokeWidth={thickness}
                    strokeLinecap="round"
                    style={{
                        animation: 'dash 1.5s ease-in-out infinite',
                        strokeDasharray: '90, 200',
                        strokeDashoffset: 0,
                    }}
                />
            </svg>
        </div>
    );
};

export default LoadingSpinner;