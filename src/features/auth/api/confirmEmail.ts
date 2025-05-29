export const confirmEmail = async (email: string, code: string) => {
	try {
		const BASE_URL = import.meta.env.VITE_BASE_URL;
		const res = await fetch(`https://${BASE_URL}/auth/confirm_email`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, code })
		});

		const data = await res.json();

		switch (res.status) {
			case 201:
				return { success: true, message: 'Email успешно подтвержден!' };
			case 400:
				return { success: false, message: 'Некорректные данные или не все поля заполнены' };
			case 401:
				return { success: false, message: 'Неверный код, повторите попытку' };
			case 404:
				return { success: false, message: 'Email не зарегистрирован' };
			case 409:
				return { success: false, message: 'Email уже подтвержден' };
			case 500:
				return { success: false, message: 'Произошла ошибка на сервере' };
			default:
				return { success: false, message: data?.message || 'Неизвестная ошибка' };
		}
	} catch (error) {
		return { success: false, message: 'Ошибка сети, проверьте подключение' };
	}
};
