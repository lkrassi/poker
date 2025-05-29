import { apiFacade } from './apiFacade';

export const fetchWithRefresh = async (url: string, options: RequestInit): Promise<Response> => {
	let res = await fetch(url, options);

	if (res.status === 401) {
		const refreshTokenValue = localStorage.getItem('refresh_token');
		const accessTokenValue = localStorage.getItem('access_token');

		if (refreshTokenValue && accessTokenValue) {
			const refreshResponse = await apiFacade.refreshToken(accessTokenValue, refreshTokenValue);

			if (refreshResponse.success) {
				options.headers = {
					...options.headers,
					Authorization: `Bearer ${localStorage.getItem('access_token')}`
				};
				res = await fetch(url, options);
			} else {
				throw new Error('Не удалось обновить токен');
			}
		} else {
			throw new Error('Токены отсутствуют');
		}
	}

	return res;
};
