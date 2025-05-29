<script lang="ts">
	import { notificationStore } from '../model/stores/notificationStore';
</script>

{#each $notificationStore as notification, index}
	<div
		class="notification"
		class:success={notification.type === 'success'}
		class:error={notification.type === 'error'}
		class:info={notification.type === 'info'}
		style="top: {20 + index * 70}px"
	>
		{notification.text}
	</div>
{/each}

<style>
	.notification {
		position: fixed;
		left: 50%;
		transform: translateX(-50%);
		padding: 1rem 2rem;
		border-radius: 1rem;
		background-color: #333;
		color: var(--text-color);
		font-size: 1rem;
		text-align: center;
		z-index: 1000;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
		animation: slideDown 0.3s ease-out;
	}

	.success {
		background-color: #4caf50;
	}

	.error {
		background-color: #f44336;
	}

	.info {
		background-color: #2196f3;
	}

	@keyframes slideDown {
		from {
			transform: translate(-50%, -100%);
			opacity: 0;
		}
		to {
			transform: translate(-50%, 0);
			opacity: 1;
		}
	}
</style>
