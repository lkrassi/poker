import type { GameState } from '../types/types';

import { writable } from 'svelte/store';

const STORAGE_KEY = 'poker_game_state';
const STATE_EXPIRY_TIME = 5 * 60 * 1000;

const saveState = (state: GameState) => {
	localStorage.setItem(
		STORAGE_KEY,
		JSON.stringify({
			...state,
			lastUpdate: Date.now()
		})
	);
};

const loadState = (): GameState | null => {
	const savedState = localStorage.getItem(STORAGE_KEY);
	if (!savedState) return null;

	const state = JSON.parse(savedState);
	if (Date.now() - state.lastUpdate > STATE_EXPIRY_TIME) {
		localStorage.removeItem(STORAGE_KEY);
		return null;
	}
	return state;
};

const initialState: GameState = {
	players: [],
	lobbyInfo: null,
	communityCards: [],
	bank: 0,
	currentPlayerId: null,
	availableActions: {
		canCall: false,
		canCheck: false,
		canRaise: false,
		callAmount: 0
	}
};

const gameStateStore = writable<GameState>(loadState() || initialState);

gameStateStore.subscribe((state) => {
	if (state.lobbyInfo?.lobby_id) {
		saveState(state);
	}
});

export const clearGameState = () => {
	localStorage.removeItem(STORAGE_KEY);
	gameStateStore.set(initialState);
};

export { gameStateStore };
