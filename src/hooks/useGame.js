import { useState, useCallback } from 'react';
import { getStorylineById, getDefaultStorylineId } from '../data/storylines';
import { getNodeById, getEndingById } from '../lib/validator';

const STARTING_NODE_ID = 'n1';

export const useGame = (initialStorylineId = null) => {
    const [storylineId, setStorylineId] = useState(initialStorylineId || getDefaultStorylineId());
    const [currentNodeId, setCurrentNodeId] = useState(STARTING_NODE_ID);
    const [reachedEnding, setReachedEnding] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [nodeHistory, setNodeHistory] = useState([]);

    const storyline = getStorylineById(storylineId);
    const storylineData = storyline?.data;
    const currentNode = storylineData ? getNodeById(storylineData, currentNodeId) : null;

    const startGame = useCallback((newStorylineId = null) => {
        if (newStorylineId) {
            setStorylineId(newStorylineId);
        }
        setCurrentNodeId(STARTING_NODE_ID);
        setReachedEnding(null);
        setIsPlaying(true);
        setNodeHistory([STARTING_NODE_ID]);
    }, []);

    const selectChoice = useCallback((choice) => {
        if (!storylineData) return;

        if (choice.ending) {
            // Reached an ending
            const ending = getEndingById(storylineData, choice.ending);
            setReachedEnding(ending);
            setIsPlaying(false);
        } else if (choice.next) {
            // Go to next node
            setCurrentNodeId(choice.next);
            setNodeHistory(prev => [...prev, choice.next]);
        }
    }, [storylineData]);

    const restartGame = useCallback(() => {
        setCurrentNodeId(STARTING_NODE_ID);
        setReachedEnding(null);
        setIsPlaying(true);
        setNodeHistory([STARTING_NODE_ID]);
    }, []);

    const endGame = useCallback(() => {
        setIsPlaying(false);
        setReachedEnding(null);
        setCurrentNodeId(STARTING_NODE_ID);
        setNodeHistory([]);
    }, []);

    const changeStoryline = useCallback((newStorylineId) => {
        setStorylineId(newStorylineId);
        setCurrentNodeId(STARTING_NODE_ID);
        setReachedEnding(null);
        setIsPlaying(false);
        setNodeHistory([]);
    }, []);

    return {
        storylineId,
        storyline,
        currentNode,
        currentNodeId,
        reachedEnding,
        isPlaying,
        nodeHistory,
        startGame,
        selectChoice,
        restartGame,
        endGame,
        changeStoryline,
    };
};

export default useGame;
