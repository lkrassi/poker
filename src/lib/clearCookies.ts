export const clearCookies = () => {
	const cookiesToClear = ['access_token', 'refresh_token'];

	cookiesToClear.forEach((name) => {
		document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
	});
};
