import { Link } from 'react-router-dom';

const ErrorPage = ({ errors = [], title = 'Terjadi Kesalahan' }) => {
    return (
        <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-8">
            <div className="text-center max-w-lg mx-auto animate-fade-in">
                {/* Error illustration */}
                <div className="text-8xl mb-6">😵</div>

                {/* Title */}
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
                    {title}
                </h1>

                {/* Error messages */}
                {errors.length > 0 ? (
                    <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-left">
                        <p className="font-semibold text-red-700 dark:text-red-300 mb-2">
                            Masalah yang ditemukan:
                        </p>
                        <ul className="list-disc list-inside space-y-1">
                            {errors.map((error, index) => (
                                <li key={index} className="text-red-600 dark:text-red-400 text-sm">
                                    {error}
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                        Terjadi kesalahan yang tidak diketahui.
                    </p>
                )}

                {/* Action button */}
                <Link to="/" className="btn-gradient inline-flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Kembali ke Beranda
                </Link>
            </div>
        </div>
    );
};

export default ErrorPage;
