export const clearLocalStorage = (): void => {
	localStorage.removeItem('access_token');
	localStorage.removeItem('refresh_token');
};
