<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { createFocusTrap } from 'focus-trap';

	export let title: string = '';
	export let onClose: () => void;
	export let closable: boolean = true;
	export let containerClass: string = '';

	let modalRef: HTMLDivElement | null = null;
	let trap: any;
	let scrollY = 0;

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

	const lockScroll = () => {
		scrollY = window.scrollY;
		document.body.style.position = 'fixed';
		document.body.style.top = `-${scrollY}px`;
		document.body.style.width = '100%';
		document.body.style.overflow = 'hidden';
	};

	const unlockScroll = () => {
		document.body.style.position = '';
		document.body.style.top = '';
		document.body.style.width = '';
		document.body.style.overflow = '';
		window.scrollTo(0, scrollY);
	};

	onMount(() => {
		lockScroll();
		document.addEventListener('keydown', handleKeyDown);

		if (modalRef) {
			trap = createFocusTrap(modalRef, {
				allowOutsideClick: true,
				escapeDeactivates: closable,
				clickOutsideDeactivates: closable,
				fallbackFocus: modalRef,
				initialFocus: modalRef,
				returnFocusOnDeactivate: true
			});
			trap.activate();
		}
	});

	onDestroy(() => {
		unlockScroll();
		document.removeEventListener('keydown', handleKeyDown);

		if (trap) {
			trap.deactivate();
		}
	});
</script>

<div class="modal-overlay" on:click={handleClickOutside}>
	<div
		class="modal-container {containerClass}"
		bind:this={modalRef}
		role="dialog"
		aria-modal="true"
		aria-labelledby="modal-title"
	>
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
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: var(--modal-back-color);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 1000;
		padding: 1rem;
		overflow-y: auto;
		overscroll-behavior: contain;

		.modal-container {
			backdrop-filter: blur(10px);
			padding: 1.5rem;
			border-radius: 1.25rem;
			border: 1px solid rgba(255, 255, 255, 0.2);
			box-shadow: 0 0.25rem 0.625rem var(--box-shadow-color);
			width: min(90vw, 31.25rem);
			max-height: calc(100vh - 2rem);
			overflow: auto;
			display: flex;
			flex-direction: column;
			outline: none;

			&__header {
				display: flex;
				justify-content: center;
				align-items: center;
				margin-bottom: 1.25rem;
			}

			&__title {
				margin: 0;
				color: var(--text-color);
				font-size: 1.5rem;
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
