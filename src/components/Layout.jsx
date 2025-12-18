import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import FloatingDecorations from './FloatingDecorations';

const Layout = () => {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Story-themed floating decorations */}
            <FloatingDecorations />

            <Navbar />
            <main className="flex-1 relative">
                {/* Decorative background elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200/30 dark:bg-primary-500/10 rounded-full blur-3xl" />
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-200/30 dark:bg-accent-500/10 rounded-full blur-3xl" />
                </div>

                {/* Content */}
                <div className="relative z-10">
                    <Outlet />
                </div>
            </main>

            {/* Footer */}
            <footer className="glass border-t border-white/20 dark:border-gray-700/50 py-4 mt-auto">
                <div className="max-w-6xl mx-auto px-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    <p>Dibuat dengan ❤️ untuk petualanganmu</p>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
