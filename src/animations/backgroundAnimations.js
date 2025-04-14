
import React, { useEffect, useRef } from 'react';

/**
 * Creates a gradient background animation that shifts colors
 * @param {Array} colors - Array of color values to transition between
 * @param {number} duration - Time in seconds for full animation cycle
 * @returns {React.Component} Component with animated background
 */
export const GradientBackground = ({ colors = ['#2563eb', '#4f46e5', '#7e22ce', '#3a86ff'], duration = 15 }) => {
    const containerRef = useRef(null);
    
    useEffect(() => {
        if (!containerRef.current) return;
        
        const container = containerRef.current;
        
        // Set up keyframes and animation
        const keyframes = colors.map((color, index) => {
            const percentage = (index / (colors.length - 1)) * 100;
            return `${percentage}% { background-color: ${color}; }`;
        }).join(' ');
        
        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes gradientShift {
                ${keyframes}
            }
        `;
        document.head.appendChild(style);
        
        // Apply animation to container
        container.style.animation = `gradientShift ${duration}s infinite ease-in-out`;
        container.style.backgroundSize = '400% 400%';
        container.style.transition = 'background-color 0.5s ease';
        
        return () => {
            document.head.removeChild(style);
        };
    }, [colors, duration]);
    
    return (
        <div 
            ref={containerRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: -1,
                opacity: 0.8,
                background: colors[0]
            }}
        />
    );
};

/**
 * Particle effect background that responds to user interactions
 * @param {number} particleCount - Number of particles to render
 * @param {string} color - Base color of particles 
 * @returns {React.Component} Particle animation component
 */
export const ParticleBackground = ({ particleCount = 50, color = '#3a86ff' }) => {
    const canvasRef = useRef(null);
    
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        let particles = [];
        let animationFrame;
        let mouseX = 0;
        let mouseY = 0;
        
        // Set canvas dimensions
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        
        // Track mouse movement
        const handleMouseMove = (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        };
        
        window.addEventListener('mousemove', handleMouseMove);
        
        // Particle class
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 3 + 1;
                this.speedX = Math.random() * 1 - 0.5;
                this.speedY = Math.random() * 1 - 0.5;
                this.color = color;
                this.alpha = Math.random() * 0.5 + 0.1;
            }
            
            update() {
                // Move particles
                this.x += this.speedX;
                this.y += this.speedY;
                
                // React to mouse (gently pull towards mouse)
                const dx = mouseX - this.x;
                const dy = mouseY - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    const angle = Math.atan2(dy, dx);
                    const force = (150 - distance) / 1500;
                    this.speedX += Math.cos(angle) * force;
                    this.speedY += Math.sin(angle) * force;
                }
                
                // Add some resistance
                this.speedX *= 0.99;
                this.speedY *= 0.99;
                
                // Bounce off edges
                if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
            }
            
            draw() {
                ctx.globalAlpha = this.alpha;
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1;
            }
        }
        
        // Initialize particles
        const init = () => {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        };
        
        // Animation loop
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
            }
            
            animationFrame = requestAnimationFrame(animate);
        };
        
        init();
        animate();
        
        return () => {
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrame);
        };
    }, [particleCount, color]);
    
    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: -1,
                pointerEvents: 'none'
            }}
        />
    );
};

/**
 * Creates a celebration animation when rewards are earned
 * @param {boolean} isActive - Whether to show the celebration
 * @param {number} duration - Duration of celebration in ms
 * @returns {React.Component} Celebration animation component
 */
export const CelebrationAnimation = ({ isActive, duration = 3000 }) => {
    const containerRef = useRef(null);
    
    useEffect(() => {
        if (!isActive || !containerRef.current) return;
        
        const container = containerRef.current;
        const confettiCount = 150;
        const confettiColors = ['#3a86ff', '#4f46e5', '#7e22ce', '#fbbf24', '#ef4444'];
        
        // Create confetti elements
        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            const size = Math.random() * 10 + 5;
            const color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
            
            // Randomize confetti properties
            confetti.style.position = 'absolute';
            confetti.style.width = `${size}px`;
            confetti.style.height = `${size}px`;
            confetti.style.backgroundColor = color;
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            confetti.style.top = '-10px';
            confetti.style.left = `${Math.random() * 100}%`;
            confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
            confetti.style.opacity = Math.random() * 0.5 + 0.5;
            
            // Animation
            confetti.animate([
                { 
                    transform: `translate(${Math.random() * 100 - 50}px, 0) rotate(0deg)`,
                    opacity: 1 
                },
                { 
                    transform: `translate(${Math.random() * 400 - 200}px, ${window.innerHeight}px) rotate(${Math.random() * 720}deg)`,
                    opacity: 0 
                }
            ], {
                duration: Math.random() * 3000 + 2000,
                easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
                fill: 'forwards'
            });
            
            container.appendChild(confetti);
        }
        
        // Clean up
        const timeout = setTimeout(() => {
            while (container.firstChild) {
                container.removeChild(container.firstChild);
            }
        }, duration);
        
        return () => {
            clearTimeout(timeout);
            while (container.firstChild) {
                container.removeChild(container.firstChild);
            }
        };
    }, [isActive, duration]);
    
    return (
        <div
            ref={containerRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 1000,
                overflow: 'hidden'
            }}
        />
    );
};