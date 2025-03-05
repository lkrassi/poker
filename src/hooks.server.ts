import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get('access_token');
	console.log('access_token:', token);

	const protectedPaths = ['/main', '/profile', '/rules'];

	if (protectedPaths.some((path) => event.url.pathname.startsWith(path))) {
		if (!token) {
			return redirect(302, '/login');
		}
	}

	const theme = event.cookies.get('theme') || 'light';
	const response = await resolve(event, {
		transformPageChunk: ({ html }) => {
			return html.replace('<body', `<body class="${theme === 'dark' ? 'dark-theme' : ''}"`);
		}
	});

	return response;
};
