import { gameStore } from '../../stores/gameStore';

export const handleLobbyInfo = (message: any) => {
	console.log('Получено обновление информации о лобби:', message.info);

	gameStore.update((state) => {
		const newState = {
			...state,
			lobbyInfo: {
				ante: message.info.ante,
				bank_amount: message.info.bank_amount,
				blind_increase_time: message.info.blind_increase_time,
				cache_game: message.info.cache_game,
				current_players_count: message.info.current_players_count,
				last_blind_increase_time: message.info.last_blind_increase_time,
				lobby_id: message.info.lobby_id,
				max_players: message.info.max_players,
				min_players_to_start: message.info.min_players_to_start,
				small_blind: message.info.small_blind
			}
		};

		if (message.info.bank_amount !== undefined) {
			console.log('Updating bank from lobby info:', {
				oldBank: state.bank,
				newBank: message.info.bank_amount
			});
			newState.bank = message.info.bank_amount;
		}

		return newState;
	});
};
