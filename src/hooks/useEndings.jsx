import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from '../app/providers/AuthProvider';
import { getGuestEndings, setGuestEndings, addGuestEnding, clearGuestEndings } from '../lib/storage';
import { getUnlockedEndings, unlockEnding as apiUnlockEnding, resetUnlockedEndings } from '../lib/api';
import { getStorylineById, getDefaultStorylineId } from '../data/storylines';

const EndingsContext = createContext({
    unlockedEndingIds: [],
    loading: true,
    currentStorylineId: 'pdkt-awal',
    setCurrentStorylineId: () => { },
    unlockEnding: async () => { },
    resetProgress: async () => { },
    isEndingUnlocked: () => false,
    refreshEndings: async () => { },
});

export const useEndings = () => {
    const context = useContext(EndingsContext);
    if (!context) {
        throw new Error('useEndings must be used within an EndingsProvider');
    }
    return context;
};

// Helper to get storage key per storyline
const getStorageKey = (storylineId) => `endings_${storylineId}`;

export const EndingsProvider = ({ children }) => {
    const { user } = useAuth();
    const [unlockedEndingIds, setUnlockedEndingIds] = useState([]);
    const [loading, setLoading] = useState(true);
    // Initialize storyline ID from localStorage if available, but validate it exists
    const [currentStorylineId, setCurrentStorylineId] = useState(() => {
        const persisted = localStorage.getItem('last_played_story_id');
        if (persisted && getStorylineById(persisted)) {
            return persisted;
        }
        return getDefaultStorylineId();
    });

    // Save current storyline ID when it changes
    useEffect(() => {
        localStorage.setItem('last_played_story_id', currentStorylineId);
    }, [currentStorylineId]);

    const refreshEndings = useCallback(async (storylineId = currentStorylineId) => {
        setLoading(true);
        // Safety timeout to prevent infinite loading
        const timeoutId = setTimeout(() => {
            setLoading(false);
        }, 5000);

        try {
            // ALWAYS fetch from localStorage first (Local-First strategy)
            const storageKey = getStorageKey(storylineId);
            const stored = localStorage.getItem(storageKey);
            const localEndings = stored ? JSON.parse(stored) : [];

            let finalEndings = localEndings;

            if (user) {
                // Logged in: fetch from Supabase and MERGE
                try {
                    const apiEndings = await getUnlockedEndings(user.id, storylineId);
                    // Merge local and API endings (deduped)
                    finalEndings = [...new Set([...localEndings, ...apiEndings])];

                    // Optional: Sync local unlock back to LS if API had more
                    if (finalEndings.length > localEndings.length) {
                        localStorage.setItem(storageKey, JSON.stringify(finalEndings));
                    }
                } catch (apiErr) {
                    console.error('Error fetching from valid Supabase story, using local only:', apiErr);
                }
            }

            setUnlockedEndingIds(finalEndings);
        } catch (error) {
            console.error('Error refreshing endings:', error);
        } finally {
            clearTimeout(timeoutId);
            setLoading(false);
        }
    }, [user, currentStorylineId]);

    // Refresh when user or storyline changes
    useEffect(() => {
        refreshEndings(currentStorylineId);
    }, [currentStorylineId, user]);

    const unlockEnding = useCallback(async (endingId, storylineId = currentStorylineId) => {
        // Optimistic update
        if (!unlockedEndingIds.includes(endingId)) {
            setUnlockedEndingIds(prev => [...prev, endingId]);
        }

        // 1. ALWAYS Save to LocalStorage (Success guarantee for custom stories)
        try {
            const storageKey = getStorageKey(storylineId);
            const stored = localStorage.getItem(storageKey);
            const current = stored ? JSON.parse(stored) : [];

            if (!current.includes(endingId)) {
                const updated = [...current, endingId];
                localStorage.setItem(storageKey, JSON.stringify(updated));
            }
        } catch (err) {
            console.error('[useEndings] Error saving to localStorage:', err);
        }

        // 2. Try Supabase if logged in (Best effort)
        if (user) {
            try {
                await apiUnlockEnding(user.id, storylineId, endingId);
            } catch (err) {
                // Ignore FK errors for custom stories not in DB
                console.warn('[useEndings] Could not save to cloud (likely custom story):', err.message);
            }
        }
    }, [user, unlockedEndingIds, currentStorylineId]);

    const resetProgress = useCallback(async (storylineId = currentStorylineId) => {
        if (user) {
            // Logged in: delete from Supabase
            await resetUnlockedEndings(user.id, storylineId);
        }
        // Clear localStorage for this storyline
        const storageKey = getStorageKey(storylineId);
        localStorage.removeItem(storageKey);

        // Only clear legacy if we are on default story to avoid confusion, 
        // or just leave it since it's legacy. 
        // We'll clear legacy if resetting 'default' or 'pdkt-awal'
        if (storylineId === 'pdkt-awal' || storylineId === 'default') {
            clearGuestEndings();
        }

        setUnlockedEndingIds([]);
    }, [user, currentStorylineId]);

    const isEndingUnlocked = useCallback((endingId) => {
        return unlockedEndingIds.includes(endingId);
    }, [unlockedEndingIds]);

    const value = {
        unlockedEndingIds,
        loading,
        currentStorylineId,
        setCurrentStorylineId,
        unlockEnding,
        resetProgress,
        isEndingUnlocked,
        refreshEndings,
    };

    return (
        <EndingsContext.Provider value={value}>
            {children}
        </EndingsContext.Provider>
    );
};

export default EndingsProvider;
