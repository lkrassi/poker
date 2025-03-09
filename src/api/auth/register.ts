import { sendConfirmationCode } from './sendCode';

export const registerUser = async (username: string, email: string, password: string) => {
	try {
		const BASE_URL = import.meta.env.VITE_BASE_URL;

		const res = await fetch(`${BASE_URL}/auth/sign_up`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username, email, password })
		});

		const data = await res.json();

		if (res.status === 201) {
			const confirmationResult = await sendConfirmationCode(email, password);

			if (confirmationResult.success) {
				return {
					success: true,
					message: 'Регистрация успешна! Код отправлен на почту',
					expTime: confirmationResult.expTime,
					nextCodeTime: confirmationResult.nextCodeTime
				};
			} else {
				return { success: false, message: 'Регистрация успешна, но код не удалось отправить' };
			}
		}

		if (res.status === 400)
			return { success: false, message: 'Некорректные данные или не все поля заполнены' };
		if (res.status === 409)
			return { success: false, message: 'Email или имя пользователя уже заняты' };

		return { success: false, message: 'Ошибка регистрации, попробуйте позже' };
	} catch (error) {
		console.error('Ошибка регистрации:', error);
		return { success: false, message: 'Ошибка сети, проверьте подключение' };
	}
};
