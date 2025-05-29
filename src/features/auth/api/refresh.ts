export const refreshToken = async (accessToken: string, refreshToken: string) => {
	try {
		const BASE_URL = import.meta.env.VITE_BASE_URL;
		const res = await fetch(`https://${BASE_URL}/auth/refresh_token`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ access_token: accessToken, refresh_token: refreshToken })
		});

		const data = await res.json();

		switch (res.status) {
			case 201:
				localStorage.setItem('access_token', data.access_token);
				localStorage.setItem('refresh_token', data.refresh_token);
				return {
					success: true,
					message: 'Токены успешно обновлены',
					tokens: {
						access_token: data.access_token,
						refresh_token: data.refresh_token
					}
				};
			default:
				return { success: false, message: 'Ошибка обновления токенов, попробуйте позже' };
		}
	} catch (error) {
		return { success: false, message: 'Ошибка сети, проверьте подключение' };
	}
};
