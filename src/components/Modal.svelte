<script lang="ts">
	import { onMount, onDestroy, tick } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { createFocusTrap } from 'focus-trap';
	import type { FocusTrap } from 'focus-trap';

	export let onClose: () => void;
	export let closable: boolean = true;
	export let containerClass: string = '';
	export let animationDuration: number = 200;

	let modalRef: HTMLDivElement | null = null;
	let focusTrap: FocusTrap | null = null;
	let scrollY = 0;
	let isVisible = false;

	const handleClickOutside = (event: MouseEvent) => {
		if (closable && event.target === modalRef?.parentElement && typeof onClose === 'function') {
			onClose();
		}
	};

	const handleKeyDown = (event: KeyboardEvent) => {
		if (!closable && event.key === 'Escape') {
			event.preventDefault();
		}
	};

	const restoreFocus = () => {
		if (modalRef && !modalRef.contains(document.activeElement)) {
			modalRef.focus();
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

	onMount(async () => {
		isVisible = true;
		lockScroll();

		await tick();

		if (modalRef) {
			focusTrap = createFocusTrap(modalRef, {
				escapeDeactivates: closable,
				clickOutsideDeactivates: closable,
				onDeactivate: () => {
					if (closable && typeof onClose === 'function') onClose();
				},
				initialFocus: modalRef,
				fallbackFocus: modalRef
			});
			focusTrap.activate();
		}

		window.addEventListener('keydown', handleKeyDown);
		window.addEventListener('focusin', restoreFocus);
	});

	onDestroy(() => {
		unlockScroll();
		if (focusTrap) {
			focusTrap.deactivate();
		}
		window.removeEventListener('keydown', handleKeyDown);
		window.removeEventListener('focusin', restoreFocus);
	});
</script>

{#if isVisible}
	<button
		class="modal-overlay"
		on:click={handleClickOutside}
		transition:fade={{ duration: animationDuration }}
	>
		<div
			class="modal-container {containerClass}"
			bind:this={modalRef}
			role="dialog"
			aria-modal="true"
			aria-labelledby="modal-title"
			in:fly={{ y: 50, duration: animationDuration, easing: quintOut }}
			out:fade={{ duration: animationDuration }}
			tabindex="-1"
		>
			<div class="modal-container__body">
				<slot />
			</div>
		</div>
	</button>
{/if}

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
		z-index: 3;
		overflow-y: auto;
		overscroll-behavior: contain;
		min-height: 100vh;
		border: none;
		cursor: default;
		padding: 0;
		margin: 0;

		.modal-container {
			overflow: auto;
			display: flex;
			flex-direction: column;
			outline: none;
			will-change: transform, opacity;

			&__body {
				display: flex;
				flex-direction: column;
				align-items: center;
				color: var(--text-color);
			}
		}

		@media (max-width: 576px) {
			.modal-container {
				width: 95vw;
				max-height: calc(100vh - 2rem);
			}
		}
	}
</style>
