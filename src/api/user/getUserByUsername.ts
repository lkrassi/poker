import { setUser, userStore } from '../../stores/userStore';
import { get } from 'svelte/store';

export const getUserByUsername = async () => {
	try {
		const BASE_URL = import.meta.env.VITE_BASE_URL;
		const { user } = get(userStore);

		if (!user || !user.username) {
			return { success: false, message: 'Имя пользователя не может быть пустым' };
		}

		const res = await fetch(`${BASE_URL}/user/${user.username}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('access_token')}`
			}
		});

		if (res.status === 200) {
			const data = await res.json();
			setUser(data);
			return { success: true, user: data };
		}

		if (res.status === 400) {
			return { success: false, message: 'Имя пользователя не может быть пустым' };
		}

		if (res.status === 404) {
			return { success: false, message: 'Пользователь не найден' };
		}

		return { success: false, message: 'Ошибка при получении данных пользователя' };
	} catch (error) {
		console.error('Ошибка при запросе пользователя:', error);
		return { success: false, message: 'Ошибка сети, проверьте подключение' };
	}
};
