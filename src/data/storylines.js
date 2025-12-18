// Story registry - central place to manage all storylines
// Automatically discovers all storyline*.json files in the current directory

// Use Vite's glob import to find all matching JSON files
// { eager: true } ensures they are bundled and available immediately
const storyModules = import.meta.glob('./storyline*.json', { eager: true });

export const STORYLINES = {};

// Default ID in case something goes wrong
let defaultId = null;

// Process each imported module
Object.values(storyModules).forEach((module) => {
    // The JSON content is the default export
    const data = module.default || module;

    // Check if the JSON has valid metadata
    if (data.meta && data.meta.id) {
        STORYLINES[data.meta.id] = {
            ...data.meta, // Spread id, title, subtitle, description, emoji
            nodeCount: data.nodes?.length || 0,
            endingCount: data.endings?.length || 0,
            data: data
        };

        // Set the first found story as default if not set
        if (!defaultId) {
            defaultId = data.meta.id;
        }
        // Prefer 'pdkt-awal' as default if found
        if (data.meta.id === 'pdkt-awal') {
            defaultId = 'pdkt-awal';
        }
    } else {
        console.warn('Found storyline file without valid metadata:', module);
    }
});

export const getStorylineById = (id) => STORYLINES[id] || null;

export const getAllStorylines = () => Object.values(STORYLINES);

export const getDefaultStorylineId = () => defaultId || Object.keys(STORYLINES)[0];
