import { setUser, userStore } from '../../stores/userStore';
import { get } from 'svelte/store';
import fetchWithRefresh from '$lib/fetchWithRefresh';

export const updateUsername = async (newUsername: string) => {
	try {
		const BASE_URL = import.meta.env.VITE_BASE_URL;
		const { user } = get(userStore);

		if (!user) {
			return { success: false, message: 'Пользователь не авторизован' };
		}

		if (!newUsername) {
			return { success: false, message: 'Имя пользователя не может быть пустым' };
		}

		const res = await fetchWithRefresh(`${BASE_URL}/user/`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('access_token')}`
			},
			body: JSON.stringify({ username: newUsername })
		});

		if (res.status === 204) {
			setUser({ ...user, username: newUsername });
			return { success: true };
		}

		if (res.status === 400) {
			return { success: false, message: 'Некорректные данные' };
		}

		if (res.status === 401) {
			return { success: false, message: 'Неверный идентификатор пользователя' };
		}

		if (res.status === 404) {
			return { success: false, message: 'Пользователь не найден' };
		}

		if (res.status === 409) {
			return { success: false, message: 'Имя пользователя уже занято' };
		}

		return { success: false, message: 'Ошибка при обновлении данных пользователя' };
	} catch (error) {
		return { success: false, message: 'Ошибка сети, проверьте подключение' };
	}
};
