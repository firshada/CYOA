import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../app/providers/AuthProvider';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const LoginPage = () => {
    const [activeTab, setActiveTab] = useState('signin'); // 'signin' | 'signup'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const { signIn, signUp, user } = useAuth();
    const navigate = useNavigate();

    // Redirect if already logged in
    if (user) {
        navigate('/');
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            if (activeTab === 'signin') {
                await signIn(email, password);
                navigate('/');
            } else {
                await signUp(email, password);
                setSuccess('Pendaftaran berhasil! Silakan cek email untuk verifikasi.');
                setEmail('');
                setPassword('');
            }
        } catch (err) {
            let message = 'Terjadi kesalahan. Silakan coba lagi.';

            if (err.message) {
                if (err.message.includes('Invalid login credentials')) {
                    message = 'Email atau password salah.';
                } else if (err.message.includes('Email not confirmed')) {
                    message = 'Email belum diverifikasi. Silakan cek inbox Anda.';
                } else if (err.message.includes('User already registered')) {
                    message = 'Email sudah terdaftar. Silakan masuk.';
                } else if (err.message.includes('Password should be at least')) {
                    message = 'Password minimal 6 karakter.';
                } else if (err.message.includes('Invalid email')) {
                    message = 'Format email tidak valid.';
                }
            }

            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-md animate-slide-up">
                <div className="card">
                    {/* Header */}
                    <div className="text-center mb-6">
                        <div className="text-4xl mb-3">👋</div>
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                            {activeTab === 'signin' ? 'Selamat Datang!' : 'Buat Akun'}
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                            {activeTab === 'signin'
                                ? 'Masuk untuk menyimpan progresmu'
                                : 'Daftar untuk menyimpan progresmu'}
                        </p>
                    </div>

                    {/* Tabs */}
                    <div className="flex mb-6 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        <button
                            onClick={() => { setActiveTab('signin'); setError(''); setSuccess(''); }}
                            className={`flex-1 py-2 rounded-md font-medium text-sm transition-all ${activeTab === 'signin'
                                    ? 'bg-white dark:bg-gray-700 text-gray-800 dark:text-white shadow'
                                    : 'text-gray-500 dark:text-gray-400'
                                }`}
                        >
                            Masuk
                        </button>
                        <button
                            onClick={() => { setActiveTab('signup'); setError(''); setSuccess(''); }}
                            className={`flex-1 py-2 rounded-md font-medium text-sm transition-all ${activeTab === 'signup'
                                    ? 'bg-white dark:bg-gray-700 text-gray-800 dark:text-white shadow'
                                    : 'text-gray-500 dark:text-gray-400'
                                }`}
                        >
                            Daftar
                        </button>
                    </div>

                    {/* Error message */}
                    {error && (
                        <div className="mb-4 p-3 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Success message */}
                    {success && (
                        <div className="mb-4 p-3 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm">
                            {success}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                placeholder="nama@email.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-gradient disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <LoadingSpinner size="sm" />
                                    <span>Memproses...</span>
                                </>
                            ) : (
                                <span>{activeTab === 'signin' ? 'Masuk' : 'Daftar'}</span>
                            )}
                        </button>
                    </form>

                    {/* Guest info */}
                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Atau lanjutkan sebagai tamu.
                            <br />
                            Progres akan disimpan di browser ini saja.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
