import { Routes, Route } from 'react-router-dom';
import Layout from '../components/Layout';
import HomePage from '../pages/HomePage';
import PlayPage from '../pages/PlayPage';
import EndingsPage from '../pages/EndingsPage';
import LoginPage from '../pages/LoginPage';
import SettingsPage from '../pages/SettingsPage';

const Router = () => {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="play" element={<PlayPage />} />
                <Route path="endings" element={<EndingsPage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="settings" element={<SettingsPage />} />
            </Route>
        </Routes>
    );
};

export default Router;
