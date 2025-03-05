<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { createFocusTrap } from 'focus-trap';

	export let title: string = '';

	let modalRef: HTMLDivElement | null = null;
	let trap: any;

	onMount(() => {
		if (modalRef) {
			trap = createFocusTrap(modalRef, {
				allowOutsideClick: false,
				escapeDeactivates: false,
				clickOutsideDeactivates: false
			});
			trap.activate();
		}
	});

	onDestroy(() => {
		if (trap) {
			trap.deactivate();
		}
	});
</script>

<div class="modal-overlay">
	<div class="modal-container" bind:this={modalRef}>
		<div class="modal-container__header">
			<h2>{title}</h2>
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
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 3;
		padding: 10px;

		.modal-container {
			background: var(--bg-color, #fff);
			padding: 20px;
			border-radius: 8px;
			box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
			position: relative;
			width: 90vw;
			max-width: 400px;
			min-width: 280px;
			height: auto;
			max-height: 90vh;
			overflow: auto;

			.modal-container__header {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 20px;

				h2 {
					margin: 0;
					color: var(--text-color, #333);
				}
			}

			.modal-container__body {
				display: flex;
				flex-direction: column;
				align-items: center;
			}
		}
	}
</style>
