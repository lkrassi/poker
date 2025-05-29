import type { Player, LobbyInfo } from './types';

export type WebSocketEventType =
	| 'players_stats'
	| 'player_enter'
	| 'can_do'
	| 'community_cards'
	| 'get_cards'
	| 'player_leave'
	| 'game_started'
	| 'players_stats'
	| 'new_round'
	| 'get_cards'
	| 'community_cards'
	| 'stop_game'
	| 'win_all'
	| 'win_pot'
	| 'cant_ante'
	| 'get_ante'
	| 'small_blind'
	| 'big_blind'
	| 'next_move'
	| 'dealer'
	| 'bad_move'
	| 'can_do'
	| 'do'
	| 'lobby_update';

export interface WebSocketMessage {
	info?: LobbyInfo;
	players?: Player[];

	event_type?: WebSocketEventType;
	event_data?: string;
	lobby_id?: string;
}
