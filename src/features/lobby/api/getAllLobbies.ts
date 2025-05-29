import { fetchWithRefresh } from '../../../shared/lib/api/fetchWithRefresh';

export const getAllLobbies = async (page: number = 0) => {
	try {
		const BASE_URL = import.meta.env.VITE_BASE_URL;

		if (page < 0) {
			return { success: false, message: 'Номер страницы не может быть отрицательным' };
		}

		const res = await fetchWithRefresh(`https://${BASE_URL}/lobby/all/${page}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('access_token')}`
			}
		});

		const data = await res.json();

		if (res.ok) {
			return { success: true, lobbies: data };
		}

		switch (res.status) {
			case 400:
				return { success: false, message: 'Неверный параметр страницы' };
			case 401:
				return { success: false, message: 'Неверный идентификатор пользователя' };
			default:
				return {
					success: false,
					message: data.message || 'Ошибка при получении списка лобби'
				};
		}
	} catch (error) {
		return { success: false, message: 'Ошибка сети, проверьте подключение' };
	}
};
