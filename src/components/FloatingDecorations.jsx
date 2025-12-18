import { useEffect, useState } from 'react';

const OFFICE_EMOJIS = ['☕', '💬', '💭', '📝', '💼', '🏢', '💕', '✨', '📱', '🌸'];

const FloatingDecorations = ({ variant = 'default' }) => {
    const [decorations, setDecorations] = useState([]);

    useEffect(() => {
        // Generate floating decorations based on variant
        const count = variant === 'gameplay' ? 6 : 8;
        const items = [];

        for (let i = 0; i < count; i++) {
            items.push({
                id: i,
                emoji: OFFICE_EMOJIS[Math.floor(Math.random() * OFFICE_EMOJIS.length)],
                left: `${Math.random() * 90 + 5}%`,
                top: `${Math.random() * 70 + 15}%`,
                delay: Math.random() * 5,
                duration: 10 + Math.random() * 10,
                size: 1 + Math.random() * 1.5,
                opacity: 0.1 + Math.random() * 0.15,
            });
        }

        setDecorations(items);
    }, [variant]);

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
            {decorations.map((item) => (
                <div
                    key={item.id}
                    className="absolute animate-float-slow"
                    style={{
                        left: item.left,
                        top: item.top,
                        fontSize: `${item.size}rem`,
                        opacity: item.opacity,
                        animationDelay: `${item.delay}s`,
                        animationDuration: `${item.duration}s`,
                    }}
                >
                    {item.emoji}
                </div>
            ))}

            {/* Subtle gradient orbs */}
            <div
                className="absolute w-64 h-64 rounded-full bg-gradient-to-r from-pink-500/10 to-purple-500/10 blur-3xl animate-pulse-soft"
                style={{
                    left: '10%',
                    top: '20%',
                    animationDuration: '8s',
                }}
            />
            <div
                className="absolute w-48 h-48 rounded-full bg-gradient-to-r from-primary-500/10 to-accent-500/10 blur-3xl animate-pulse-soft"
                style={{
                    right: '15%',
                    bottom: '30%',
                    animationDelay: '2s',
                    animationDuration: '10s',
                }}
            />
        </div>
    );
};

export default FloatingDecorations;
