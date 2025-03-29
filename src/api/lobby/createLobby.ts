import fetchWithRefresh from '$lib/fetchWithRefresh';

export const createLobby = async (lobbyData: {
	ante: number;
	blind_increase_time: string;
	cache_game: boolean;
	max_players: number;
	small_blind: number;
}) => {
	try {
		const BASE_URL = import.meta.env.VITE_BASE_URL;

		const res = await fetchWithRefresh(`${BASE_URL}/lobby/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('access_token')}`
			},
			body: JSON.stringify(lobbyData)
		});

		if (res.status === 201) {
			const lobbyId = await res.json();
			return { success: true, lobbyId };
		}

		if (res.status === 400) {
			return { success: false, message: 'Ошибка в данных лобби' };
		}

		if (res.status === 401) {
			return { success: false, message: 'Неверный идентификатор пользователя' };
		}

		return { success: false, message: 'Ошибка при создании лобби' };
	} catch (error) {
		return { success: false, message: 'Ошибка сети, проверьте подключение' };
	}
};
