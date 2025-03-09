export const confirmEmail = async (email: string, code: string) => {
	try {
		const BASE_URL = import.meta.env.VITE_BASE_URL;
		const res = await fetch(`${BASE_URL}/auth/confirm_email`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, code })
		});

		const data = res.status !== 204 ? await res.json() : null;

		if (res.status === 204) {
			return { success: true, message: 'Email успешно подтвержден!' };
		}

		if (res.status === 400)
			return { success: false, message: 'Некорректные данные или не все поля заполнены' };
		if (res.status === 401) return { success: false, message: 'Неверный код, повторите попытку' };
		if (res.status === 404) return { success: false, message: 'Email не зарегистрирован' };
		if (res.status === 409) return { success: false, message: 'Email уже подтвержден' };

		return { success: false, message: data?.message || 'Неизвестная ошибка' };
	} catch (error) {
		console.error('Ошибка подтверждения email:', error);
		return { success: false, message: 'Ошибка сети, проверьте подключение' };
	}
};
