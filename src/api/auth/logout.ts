export const logoutUser = async () => {
	try {
		const BASE_URL = import.meta.env.VITE_BASE_URL;
		const res = await fetch(`${BASE_URL}/auth/logout`, {
			method: 'POST',
			credentials: 'include'
		});

		if (res.ok) {
			return {
				success: true,
				message: 'Выход выполнен успешно!'
			};
		}

		return {
			success: false,
			message: 'Ошибка при выходе, попробуйте позже'
		};
	} catch (error) {
		console.error('Ошибка при выходе:', error);
		return {
			success: false,
			message: 'Ошибка сети, проверьте подключение'
		};
	}
};
