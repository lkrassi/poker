export const sendConfirmationCode = async (email: string, password: string) => {
	try {
		const BASE_URL = import.meta.env.VITE_BASE_URL;
		const res = await fetch(`${BASE_URL}/auth/send_code`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, password })
		});

		const data = await res.json();

		if (res.status === 201) {
			return { success: true, expTime: data.exp_time, nextCodeTime: data.next_code_time };
		}

		if (res.status === 400)
			return { success: false, message: 'Некорректные данные или не все поля заполнены' };
		if (res.status === 401) return { success: false, message: 'Неверный пароль' };
		if (res.status === 409) return { success: false, message: 'Email уже подтвержден' };

		return { success: false, message: data.message || 'Неизвестная ошибка' };
	} catch (error) {
		console.error('Ошибка отправки кода:', error);
		return { success: false, message: 'Ошибка сети, проверьте подключение' };
	}
};
