import { fetchWithRefresh } from '../../../shared/lib/api/fetchWithRefresh';

import { setUser, userStore } from '../model/stores/userStore';

import { get } from 'svelte/store';

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

		const res = await fetchWithRefresh(`https://${BASE_URL}/user/`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('access_token')}`
			},
			body: JSON.stringify({ username: newUsername })
		});

		switch (res.status) {
			case 204:
				setUser({ ...user, username: newUsername });
				return { success: true };
			case 400:
				return {
					success: false,
					message:
						'Никнейм должен быть от 4 до 32 символов и может содержать только латинские буквы, цифры и символы: _ # $ & * -'
				};
			case 401:
				return { success: false, message: 'Неверный идентификатор пользователя' };
			case 404:
				return { success: false, message: 'Пользователь не найден' };
			case 409:
				return { success: false, message: 'Имя пользователя уже занято' };
			default:
				return { success: false, message: 'Ошибка при обновлении данных пользователя' };
		}
	} catch (error) {
		return { success: false, message: 'Ошибка сети, проверьте подключение' };
	}
};
