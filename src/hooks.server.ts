import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const theme = event.cookies.get('theme') || 'light';
	const authToken = event.cookies.get('access_token');
	console.log(`Acces Token: ${authToken}`);

	if (!authToken && event.url.pathname.startsWith('/profile')) {
		throw redirect(302, '/login');
	}

	const response = await resolve(event, {
		transformPageChunk: ({ html }) => {
			return html.replace('<body', `<body class="${theme === 'dark' ? 'dark-theme' : ''}"`);
		}
	});

	return response;
};
