import { get } from 'svelte/store';
import { userStore, setUser } from '../../stores/userStore';
import fetchWithRefresh from '$lib/fetchWithRefresh';

export const updateProfilePic = async (file: File) => {
	try {
		const BASE_URL = import.meta.env.VITE_BASE_URL;
		const { user } = get(userStore);

		if (!user) {
			return { success: false, message: 'Пользователь не авторизован' };
		}

		if (!file) {
			return { success: false, message: 'Файл не выбран' };
		}

		const allowedFormats = ['image/jpeg', 'image/png', 'image/gif'];
		if (!allowedFormats.includes(file.type)) {
			return {
				success: false,
				message: 'Недопустимый формат файла. Используйте JPG, PNG или GIF.'
			};
		}

		const formData = new FormData();
		formData.append('profile_pic', file);

		const res = await fetchWithRefresh(`${BASE_URL}/user/profile_pic`, {
			method: 'PUT',
			headers: {
				Authorization: `Bearer ${localStorage.getItem('access_token')}`
			},
			body: formData
		});

		if (res.status === 204) {
			setUser({
				...user,
				profile_picture_url: `${user.profile_picture_url}?t=${Date.now()}`
			});
			return { success: true, message: 'Аватар успешно обновлён' };
		}
		if (res.status === 400) {
			return { success: false, message: 'Невозможно открыть файл' };
		}

		if (res.status === 401) {
			return { success: false, message: 'Неверный идентификатор пользователя' };
		}

		if (res.status === 404) {
			return { success: false, message: 'Пользователь не найден' };
		}

		return { success: false, message: 'Ошибка при обновлении аватара' };
	} catch (error) {
		return { success: false, message: 'Ошибка сети, проверьте подключение' };
	}
};
