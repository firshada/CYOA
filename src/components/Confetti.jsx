import { useEffect, useState } from 'react';

const Confetti = ({ isActive, onComplete }) => {
    const [pieces, setPieces] = useState([]);

    useEffect(() => {
        if (isActive) {
            // Generate confetti pieces
            const colors = ['#0ea5e9', '#d946ef', '#22c55e', '#eab308', '#ef4444', '#8b5cf6'];
            const newPieces = [];

            for (let i = 0; i < 50; i++) {
                newPieces.push({
                    id: i,
                    left: Math.random() * 100,
                    delay: Math.random() * 0.5,
                    duration: 1.5 + Math.random() * 1,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    rotation: Math.random() * 360,
                    size: 8 + Math.random() * 8,
                });
            }

            setPieces(newPieces);

            // Clear after animation
            const timer = setTimeout(() => {
                setPieces([]);
                if (onComplete) onComplete();
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [isActive, onComplete]);

    if (!isActive || pieces.length === 0) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {pieces.map((piece) => (
                <div
                    key={piece.id}
                    className="absolute top-0"
                    style={{
                        left: `${piece.left}%`,
                        width: `${piece.size}px`,
                        height: `${piece.size}px`,
                        backgroundColor: piece.color,
                        borderRadius: '2px',
                        transform: `rotate(${piece.rotation}deg)`,
                        animation: `confetti ${piece.duration}s ease-out ${piece.delay}s forwards`,
                    }}
                />
            ))}
        </div>
    );
};

export default Confetti;
