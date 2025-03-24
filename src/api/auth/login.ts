import { sendConfirmationCode } from '../email/sendCode';
import { setUser } from '../../stores/userStore';

export const loginUser = async (email: string, password: string) => {
	try {
		const BASE_URL = import.meta.env.VITE_BASE_URL;
		const res = await fetch(`${BASE_URL}/auth/sign_in`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, password })
		});

		const data = await res.json();

		if (res.status === 201) {
			localStorage.setItem('access_token', data.tokens.access_token);
			localStorage.setItem('refresh_token', data.tokens.refresh_token);
			setUser(data.user);

			return {
				success: true,
				message: 'Вход успешен!',
				user: data.user
			};
		}

		if (res.status === 400)
			return { success: false, message: 'Некорректные данные, проверьте ввод' };
		if (res.status === 401) return { success: false, message: 'Неверный логин или пароль' };
		if (res.status === 403) {
			await sendConfirmationCode(email, password);
			return { success: false, message: 'Email не подтвержден' };
		}
		if (res.status === 404) return { success: false, message: 'Email не зарегистрирован' };

		return { success: false, message: 'Ошибка авторизации, попробуйте позже' };
	} catch (error) {
		console.error('Ошибка входа:', error);
		return { success: false, message: 'Ошибка сети, проверьте подключение' };
	}
};
