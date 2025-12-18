const EndingCard = ({ ending, isUnlocked }) => {
    return (
        <div className={`card relative overflow-hidden transition-all duration-300 ${isUnlocked ? 'card-hover' : ''
            }`}>
            {/* Locked overlay */}
            {!isUnlocked && (
                <div className="locked-overlay">
                    <div className="text-center">
                        <div className="text-4xl mb-2">🔒</div>
                        <p className="text-gray-500 dark:text-gray-400 font-medium">Terkunci</p>
                    </div>
                </div>
            )}

            {/* Shimmer effect for locked cards */}
            {!isUnlocked && (
                <div className="absolute inset-0 shimmer" />
            )}

            {/* Content */}
            <div className={!isUnlocked ? 'blur-sm select-none' : ''}>
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-primary-100 to-accent-100 dark:from-primary-900/40 dark:to-accent-900/40 mb-3">
                    <span className="text-sm">🏆</span>
                    <span className="text-sm font-semibold text-primary-700 dark:text-primary-300">
                        {isUnlocked ? ending.badge : '???'}
                    </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                    {isUnlocked ? ending.title : '???'}
                </h3>

                {/* Text */}
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {isUnlocked ? ending.text : 'Temukan ending ini untuk membuka ceritanya...'}
                </p>

                {/* Hint */}
                <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                        <span className="font-medium">💡 Hint:</span> {ending.hint}
                    </p>
                </div>
            </div>

            {/* Unlocked indicator */}
            {isUnlocked && (
                <div className="absolute top-4 right-4">
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EndingCard;
