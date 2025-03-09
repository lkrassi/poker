import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { checkAuth } from './api/auth/checkAuth';

export const handle: Handle = async ({ event, resolve }) => {
	const protectedRoutes = ['/main', '/profile', '/rules'];

	if (protectedRoutes.some((route) => event.url.pathname.startsWith(route))) {
		try {
			const authResult = await checkAuth();

			if (!authResult.success) {
				throw redirect(302, '/login');
			} else {
			}
		} catch (error) {
			throw redirect(302, '/login');
		}
	}

	const response = await resolve(event);
	return response;
};
