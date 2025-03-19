<script lang="ts">
	import Modal from '../../components/Modal.svelte';

	import UpdateProfilePic from './UpdateProfilePic.svelte';
	import UpdateUser from './UpdateUser.svelte';

	let isModalOpen = false;

	const openModal = () => {
		isModalOpen = true;
	};

	const closeModal = () => {
		isModalOpen = false;
	};
</script>

<button class="vertical-dots" on:click={openModal} aria-label="Открыть меню">
	<svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
		<circle cx="12" cy="6" r="2" fill="var(--text-color)" />
		<circle cx="12" cy="12" r="2" fill="var(--text-color)" />
		<circle cx="12" cy="18" r="2" fill="var(--text-color)" />
	</svg>
</button>

{#if isModalOpen}
	<Modal title="" onClose={closeModal}>
		<UpdateProfilePic />
		<UpdateUser />
	</Modal>
{/if}

<style lang="scss">
	.vertical-dots {
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 1.7rem;
		height: 1.7rem;
		border-radius: 50%;
		transition: 0.3s ease;
		background: none;
		border: none;
		padding: 0;

		&:hover,
		&:focus {
			background-color: var(--text-color-hover);
			transform: scale(1.1);
		}
	}
</style>
