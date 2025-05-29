import { fetchWithRefresh } from '../../../shared/lib/api/fetchWithRefresh';

import { setUser } from '../model/stores/userStore';

export const getUserById = async (userId: string) => {
	try {
		const BASE_URL = import.meta.env.VITE_BASE_URL;

		if (!userId) {
			return { success: false, message: 'ID пользователя не может быть пустым' };
		}

		const res = await fetchWithRefresh(`https://${BASE_URL}/user/byId/${userId}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('access_token')}`
			}
		});

		switch (res.status) {
			case 200:
				const data = await res.json();
				setUser(data);
				return { success: true, user: data };
			case 400:
				return { success: false, message: 'ID пользователя не может быть пустым' };
			case 401:
				return { success: false, message: 'Не авторизован' };
			case 404:
				return { success: false, message: 'Пользователь не найден' };
			case 500:
				return { success: false, message: 'Ошибка сервера' };
			default:
				return { success: false, message: 'Ошибка при получении данных пользователя' };
		}
	} catch (error) {
		return { success: false, message: 'Ошибка сети, проверьте подключение' };
	}
};
