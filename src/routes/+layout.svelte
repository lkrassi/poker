<script lang="ts">
	import { onMount } from 'svelte';
	import { beforeNavigate, goto } from '$app/navigation';
	import Message from '../components/Message.svelte';

	let message: string = '';
	let messageType: 'success' | 'error' | 'info' = 'info';

	function checkAuth(path = window.location.pathname) {
		const protectedRoutes = ['/search-lobby', '/profile', '/create-lobby'];

		if (protectedRoutes.some((route) => path.startsWith(route))) {
			const accessToken = localStorage.getItem('access_token');
			const refreshToken = localStorage.getItem('refresh_token');

			if (!accessToken || !refreshToken) {
				messageType = 'error';
				message = 'Для доступа к этой странице необходимо войти в систему';
				goto('/login');
			}
		}
	}

	onMount(() => {
		checkAuth();
	});

	beforeNavigate(({ to }) => {
		if (to?.url) {
			checkAuth(to.url.pathname);
		}
	});
</script>

{#if message}
	<Message type={messageType} {message} />
{/if}

<slot />
