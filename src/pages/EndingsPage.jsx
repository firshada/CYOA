import { useState } from 'react';
import { useEndings } from '../hooks/useEndings';
import { getStorylineById, getAllStorylines } from '../data/storylines';
import EndingCard from '../components/EndingCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const EndingsPage = () => {
    const {
        unlockedEndingIds,
        loading,
        isEndingUnlocked,
        currentStorylineId,
        setCurrentStorylineId
    } = useEndings();
    const [filter, setFilter] = useState('all'); // 'all', 'unlocked', 'locked'

    const storylines = getAllStorylines();
    const currentStoryline = getStorylineById(currentStorylineId);
    const endings = currentStoryline?.data?.endings || [];
    const totalEndings = endings.length;
    const unlockedCount = unlockedEndingIds.length;

    const filteredEndings = endings.filter(ending => {
        const unlocked = isEndingUnlocked(ending.id);
        if (filter === 'unlocked') return unlocked;
        if (filter === 'locked') return !unlocked;
        return true;
    });

    const filterButtons = [
        { key: 'all', label: 'Semua', count: totalEndings },
        { key: 'unlocked', label: 'Terbuka', count: unlockedCount },
        { key: 'locked', label: 'Terkunci', count: totalEndings - unlockedCount },
    ];

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="text-center mb-8 animate-fade-in">
                <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
                    Koleksi Ending
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Temukan semua akhir cerita yang mungkin
                </p>

                {/* Storyline Selector */}
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                    {storylines.map(story => (
                        <button
                            key={story.id}
                            onClick={() => setCurrentStorylineId(story.id)}
                            className={`px-4 py-2 rounded-full font-medium text-sm transition-all duration-200 flex items-center gap-2 ${currentStorylineId === story.id
                                    ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg'
                                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                        >
                            <span>{story.emoji}</span>
                            <span>{story.subtitle}</span>
                        </button>
                    ))}
                </div>

                {/* Progress */}
                {!loading && (
                    <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white dark:bg-gray-800 shadow-lg">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold">
                            {unlockedCount}
                        </div>
                        <div className="text-left">
                            <div className="text-sm text-gray-500 dark:text-gray-400">Terbuka</div>
                            <div className="font-semibold text-gray-700 dark:text-gray-200">{unlockedCount} dari {totalEndings}</div>
                        </div>
                    </div>
                )}
            </div>

            {/* Filter tabs */}
            <div className="flex justify-center gap-2 mb-8">
                {filterButtons.map(btn => (
                    <button
                        key={btn.key}
                        onClick={() => setFilter(btn.key)}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${filter === btn.key
                            ? 'bg-primary-500 text-white shadow-lg'
                            : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                    >
                        {btn.label} ({btn.count})
                    </button>
                ))}
            </div>

            {/* Loading */}
            {loading && (
                <div className="py-20">
                    <LoadingSpinner size="lg" />
                    <p className="text-center text-gray-500 dark:text-gray-400 mt-4">
                        Memuat koleksi...
                    </p>
                </div>
            )}

            {/* Endings grid */}
            {!loading && (
                <>
                    {filteredEndings.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="text-6xl mb-4">
                                {filter === 'unlocked' ? '🔍' : '🎉'}
                            </div>
                            <p className="text-gray-500 dark:text-gray-400">
                                {filter === 'unlocked'
                                    ? 'Belum ada ending yang terbuka. Mainkan cerita untuk membuka!'
                                    : 'Selamat! Semua ending sudah terbuka!'}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredEndings.map((ending, index) => (
                                <div
                                    key={ending.id}
                                    className="animate-slide-up"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <EndingCard
                                        ending={ending}
                                        isUnlocked={isEndingUnlocked(ending.id)}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* Completion celebration */}
            {!loading && unlockedCount === totalEndings && totalEndings > 0 && (
                <div className="mt-12 text-center animate-bounce-soft">
                    <div className="inline-flex flex-col items-center gap-4 p-8 rounded-2xl bg-gradient-to-r from-primary-100 to-accent-100 dark:from-primary-900/40 dark:to-accent-900/40">
                        <div className="text-5xl">🎊</div>
                        <h2 className="text-2xl font-bold gradient-text">Selamat!</h2>
                        <p className="text-gray-600 dark:text-gray-300">
                            Kamu telah menemukan semua ending di cerita ini!
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EndingsPage;
