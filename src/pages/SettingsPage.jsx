import { useState } from 'react';
import { useAuth } from '../app/providers/AuthProvider';
import { useTheme } from '../app/providers/ThemeProvider';
import { useEndings } from '../hooks/useEndings';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const SettingsPage = () => {
    const { user } = useAuth();
    const { theme, setTheme } = useTheme();
    const { resetProgress, unlockedEndingIds, loading } = useEndings();

    const [showResetConfirm, setShowResetConfirm] = useState(false);
    const [isResetting, setIsResetting] = useState(false);
    const [resetSuccess, setResetSuccess] = useState(false);

    const handleReset = async () => {
        setIsResetting(true);
        try {
            await resetProgress();
            setResetSuccess(true);
            setShowResetConfirm(false);
            setTimeout(() => setResetSuccess(false), 3000);
        } catch (error) {
            console.error('Error resetting progress:', error);
        } finally {
            setIsResetting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="text-center mb-8 animate-fade-in">
                <h1 className="text-3xl font-bold gradient-text mb-2">Pengaturan</h1>
                <p className="text-gray-600 dark:text-gray-300">
                    Kelola preferensi dan progresmu
                </p>
            </div>

            <div className="space-y-6">
                {/* Account info */}
                <div className="card animate-slide-up">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-400 to-accent-400 flex items-center justify-center text-white text-xl">
                            {user ? user.email?.[0]?.toUpperCase() : '👤'}
                        </div>
                        <div>
                            <h2 className="font-semibold text-gray-800 dark:text-white">
                                {user ? 'Akun Terdaftar' : 'Mode Tamu'}
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {user ? user.email : 'Progres disimpan di browser ini'}
                            </p>
                        </div>
                    </div>

                    {!user && (
                        <a
                            href="/login"
                            className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:underline text-sm font-medium"
                        >
                            Masuk untuk menyimpan progres
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </a>
                    )}
                </div>

                {/* Theme toggle */}
                <div className="card animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    <h3 className="font-semibold text-gray-800 dark:text-white mb-4">
                        Tampilan
                    </h3>

                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-gray-700 dark:text-gray-200">Tema</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Pilih mode terang atau gelap
                            </p>
                        </div>

                        <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
                            <button
                                onClick={() => setTheme('light')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${theme === 'light'
                                        ? 'bg-white dark:bg-gray-700 text-gray-800 dark:text-white shadow'
                                        : 'text-gray-500 dark:text-gray-400'
                                    }`}
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0z" />
                                </svg>
                                Terang
                            </button>
                            <button
                                onClick={() => setTheme('dark')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${theme === 'dark'
                                        ? 'bg-white dark:bg-gray-700 text-gray-800 dark:text-white shadow'
                                        : 'text-gray-500 dark:text-gray-400'
                                    }`}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                </svg>
                                Gelap
                            </button>
                        </div>
                    </div>
                </div>

                {/* Progress section */}
                <div className="card animate-slide-up" style={{ animationDelay: '0.2s' }}>
                    <h3 className="font-semibold text-gray-800 dark:text-white mb-4">
                        Progres
                    </h3>

                    {/* Current progress */}
                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                        <div>
                            <p className="font-medium text-gray-700 dark:text-gray-200">Ending Terbuka</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {loading ? 'Memuat...' : `${unlockedEndingIds.length} ending`}
                            </p>
                        </div>
                        {loading && <LoadingSpinner size="sm" />}
                    </div>

                    {/* Reset button */}
                    <div>
                        <p className="font-medium text-gray-700 dark:text-gray-200 mb-1">Reset Progres</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                            {user
                                ? 'Hapus semua ending yang sudah terbuka dari akunmu.'
                                : 'Hapus semua ending yang sudah terbuka dari browser ini.'}
                        </p>

                        {!showResetConfirm ? (
                            <button
                                onClick={() => setShowResetConfirm(true)}
                                disabled={unlockedEndingIds.length === 0}
                                className="px-4 py-2 rounded-lg border-2 border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Reset Progres
                            </button>
                        ) : (
                            <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                                <p className="text-red-700 dark:text-red-300 font-medium mb-3">
                                    Yakin ingin menghapus semua progres?
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleReset}
                                        disabled={isResetting}
                                        className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium text-sm transition-colors flex items-center gap-2"
                                    >
                                        {isResetting ? (
                                            <>
                                                <LoadingSpinner size="sm" />
                                                <span>Menghapus...</span>
                                            </>
                                        ) : (
                                            'Ya, Hapus'
                                        )}
                                    </button>
                                    <button
                                        onClick={() => setShowResetConfirm(false)}
                                        disabled={isResetting}
                                        className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium text-sm transition-colors"
                                    >
                                        Batal
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Success message */}
                    {resetSuccess && (
                        <div className="mt-4 p-3 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm">
                            ✓ Progres berhasil dihapus!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
