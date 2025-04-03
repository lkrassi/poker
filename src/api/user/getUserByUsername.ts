import { setUser, userStore } from '$stores/data/userStore';

import fetchWithRefresh from '$lib/fetchWithRefresh';

import { get } from 'svelte/store';

export const getUserByUsername = async () => {
	try {
		const BASE_URL = import.meta.env.VITE_BASE_URL;
		const { user } = get(userStore);

		if (!user || !user.username) {
			return { success: false, message: 'Имя пользователя не может быть пустым' };
		}

		const res = await fetchWithRefresh(`${BASE_URL}/user/${user.username}`, {
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
				return { success: false, message: 'Имя пользователя не может быть пустым' };
			case 404:
				return { success: false, message: 'Пользователь не найден' };
			default:
				return { success: false, message: 'Ошибка при получении данных пользователя' };
		}
	} catch (error) {
		return { success: false, message: 'Ошибка сети, проверьте подключение' };
	}
};
