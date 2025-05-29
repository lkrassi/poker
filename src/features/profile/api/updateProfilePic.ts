import { getUserByUsername } from './getUserByUsername';

import { fetchWithRefresh } from '../../../shared/lib/api/fetchWithRefresh';

export const updateProfilePic = async (file: File) => {
	try {
		const BASE_URL = import.meta.env.VITE_BASE_URL;
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

		const res = await fetchWithRefresh(`https://${BASE_URL}/user/profile_pic`, {
			method: 'PUT',
			headers: {
				Authorization: `Bearer ${localStorage.getItem('access_token')}`
			},
			body: formData
		});

		switch (res.status) {
			case 200:
				const userUpdateResponse = await getUserByUsername();
				if (userUpdateResponse.success) {
					return { success: true, message: 'Аватар успешно обновлён' };
				} else {
					return { success: false, message: 'Не удалось обновить данные пользователя' };
				}
			case 400:
				return { success: false, message: 'Невозможно открыть файл' };
			case 401:
				return { success: false, message: 'Неверный идентификатор пользователя' };
			case 404:
				return { success: false, message: 'Пользователь не найден' };
			default:
				return { success: false, message: 'Ошибка при обновлении аватара' };
		}
	} catch (error) {
		return { success: false, message: 'Ошибка сети, проверьте подключение' };
	}
};
