import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const theme = event.cookies.get('theme') || 'light';

	const accessToken = event.cookies.get('access_token');
	const refreshToken = event.cookies.get('refresh_token');

	console.debug('Access Token:', accessToken);
	console.debug('Refresh Token:', refreshToken);

	if (!accessToken) {
		console.warn('Access Token is missing or invalid');
	}
	if (!refreshToken) {
		console.warn('Refresh Token is missing or invalid');
	}

	const response = await resolve(event, {
		transformPageChunk: ({ html }) => {
			return html.replace('<body', `<body class="${theme === 'dark' ? 'dark-theme' : ''}"`);
		}
	});

	return response;
};
