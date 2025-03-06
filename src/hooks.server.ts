import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';

import { checkAuth } from './routes/login/api/checkAuth';

export const handle: Handle = async ({ event, resolve }) => {
	const theme = event.cookies.get('theme') || 'light';
	const protectedRoutes = ['/main', '/profile', '/rules'];
	if (protectedRoutes.includes(event.url.pathname)) {
		const authResult = await checkAuth();
		console.log('Результат проверки авторизации:', authResult);

		if (!authResult.success) {
			throw redirect(302, '/login');
		} else {
			console.log('Пользователь авторизован. Доступ разрешен.');
		}
	}

	const response = await resolve(event, {
		transformPageChunk: ({ html }) => {
			return html.replace('<body', `<body class="${theme === 'dark' ? 'dark-theme' : ''}"`);
		}
	});

	return response;
};
