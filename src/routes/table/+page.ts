import type { PageLoad } from './$types';

export const load: PageLoad = ({ url }) => {
	const lobbyId = url.searchParams.get('lobby') || '';
	return {
		lobbyId
	};
};
