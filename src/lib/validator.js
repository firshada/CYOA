/**
 * Validates the storyline data structure
 * @param {object} data - The storyline data to validate
 * @returns {{ valid: boolean, errors: string[] }}
 */
export const validateStoryline = (data) => {
    const errors = [];

    // Check basic structure
    if (!data || typeof data !== 'object') {
        errors.push('Data cerita harus berupa object.');
        return { valid: false, errors };
    }

    if (!Array.isArray(data.nodes)) {
        errors.push('Data cerita harus memiliki array "nodes".');
    }

    if (!Array.isArray(data.endings)) {
        errors.push('Data cerita harus memiliki array "endings".');
    }

    if (errors.length > 0) {
        return { valid: false, errors };
    }

    const nodeIds = new Set();
    const endingIds = new Set();

    // Validate endings
    for (const ending of data.endings) {
        if (!ending.id || typeof ending.id !== 'string') {
            errors.push('Setiap ending harus memiliki "id" berupa string.');
            continue;
        }
        if (endingIds.has(ending.id)) {
            errors.push(`ID ending duplikat: "${ending.id}".`);
        } else {
            endingIds.add(ending.id);
        }

        if (!ending.title || typeof ending.title !== 'string') {
            errors.push(`Ending "${ending.id}" harus memiliki "title".`);
        }
        if (!ending.badge || typeof ending.badge !== 'string') {
            errors.push(`Ending "${ending.id}" harus memiliki "badge".`);
        }
        if (!ending.text || typeof ending.text !== 'string') {
            errors.push(`Ending "${ending.id}" harus memiliki "text".`);
        }
        if (!ending.hint || typeof ending.hint !== 'string') {
            errors.push(`Ending "${ending.id}" harus memiliki "hint".`);
        }
    }

    // Validate nodes
    for (const node of data.nodes) {
        if (!node.id || typeof node.id !== 'string') {
            errors.push('Setiap node harus memiliki "id" berupa string.');
            continue;
        }
        if (nodeIds.has(node.id)) {
            errors.push(`ID node duplikat: "${node.id}".`);
        } else {
            nodeIds.add(node.id);
        }

        if (!node.text || typeof node.text !== 'string') {
            errors.push(`Node "${node.id}" harus memiliki "text".`);
        }

        if (!Array.isArray(node.choices)) {
            errors.push(`Node "${node.id}" harus memiliki array "choices".`);
            continue;
        }

        if (node.choices.length !== 2) {
            errors.push(`Node "${node.id}" harus memiliki tepat 2 pilihan, ditemukan ${node.choices.length}.`);
        }

        for (let i = 0; i < node.choices.length; i++) {
            const choice = node.choices[i];

            if (!choice.label || typeof choice.label !== 'string') {
                errors.push(`Pilihan ${i + 1} di node "${node.id}" harus memiliki "label".`);
            }

            const hasNext = 'next' in choice && choice.next;
            const hasEnding = 'ending' in choice && choice.ending;

            if (hasNext && hasEnding) {
                errors.push(`Pilihan "${choice.label}" di node "${node.id}" tidak boleh memiliki "next" dan "ending" sekaligus.`);
            } else if (!hasNext && !hasEnding) {
                errors.push(`Pilihan "${choice.label}" di node "${node.id}" harus memiliki "next" atau "ending".`);
            }
        }
    }

    // Validate references
    for (const node of data.nodes) {
        if (!Array.isArray(node.choices)) continue;

        for (const choice of node.choices) {
            if (choice.next && !nodeIds.has(choice.next)) {
                errors.push(`Node "${node.id}" merujuk ke node "${choice.next}" yang tidak ada.`);
            }
            if (choice.ending && !endingIds.has(choice.ending)) {
                errors.push(`Node "${node.id}" merujuk ke ending "${choice.ending}" yang tidak ada.`);
            }
        }
    }

    // Check for starting node
    if (!nodeIds.has('n1')) {
        errors.push('Tidak ditemukan node awal dengan id "n1".');
    }

    return { valid: errors.length === 0, errors };
};

/**
 * Get all ending IDs from the storyline
 * @param {object} data - The storyline data
 * @returns {string[]} Array of ending IDs
 */
export const getEndingIds = (data) => {
    if (!data || !Array.isArray(data.endings)) {
        return [];
    }
    return data.endings.map(e => e.id);
};

/**
 * Get a node by ID
 * @param {object} data - The storyline data
 * @param {string} nodeId - The node ID
 * @returns {object | undefined} The node or undefined
 */
export const getNodeById = (data, nodeId) => {
    if (!data || !Array.isArray(data.nodes)) {
        return undefined;
    }
    return data.nodes.find(n => n.id === nodeId);
};

/**
 * Get an ending by ID
 * @param {object} data - The storyline data
 * @param {string} endingId - The ending ID
 * @returns {object | undefined} The ending or undefined
 */
export const getEndingById = (data, endingId) => {
    if (!data || !Array.isArray(data.endings)) {
        return undefined;
    }
    return data.endings.find(e => e.id === endingId);
};
