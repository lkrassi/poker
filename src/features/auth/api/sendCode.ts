export const sendConfirmationCode = async (email: string, password: string) => {
	try {
		const BASE_URL = import.meta.env.VITE_BASE_URL;
		const res = await fetch(`https://${BASE_URL}/auth/send_code`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, password })
		});

		const data = await res.json();

		switch (res.status) {
			case 201:
				return { success: true, expTime: data.exp_time, nextCodeTime: data.next_code_time };
			case 400:
				return { success: false, message: 'Некорректные данные или не все поля заполнены' };
			case 401:
				return { success: false, message: 'Неверный пароль' };
			case 409:
				return { success: false, message: 'Email уже подтвержден' };
			default:
				return { success: false, message: data.message || 'Неизвестная ошибка' };
		}
	} catch (error) {
		return { success: false, message: 'Ошибка сети, проверьте подключение' };
	}
};
