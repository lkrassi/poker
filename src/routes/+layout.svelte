<script lang="ts">
	import { onMount } from 'svelte';
	import { beforeNavigate, goto } from '$app/navigation';
	import { showMessage } from '../stores/messageStore';

	import Message from '../components/Message.svelte';
	import Loader from '../components/Loader.svelte';
	import Modal from '../components/Modal.svelte';

	import { isLoading } from '../stores/loaderStore';
	import { modalStore, type ModalState } from '../stores/modalStore';

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
	<Modal
		title={modalState.props.title}
		onClose={modalState.props.onClose}
		containerClass={modalState.props.containerClass}
	>
		<svelte:component this={modalState.component} {...modalState.props} />
	</Modal>
{/if}

<slot />
