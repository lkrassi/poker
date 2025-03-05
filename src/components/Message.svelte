<script lang="ts">
	type Message = { id: number; type: 'success' | 'error' | 'info'; text: string };

	export let type: 'success' | 'error' | 'info' = 'info';
	export let message: string = '';

	let messages: Message[] = [];

	const addMessage = () => {
		if (!message) return;

		if (messages.some((msg) => msg.text === message && msg.type === type)) return;

		const id = Date.now();

		messages = [{ id, type, text: message }, ...messages];

		if (messages.length > 5) {
			messages.pop();
		}

		setTimeout(() => removeMessage(id), 3000);

		message = '';
	};

	const removeMessage = (id: number) => {
		messages = messages.filter((msg) => msg.id !== id);
	};

	$: if (message) {
		addMessage();
	}
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
		z-index: 9999;
	}

	.message {
		font-size: 14px;
		padding: 10px 20px;
		border-radius: 5px;
		box-shadow: 0 2px 10px var(--box-shadow-color);
		background-color: red;
		color: #fff;
		transition:
			transform 0.5s ease-out,
			opacity 0.5s ease-out;
	}

	.message--success {
		background-color: var(--success-message);
	}

	.message--error {
		background-color: var(--error-message);
	}

	.message--info {
		background-color: var(--primary-color);
	}
</style>
