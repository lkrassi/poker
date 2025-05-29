import { getUserById } from '../../../../../features/profile/api/getUserById';

import { showNotification } from '../../stores/notificationStore';
import { gameStore } from '../../stores/gameStore';

export const handlePlayerEnter = async (message: any) => {
	const playerIdMatch = message.event_data.match(/player (.*?) enter/);
	if (!playerIdMatch) return;

	const playerId = playerIdMatch[1];
	console.log('Новый игрок вошел:', playerId);

	const { success, user, message: errorMessage } = await getUserById(playerId);

	if (!success || !user) {
		console.error('Ошибка при получении данных игрока:', errorMessage);
		return;
	}

	gameStore.update((state) => {
		const playerExists = state.players.some((p) => p.id === playerId);
		if (playerExists) {
			console.log('Игрок уже существует в списке');
			return state;
		}

		const newPlayer = {
			id: playerId,
			username: user.username,
			balance: user.balance || 0,
			profile_picture_url:
				user.profile_picture_url ||
				`https://${import.meta.env.VITE_BASE_URL}/profiles/default_pic.jpg`,
			email: user.email || '',
			stats: user.stats || {
				max_balance: 0,
				game_count: 0
			}
		};

		console.log('Добавляем нового игрока:', newPlayer);
		showNotification('info', `Игрок ${newPlayer.username} вошел в лобби`);

		return {
			...state,
			players: [...state.players, newPlayer]
		};
	});
};

export const handlePlayersStats = (message: any) => {
	gameStore.update((state) => ({
		...state,
		players: state.players.map((player) => {
			const playerStats = message.event_data.find((p: any) => p.balance === player.balance);
			return playerStats ? { ...player, id: playerStats.id } : player;
		})
	}));
};

export const handlePlayersUpdate = (message: any) => {
	console.log('Получено обновление списка игроков:', message.players);

	gameStore.update((state) => {
		const updatedPlayers = message.players.map((player: any) => ({
			id: player.id,
			username: player.username,
			balance: player.balance,
			profile_picture_url: player.profile_picture_url,
			email: player.email,
			stats: player.stats
		}));

		console.log('Обновленный список игроков:', {
			count: updatedPlayers.length,
			players: updatedPlayers
		});

		return {
			...state,
			players: updatedPlayers
		};
	});
};
