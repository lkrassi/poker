<script lang="ts">
	import { onMount } from 'svelte';
	import { beforeNavigate, goto } from '$app/navigation';

	import { Message } from '../shared/index';
	import { Loader } from '../shared/index';
	import { Modal } from '../shared/index';

	import { isLoading } from '../shared/index';
	import { modalStore, type ModalState } from '../shared/index';
	import { showMessage } from '../shared/index';

	let modalState: ModalState;

	modalStore.subscribe((state) => {
		modalState = state;
	});

	function checkAuth(path = window.location.pathname) {
		const protectedRoutes = ['/search-lobby', '/profile', '/create-lobby'];

		if (protectedRoutes.some((route) => path.startsWith(route))) {
			const accessToken = localStorage.getItem('access_token');
			const refreshToken = localStorage.getItem('refresh_token');

			if (!accessToken || !refreshToken) {
				showMessage('error', 'Для доступа к этой странице необходимо войти в аккаунт');
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

<Message />

{#if $isLoading}
	<Loader />
{/if}

{#if modalState.isOpen}
	<Modal onClose={modalState.props.onClose} containerClass={modalState.props.containerClass}>
		<svelte:component this={modalState.component} {...modalState.props} />
	</Modal>
{/if}

<slot />
