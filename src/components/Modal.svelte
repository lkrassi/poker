<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { createFocusTrap } from 'focus-trap';

	export let title: string = '';
	export let onClose: () => void;
	export let closable: boolean = true;
	export let containerClass: string = '';

	let modalRef: HTMLDivElement | null = null;
	let trap: any;

	const handleClickOutside = (event: MouseEvent) => {
		if (closable && event.target === modalRef?.parentElement) {
			onClose();
		}
	};

	const handleKeyDown = (event: KeyboardEvent) => {
		if (closable && event.key === 'Escape') {
			onClose();
		}
	};

	onMount(() => {
		document.addEventListener('keydown', handleKeyDown);

		if (modalRef) {
			trap = createFocusTrap(modalRef, {
				allowOutsideClick: true,
				escapeDeactivates: closable,
				clickOutsideDeactivates: closable
			});
			trap.activate();
		}
	});

	onDestroy(() => {
		document.removeEventListener('keydown', handleKeyDown);

		if (trap) {
			trap.deactivate();
		}
	});
</script>

<div class="modal-overlay" on:click={handleClickOutside}>
	<div class="modal-container {containerClass}" bind:this={modalRef}>
		<div class="modal-container__header">
			<h2 class="modal-container__title">{title}</h2>
		</div>
		<div class="modal-container__body">
			<slot />
		</div>
	</div>
</div>

<style lang="scss">
	.modal-overlay {
		border-radius: 0;
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: var(--modal-back-color);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 3;
		padding: 10px;

		.modal-container {
			backdrop-filter: blur(10px);
			padding: 20px;
			border-radius: 20px;
			border: 1px solid rgba(255, 255, 255, 0.2);
			box-shadow: 0 4px 10px var(--box-shadow-color);
			width: 90vw;
			max-width: 500px;
			height: auto;
			max-height: 90vh;
			overflow: auto;
			display: flex;
			flex-direction: column;
			align-items: center;

			&__header {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 20px;
			}

			&__title {
				margin: 0;
				color: var(--text-color);
				font-size: 2rem;
			}

			&__body {
				display: flex;
				flex-direction: column;
				align-items: center;
				color: var(--text-color);
			}
		}
	}
</style>
