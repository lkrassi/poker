import { sendConfirmationCode } from './sendCode';

export const registerUser = async (username: string, email: string, password: string) => {
	try {
		const BASE_URL = import.meta.env.VITE_BASE_URL;
		const res = await fetch(`https://${BASE_URL}/auth/sign_up`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username, email, password })
		});

		switch (res.status) {
			case 201:
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
			case 400:
				return { success: false, message: 'Некорректные данные или не все поля заполнены' };
			case 409:
				return { success: false, message: 'Email или имя пользователя уже заняты' };
			default:
				return { success: false, message: 'Ошибка регистрации, попробуйте позже' };
		}
	} catch (error) {
		return { success: false, message: 'Ошибка сети, проверьте подключение' };
	}
};
