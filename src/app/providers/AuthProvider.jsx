import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { getGuestEndings, clearGuestEndings } from '../../lib/storage';
import { syncGuestEndings } from '../../lib/api';

const AuthContext = createContext({
    user: null,
    session: null,
    loading: true,
    signUp: async () => { },
    signIn: async () => { },
    signOut: async () => { },
});

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                setSession(session);
                setUser(session?.user ?? null);
                setLoading(false);

                // Sync guest endings when user signs in
                if (event === 'SIGNED_IN' && session?.user) {
                    try {
                        const { getGuestEndings, clearGuestEndings } = await import('../../lib/storage');

                        // Sync legacy endings
                        const legacyEndings = getGuestEndings();
                        if (legacyEndings.length > 0) {
                            await syncGuestEndings(session.user.id, 'default', legacyEndings);
                            clearGuestEndings();
                        }

                        // Sync multi-storyline endings (check for keys starting with endings_)
                        // Dynamically get all available story IDs
                        const { getAllStorylines } = await import('../../data/storylines');
                        const storyIds = getAllStorylines().map(s => s.id);

                        for (const sid of storyIds) {
                            const key = `endings_${sid}`;
                            const stored = localStorage.getItem(key);
                            if (stored) {
                                const endings = JSON.parse(stored);
                                if (Array.isArray(endings) && endings.length > 0) {
                                    await syncGuestEndings(session.user.id, sid, endings);
                                    localStorage.removeItem(key);
                                }
                            }
                        }
                    } catch (err) {
                        console.error('Error syncing guest endings:', err);
                    }
                }
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    const signUp = async (email, password) => {
        setLoading(true);
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });
        setLoading(false);

        if (error) {
            throw error;
        }

        return data;
    };

    const signIn = async (email, password) => {
        setLoading(true);
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        setLoading(false);

        if (error) {
            throw error;
        }

        return data;
    };

    const signOut = async () => {
        setLoading(true);
        const { error } = await supabase.auth.signOut();
        setLoading(false);

        if (error) {
            throw error;
        }
    };

    const value = {
        user,
        session,
        loading,
        signUp,
        signIn,
        signOut,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
