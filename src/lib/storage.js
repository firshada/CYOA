const STORAGE_KEY = 'cyoa_unlocked_endings';
const THEME_KEY = 'cyoa_theme';

/**
 * Get guest unlocked endings from localStorage
 * @returns {string[]} Array of ending IDs
 */
export const getGuestEndings = () => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            return Array.isArray(parsed) ? parsed : [];
        }
        return [];
    } catch (error) {
        console.error('Error reading guest endings:', error);
        return [];
    }
};

/**
 * Set guest unlocked endings in localStorage
 * @param {string[]} endings - Array of ending IDs
 */
export const setGuestEndings = (endings) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(endings));
    } catch (error) {
        console.error('Error saving guest endings:', error);
    }
};

/**
 * Add a single ending to guest progress
 * @param {string} endingId - The ending ID to add
 * @returns {string[]} Updated array of ending IDs
 */
export const addGuestEnding = (endingId) => {
    const current = getGuestEndings();
    if (!current.includes(endingId)) {
        const updated = [...current, endingId];
        setGuestEndings(updated);
        return updated;
    }
    return current;
};

/**
 * Clear all guest endings from localStorage
 */
export const clearGuestEndings = () => {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
        console.error('Error clearing guest endings:', error);
    }
};

/**
 * Get the current theme from localStorage
 * @returns {'light' | 'dark'} The current theme
 */
export const getTheme = () => {
    try {
        const stored = localStorage.getItem(THEME_KEY);
        if (stored === 'dark' || stored === 'light') {
            return stored;
        }
        // Check system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    } catch (error) {
        return 'light';
    }
};

/**
 * Set the theme in localStorage
 * @param {'light' | 'dark'} theme - The theme to set
 */
export const setTheme = (theme) => {
    try {
        localStorage.setItem(THEME_KEY, theme);
    } catch (error) {
        console.error('Error saving theme:', error);
    }
};
