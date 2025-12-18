import { supabase } from './supabaseClient';

/**
 * Get all unlocked endings for a user
 * @param {string} userId - The user's UUID
 * @param {string} storyPackId - The story pack ID (default: 'default')
 * @returns {Promise<string[]>} Array of ending IDs
 */
export const getUnlockedEndings = async (userId, storyPackId = 'default') => {
    try {
        const { data, error } = await supabase
            .from('unlocked_endings')
            .select('ending_id')
            .eq('user_id', userId)
            .eq('story_pack_id', storyPackId);

        if (error) {
            console.error('Error fetching unlocked endings:', error);
            return [];
        }

        return data.map(row => row.ending_id);
    } catch (error) {
        console.error('Error fetching unlocked endings:', error);
        return [];
    }
};

/**
 * Unlock a single ending for a user (idempotent)
 * @param {string} userId - The user's UUID
 * @param {string} storyPackId - The story pack ID
 * @param {string} endingId - The ending ID to unlock
 * @returns {Promise<boolean>} Success status
 */
export const unlockEnding = async (userId, storyPackId, endingId) => {
    try {
        const { error } = await supabase
            .from('unlocked_endings')
            .upsert(
                {
                    user_id: userId,
                    story_pack_id: storyPackId,
                    ending_id: endingId,
                },
                {
                    onConflict: 'user_id,story_pack_id,ending_id',
                    ignoreDuplicates: true,
                }
            );

        if (error) {
            // Handle unique constraint violation gracefully
            if (error.code === '23505') {
                return true; // Already unlocked, that's fine
            }
            console.error('Error unlocking ending:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error unlocking ending:', error);
        return false;
    }
};

/**
 * Sync guest endings to user account
 * @param {string} userId - The user's UUID
 * @param {string} storyPackId - The story pack ID
 * @param {string[]} guestEndings - Array of ending IDs from guest storage
 * @returns {Promise<string[]>} Merged array of all unlocked endings
 */
export const syncGuestEndings = async (userId, storyPackId, guestEndings) => {
    try {
        // First, get existing user endings
        const existingEndings = await getUnlockedEndings(userId, storyPackId);

        // Find new endings to sync
        const newEndings = guestEndings.filter(id => !existingEndings.includes(id));

        // Insert new endings
        if (newEndings.length > 0) {
            const inserts = newEndings.map(endingId => ({
                user_id: userId,
                story_pack_id: storyPackId,
                ending_id: endingId,
            }));

            const { error } = await supabase
                .from('unlocked_endings')
                .upsert(inserts, {
                    onConflict: 'user_id,story_pack_id,ending_id',
                    ignoreDuplicates: true,
                });

            if (error) {
                console.error('Error syncing guest endings:', error);
            }
        }

        // Return merged list
        return [...new Set([...existingEndings, ...guestEndings])];
    } catch (error) {
        console.error('Error syncing guest endings:', error);
        return guestEndings;
    }
};

/**
 * Reset all unlocked endings for a user
 * @param {string} userId - The user's UUID
 * @param {string} storyPackId - The story pack ID
 * @returns {Promise<boolean>} Success status
 */
export const resetUnlockedEndings = async (userId, storyPackId = 'default') => {
    try {
        const { error } = await supabase
            .from('unlocked_endings')
            .delete()
            .eq('user_id', userId)
            .eq('story_pack_id', storyPackId);

        if (error) {
            console.error('Error resetting endings:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error resetting endings:', error);
        return false;
    }
};
