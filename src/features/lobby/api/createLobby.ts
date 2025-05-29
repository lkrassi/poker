import { fetchWithRefresh } from '../../../shared/lib/api/fetchWithRefresh';

export const createLobby = async (lobbyData: {
	blind_increase_time: string;
	max_players: number;
	small_blind: number;
}) => {
	try {
		const BASE_URL = import.meta.env.VITE_BASE_URL;
		const res = await fetchWithRefresh(`https://${BASE_URL}/lobby/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('access_token')}`
			},
			body: JSON.stringify(lobbyData)
		});

		switch (res.status) {
			case 201:
				const data = await res.json();
				return { success: true, lobbyId: data.lobbyId };
			case 400:
				return { success: false, message: 'Ошибка в данных лобби' };
			case 401:
				return { success: false, message: 'Неверный идентификатор пользователя' };
			default:
				return { success: false, message: 'Ошибка при создании лобби' };
		}
	} catch (error) {
		return { success: false, message: 'Ошибка сети, проверьте подключение' };
	}
};
