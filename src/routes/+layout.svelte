<script lang="ts">
	import { onMount } from 'svelte';
	import { beforeNavigate, goto } from '$app/navigation';

	import Message from '../shared/ui/Message/Message.svelte';
	import Loader from '../shared/ui/Loader/Loader.svelte';
	import Modal from '../shared/ui/Modal/Modal.svelte';
	import Notification from '../features/table/ui/Notification.svelte';

	import { isLoading } from '../shared/model/stores/loaderStore';
	import { modalStore, type ModalState } from '../shared/model/stores/modalStore';
	import { showMessage } from '../shared/model/stores/messageStore';

	let modalState: ModalState;

	modalStore.subscribe((state) => {
		modalState = state;
	});

	function checkAuth(path = window.location.pathname) {
		const protectedRoutes = ['/table', '/search-lobby', '/create-lobby', '/profile'];

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

<Notification />

{#if $isLoading}
	<Loader />
{/if}

{#if modalState.isOpen}
	<Modal onClose={modalState.props.onClose} containerClass={modalState.props.containerClass}>
		<svelte:component this={modalState.component} {...modalState.props} />
	</Modal>
{/if}

<slot />
