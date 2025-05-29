<script lang="ts">
	import { messageStore } from '../../model/stores/messageStore';
	import { onDestroy } from 'svelte';

	type Message = {
		id: number;
		type: 'success' | 'error' | 'info';
		text: string;
		duration: number;
	};

	let messages: Message[] = [];
	let unsubscribe = messageStore.subscribe((msg) => {
		if (msg) addMessage(msg.text, msg.type);
	});

	onDestroy(() => {
		unsubscribe();
	});

	const addMessage = (text: string, type: 'success' | 'error' | 'info') => {
		const duration = 5000;
		if (messages.some((m) => m.text === text && m.type === type)) return;

		const id = Date.now() + Math.floor(Math.random() * 1000);

		messages = [{ id, type, text, duration }, ...messages];

		setTimeout(() => removeMessage(id), duration);
	};

	const removeMessage = (id: number) => {
		messages = messages.filter((msg) => msg.id !== id);
	};
</script>

<div class="message-container">
	{#each messages as msg (msg.id)}
		<p class="message {`message--${msg.type}`}">
			{msg.text}
		</p>
	{/each}
</div>

<style lang="scss">
	.message-container {
		position: fixed;
		bottom: 20px;
		right: 20px;
		display: flex;
		flex-direction: column-reverse;
		align-items: flex-end;
		gap: 10px;
		z-index: 4;

		@media (max-width: 576px) {
			left: 0;
			right: 0;
			bottom: 20px;
			margin: 0 auto;
			flex-direction: column;
			align-items: center;
		}
	}

	.message {
		font-size: 14px;
		padding: 10px 20px;
		border-radius: 1rem;
		box-shadow: 0 2px 10px var(--box-shadow-color);
		background-color: red;
		color: #fff;
		transition:
			transform 0.5s ease-out,
			opacity 0.5s ease-out;

		&--success {
			background-color: var(--success-message);
		}

		&--error {
			background-color: var(--error-message);
		}

		&--info {
			background-color: var(--primary-color);
		}

		@media (max-width: 576px) {
			text-align: center;
		}
	}
</style>
