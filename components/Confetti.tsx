import React, { useMemo } from 'react';

const ConfettiParticle: React.FC<{ style: React.CSSProperties }> = ({ style }) => (
    <div className="absolute w-2 h-2 rounded-full" style={style}></div>
);

const Confetti: React.FC = () => {
    const particles = useMemo(() => {
        const particleCount = 50;
        const colors = ['#4f46e5', '#7c3aed', '#ec4899', '#f59e0b', '#10b981'];
        return Array.from({ length: particleCount }).map((_, index) => {
            const randomX = Math.random() * 100; // vw
            const randomY = -20 - Math.random() * 50; // Start off-screen
            const randomDelay = Math.random() * 2; // seconds
            const randomDuration = 3 + Math.random() * 2; // seconds
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            const randomRotation = Math.random() * 360;

            const style: React.CSSProperties = {
                left: `${randomX}vw`,
                top: `${randomY}px`,
                backgroundColor: randomColor,
                animationName: 'fall',
                animationDuration: `${randomDuration}s`,
                animationDelay: `${randomDelay}s`,
                animationTimingFunction: 'linear',
                animationIterationCount: '1',
                transform: `rotate(${randomRotation}deg)`,
            };
            return <ConfettiParticle key={index} style={style} />;
        });
    }, []);

    return (
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[100] overflow-hidden">
            <style>
                {`
                @keyframes fall {
                    0% {
                        transform: translateY(0vh) rotate(0deg);
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(110vh) rotate(720deg);
                        opacity: 0;
                    }
                }
                `}
            </style>
            {particles}
        </div>
    );
};

export default Confetti;
