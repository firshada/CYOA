import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGame } from '../hooks/useGame';
import { useEndings } from '../hooks/useEndings';
import StoryNode from '../components/StoryNode';
import Confetti from '../components/Confetti';

const PlayPage = () => {
    const { currentStorylineId, unlockEnding, isEndingUnlocked } = useEndings();

    const {
        storyline,
        currentNode,
        currentNodeId,
        reachedEnding,
        isPlaying,
        startGame,
        selectChoice,
        restartGame
    } = useGame(currentStorylineId);

    const [showConfetti, setShowConfetti] = useState(false);
    const [isNewUnlock, setIsNewUnlock] = useState(false);

    // Start game on mount or when storyline changes
    useEffect(() => {
        startGame(currentStorylineId);
    }, [currentStorylineId]);

    // Handle ending reached
    useEffect(() => {
        if (reachedEnding) {
            const wasUnlocked = isEndingUnlocked(reachedEnding.id);
            if (!wasUnlocked) {
                setIsNewUnlock(true);
                setShowConfetti(true);
                unlockEnding(reachedEnding.id, currentStorylineId);
            }
        }
    }, [reachedEnding, isEndingUnlocked, unlockEnding, currentStorylineId]);

    // Reset state when restarting
    const handleRestart = () => {
        setShowConfetti(false);
        setIsNewUnlock(false);
        restartGame();
    };

    // Show ending screen
    if (reachedEnding) {
        return (
            <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-8">
                <Confetti isActive={showConfetti} onComplete={() => setShowConfetti(false)} />

                <div className="w-full max-w-lg mx-auto animate-slide-up">
                    {/* Ending card */}
                    <div className="card text-center">
                        {/* New unlock indicator */}
                        {isNewUnlock && (
                            <div className="mb-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                                <span className="text-lg">🎉</span>
                                <span className="font-semibold">Ending Baru Terbuka!</span>
                            </div>
                        )}

                        {/* Badge */}
                        <div className="mb-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary-100 to-accent-100 dark:from-primary-900/40 dark:to-accent-900/40">
                            <span className="text-xl">🏆</span>
                            <span className="font-bold text-primary-700 dark:text-primary-300">
                                {reachedEnding.badge}
                            </span>
                        </div>

                        {/* Title */}
                        <h2 className="text-3xl font-bold gradient-text mb-4">
                            {reachedEnding.title}
                        </h2>

                        {/* Text */}
                        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                            {reachedEnding.text}
                        </p>

                        {/* Hint */}
                        <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 mb-6">
                            <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                                💡 {reachedEnding.hint}
                            </p>
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <button
                                onClick={handleRestart}
                                className="btn-gradient inline-flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Main Lagi
                            </button>

                            <Link to="/" className="btn-secondary inline-flex items-center justify-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                                Kembali ke Beranda
                            </Link>
                        </div>
                    </div>

                    {/* View all endings link */}
                    <div className="mt-6 text-center">
                        <Link
                            to="/endings"
                            className="text-primary-600 dark:text-primary-400 hover:underline font-medium"
                        >
                            Lihat Semua Ending →
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Show game screen
    return (
        <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-8">
            <div className="w-full">
                {/* Header with storyline info and exit link */}
                <div className="max-w-2xl mx-auto mb-6">
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                        {storyline && (
                            <span className="flex items-center gap-2">
                                <span>{storyline.emoji}</span>
                                <span className="font-medium">{storyline.subtitle}</span>
                            </span>
                        )}
                        <Link to="/" className="hover:text-primary-500 transition-colors">
                            ← Keluar
                        </Link>
                    </div>
                </div>

                {/* Story node */}
                {currentNode && (
                    <StoryNode
                        node={currentNode}
                        onSelectChoice={selectChoice}
                        animationKey={currentNodeId}
                    />
                )}
            </div>
        </div>
    );
};

export default PlayPage;
