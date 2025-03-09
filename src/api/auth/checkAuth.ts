export const checkAuth = async () => {
	try {
		const BASE_URL = import.meta.env.VITE_BASE_URL;

		const res = await fetch(`${BASE_URL}/auth/check_auth`, {
			method: 'POST',
			credentials: 'include'
		});

		console.log(`Статус ответа: ${res.status}`);

		if (res.status === 200) {
			const data = await res.json();
			console.log('Ответ сервера (успех):', data);
			return {
				success: true,
				message: 'Пользователь авторизован',
				details: data.details
			};
		}

		if (res.status === 400) {
			console.log('Ошибка: Отсутствует токен доступа');
			return { success: false, message: 'Отсутствует токен доступа' };
		}

		console.log('Ошибка проверки авторизации. Неизвестный статус:', res.status);
		return { success: false, message: 'Ошибка проверки авторизации' };
	} catch (error) {
		console.error('Ошибка при выполнении запроса:', error);
		return { success: false, message: 'Ошибка сети, проверьте подключение' };
	}
};
