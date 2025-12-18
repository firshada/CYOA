import { useState, useEffect } from 'react';

const StoryNode = ({ node, onSelectChoice, animationKey }) => {
    const [isAnimating, setIsAnimating] = useState(true);

    useEffect(() => {
        setIsAnimating(true);
        const timer = setTimeout(() => setIsAnimating(false), 500);
        return () => clearTimeout(timer);
    }, [animationKey]);

    if (!node) return null;

    return (
        <div className={`w-full max-w-2xl mx-auto ${isAnimating ? 'animate-slide-up' : ''}`}>
            {/* Story text card */}
            <div className="card mb-6">
                <p className="text-lg md:text-xl text-gray-700 dark:text-gray-200 leading-relaxed">
                    {node.text}
                </p>
            </div>

            {/* Choices */}
            <div className="space-y-4">
                {node.choices.map((choice, index) => (
                    <button
                        key={index}
                        onClick={() => onSelectChoice(choice)}
                        className="choice-btn w-full text-left p-4 md:p-5 rounded-xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-primary-400 dark:hover:border-primary-500 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <div className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-primary-400 to-accent-400 flex items-center justify-center text-white font-bold text-sm">
                                {index === 0 ? 'A' : 'B'}
                            </span>
                            <span className="text-gray-700 dark:text-gray-200 font-medium">
                                {choice.label.replace(/^[AB]:\s*/, '')}
                            </span>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default StoryNode;
