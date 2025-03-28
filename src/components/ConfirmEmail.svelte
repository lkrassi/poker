<script lang="ts">
	import { emailStore } from '../stores/emailStore';
	import { showMessage } from '../stores/messageStore';

	import { apiFacade } from '$lib/apiFacade';

	import { goto } from '$app/navigation';
	import { tick } from 'svelte';

	let codes = Array(6).fill('');
	let inputs: HTMLInputElement[] = [];
	let email: string;

	emailStore.subscribe((value) => (email = value));

	const handleInput = (index: number, event: Event) => {
		const target = event.target as HTMLInputElement;
		const value = target.value.replace(/\D/g, '');

		if (value) {
			codes = [...codes.slice(0, index), value[value.length - 1], ...codes.slice(index + 1)];
			if (index < 5) inputs[index + 1]?.focus();
		} else {
			codes = [...codes.slice(0, index), '', ...codes.slice(index + 1)];
		}
	};

	const handleKeyDown = (index: number, event: KeyboardEvent) => {
		if (event.key === 'Backspace' && !codes[index] && index > 0) {
			inputs[index - 1]?.focus();
		}
	};

	const handlePaste = (event: ClipboardEvent) => {
		event.preventDefault();
		const pasteData = event.clipboardData?.getData('text').trim() || '';
		const pasteDigits = pasteData.replace(/\D/g, '').split('').slice(0, 6);

		codes = [...pasteDigits, ...Array(6 - pasteDigits.length).fill('')];
		const lastFilledIndex = pasteDigits.length - 1;
		tick().then(() => inputs[lastFilledIndex]?.focus());
	};

	const handleConfirm = async () => {
		await tick();

		const code = codes.join('');

		if (code.length < 6) {
			showMessage('error', 'Пожалуйста, введите полный код');
			return;
		}

		const result = await apiFacade.confirmEmail(email, code);

		if (result.success) {
			showMessage('success', 'Email подтвержден успешно!');
			goto('/login');
		} else {
			showMessage('error', result.message || 'Ошибка подтверждения');
		}
	};
</script>

<form on:submit|preventDefault={handleConfirm}>
	<div class="code-inputs">
		{#each codes as _, index}
			<input
				type="tel"
				class="code-input"
				name="code-{index}"
				maxlength="1"
				bind:value={codes[index]}
				on:input={(e) => handleInput(index, e)}
				on:keydown={(e) => handleKeyDown(index, e)}
				on:paste={handlePaste}
				bind:this={inputs[index]}
			/>
		{/each}
	</div>
	<button type="submit" class="submit-btn">Подтвердить</button>
</form>

<style lang="scss">
	:global(.confirm-email-modal) {
		transform: translateY(-10rem);
	}

	.code-inputs {
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		gap: 10px;
		margin-bottom: 20px;
	}

	.code-input {
		width: 40px;
		height: 40px;
		text-align: center;
		font-size: 18px;
		border: 1px solid var(--border-color);
		color: var(--text-color);
		background: transparent;
		transition: 0.3s ease;
		border-radius: 10px;

		&:focus {
			border-color: var(--text-color);
			outline: none;
			box-shadow: 0 0 8px rgba(var(--primary-color-rgb), 0.4);
		}
	}

	.submit-btn {
		width: 100%;
		padding: 10px;
		background-color: var(--primary-color);
		color: #fff;
		border: none;
		border-radius: 20px;
		cursor: pointer;
		transition:
			background-color 0.3s ease,
			transform 0.1s ease;

		&:hover,
		&:focus {
			background-color: var(--primary-color-hover);
		}

		&:active {
			transform: scale(0.99);
		}
	}
</style>
