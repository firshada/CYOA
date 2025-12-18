import { Link } from 'react-router-dom';
import { useEndings } from '../hooks/useEndings';
import { getAllStorylines, getStorylineById } from '../data/storylines';

const HomePage = () => {
    const { unlockedEndingIds, loading, currentStorylineId, setCurrentStorylineId } = useEndings();
    const storylines = getAllStorylines();
    const currentStory = getStorylineById(currentStorylineId);

    return (
        <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-8">
            <div className="text-center max-w-3xl mx-auto animate-fade-in">
                {/* Hero illustration */}
                <div className="mb-8 relative">
                    <div className="text-8xl md:text-9xl animate-bounce-soft">📖</div>
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-32 h-4 bg-gray-200 dark:bg-gray-700 rounded-full blur-lg opacity-50" />
                </div>

                {/* Title */}
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    <span className="gradient-text">Petualangan</span>
                    <br />
                    <span className="text-gray-700 dark:text-white">Pilihanmu</span>
                </h1>

                {/* Subtitle */}
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-10 leading-relaxed">
                    Setiap pilihan membawamu ke jalan berbeda.
                    <br />
                    Pilih ceritamu dan mulai petualangan!
                </p>

                {/* Story Selection Cards */}
                <div className="grid md:grid-cols-2 gap-4 mb-10 max-w-2xl mx-auto">
                    {storylines.map((story) => {
                        const isSelected = currentStorylineId === story.id;
                        return (
                            <button
                                key={story.id}
                                onClick={() => setCurrentStorylineId(story.id)}
                                className={`card text-left p-5 transition-all duration-300 ${isSelected
                                        ? 'ring-2 ring-primary-500 shadow-lg scale-[1.02]'
                                        : 'hover:shadow-lg hover:scale-[1.01] opacity-80 hover:opacity-100'
                                    }`}
                            >
                                <div className="flex items-start gap-4">
                                    <span className="text-4xl">{story.emoji}</span>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg text-gray-800 dark:text-white">
                                            {story.title}
                                        </h3>
                                        <p className="text-sm font-medium text-primary-600 dark:text-primary-400 mb-1">
                                            {story.subtitle}
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 line-clamp-2">
                                            {story.description}
                                        </p>
                                        <p className="text-xs text-gray-400 dark:text-gray-500">
                                            {story.nodeCount} momen cerita • {story.endingCount} ending
                                        </p>
                                    </div>
                                    {isSelected && (
                                        <div className="text-primary-500">
                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/play" className="btn-gradient inline-flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Mulai Main
                    </Link>

                    <Link to="/endings" className="btn-secondary inline-flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        Koleksi Ending
                    </Link>
                </div>

                {/* Current story info */}
                {currentStory && !loading && (
                    <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
                        <p>Cerita dipilih: <span className="font-semibold text-primary-600 dark:text-primary-400">{currentStory.title} - {currentStory.subtitle}</span></p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomePage;
