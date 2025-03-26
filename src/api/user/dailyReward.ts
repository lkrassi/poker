import fetchWithRefresh from '$lib/fetchWithRefresh';

export const claimDailyReward = async () => {
	try {
		const BASE_URL = import.meta.env.VITE_BASE_URL;
		const res = await fetchWithRefresh(`${BASE_URL}/user/daily`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('access_token')}`
			}
		});

		if (res.status === 200) {
			const data = await res.json();
			return { success: true, amount: data.amount, sector: data.sector };
		}

		if (res.status === 400) {
			const errorData = await res.json();
			const date = new Date(errorData.message);
			const formattedDate = date.toLocaleString('ru-RU', {
				weekday: 'long',
				year: 'numeric',
				month: 'long',
				day: 'numeric',
				hour: 'numeric',
				minute: 'numeric',
				second: 'numeric',
				timeZoneName: 'short'
			});
			return { success: false, message: `Следующая награда будет доступна в ${formattedDate}` };
		}

		if (res.status === 401) {
			return { success: false, message: 'Некорректный идентификатор пользователя' };
		}

		return { success: false, message: 'Ошибка при получении награды' };
	} catch (error) {
		return { success: false, message: 'Ошибка сети, проверьте подключение' };
	}
};
