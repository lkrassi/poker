export interface PlayerStats {
	max_balance: number;
	game_count: number;
}

export interface Player {
	id: string;
	username: string;
	balance: number;
	profile_picture_url: string;
	email: string;
	stats: PlayerStats;
	cards?: string[];
}

export interface LobbyInfo {
	ante: number;
	bank_amount: number;
	blind_increase_time: number;
	cache_game: boolean;
	current_players_count: number;
	last_blind_increase_time: string | number;
	lobby_id: string;
	max_players: number;
	min_players_to_start: number;
	small_blind: number;
}

export interface GameState {
	players: Player[];
	bank: number;
	currentPlayerId: string | null;
	communityCards: string[];
	availableActions: {
		canCall: boolean;
		canCheck: boolean;
		canRaise: boolean;
		callAmount: number;
	};
	lobbyInfo: LobbyInfo | null;
}
