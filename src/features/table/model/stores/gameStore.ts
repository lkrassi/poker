import { writable } from 'svelte/store';
import type { GameState } from '../types/types';

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

const { subscribe, set, update } = writable<GameState>(initialState);

export const gameStore = {
	subscribe,
	set,
	update,
	reset: () => set(initialState)
};
