import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './providers/AuthProvider';
import { ThemeProvider } from './providers/ThemeProvider';
import { EndingsProvider } from '../hooks/useEndings';
import Router from './Router';
import storylineData from '../data/storyline.json';
import { validateStoryline } from '../lib/validator';
import ErrorPage from '../pages/ErrorPage';

// Validate storyline on app load
const validation = validateStoryline(storylineData);

const App = () => {
    // Show error page if storyline is invalid
    if (!validation.valid) {
        return (
            <ThemeProvider>
                <div className="min-h-screen">
                    <ErrorPage
                        title="Data Cerita Tidak Valid"
                        errors={validation.errors}
                    />
                </div>
            </ThemeProvider>
        );
    }

    return (
        <BrowserRouter>
            <ThemeProvider>
                <AuthProvider>
                    <EndingsProvider>
                        <Router />
                    </EndingsProvider>
                </AuthProvider>
            </ThemeProvider>
        </BrowserRouter>
    );
};

export default App;
