<script lang="ts">
	import { openModal, closeModal } from '../../../shared/model/stores/modalStore';

	import UpdateProfilePic from './UpdateProfilePic.svelte';

	const openProfileModal = () => {
		openModal(UpdateProfilePic, {
			title: '',
			onClose: closeModal,
			containerClass: 'update-profile-pic-modal'
		});
	};
</script>

<button class="vertical-dots" on:click={openProfileModal} aria-label="Открыть меню">
	<svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
		<circle cx="12" cy="6" r="2" fill="var(--text-color)" />
		<circle cx="12" cy="12" r="2" fill="var(--text-color)" />
		<circle cx="12" cy="18" r="2" fill="var(--text-color)" />
	</svg>
</button>

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
