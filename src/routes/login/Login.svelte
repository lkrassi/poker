<script lang="ts">
	import { loginUser } from '../../api/auth/login';

	import ConfirmEmail from '../../components/ConfirmEmail.svelte';

	import EmailIcon from '../../assets/icons/EmailIcon.svelte';
	import PasswordIcon from '../../assets/icons/PasswordIcon.svelte';

	import { emailStore } from '../../stores/emailStore';
	import { showMessage } from '../../stores/messageStore';

	import { withLoader } from '$lib/loader';

	import { goto } from '$app/navigation';

	let email: string = '';
	let password: string = '';
	let showConfirmEmail: boolean = false;

	const handleSubmit = async (): Promise<void> => {
		const result = await withLoader(loginUser(email, password));

		if (result.success) {
			showMessage('success', 'Вы успешно вошли в аккаунт!');
			goto('/search-lobby');
		} else {
			if (result.message === 'Email не подтвержден') {
				showMessage('error', 'Email не подтвержден');
				emailStore.set(email);
				showConfirmEmail = true;

				setTimeout(() => {
					showMessage('info', 'Код подтверждения отправлен на ваш email!');
				}, 100);
			} else {
				showMessage('error', result.message);
			}
		}
	};
</script>

<section class="login-container">
	<form class="login-form" on:submit|preventDefault={handleSubmit}>
		<h2 class="login-form__title">Вход</h2>
		<div class="login-form__input-container">
			<EmailIcon />
			<input
				class="login-form__input"
				type="email"
				bind:value={email}
				placeholder="Email"
				required
			/>
		</div>

		<div class="login-form__input-container">
			<PasswordIcon />
			<input
				class="login-form__input"
				type="password"
				bind:value={password}
				placeholder="Пароль"
				required
				minlength="8"
				maxlength="32"
			/>
		</div>
		<button class="login-form__button" type="submit">Войти</button>
		<p class="login-form__no-acc">Ещё нет аккаунта? <a href="/register">Зарегистрироваться</a></p>
	</form>
</section>

{#if showConfirmEmail}
	<ConfirmEmail />
{/if}

<style lang="scss">
	.login-container {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 100vh;

		.login-form {
			display: flex;
			flex-direction: column;
			gap: 10px;
			width: 100%;
			max-width: 500px;
			background: transparent;
			backdrop-filter: blur(10px);
			padding: 20px;
			border-radius: 15px;
			border: 1px solid rgba(255, 255, 255, 0.2);
			box-shadow: 0 4px 10px var(--box-shadow-color);

			&__title {
				text-align: center;
				font-size: 2.2rem;
				color: var(--text-color);
			}

			&__input-container {
				position: relative;
				display: flex;
				align-items: center;
			}

			&__input {
				width: 100%;
				padding-left: 40px;
				border: 1px solid var(--border-color);
				border-radius: 15px;
				font-size: 16px;
				color: var(--text-color);
				background: transparent;
				transition: 0.3s ease;

				&::placeholder {
					color: var(--text-color);
				}

				&:focus {
					border-color: var(--text-color);
					outline: none;
					box-shadow: 0 0 8px rgba(var(--primary-color-rgb), 0.4);
				}
			}

			&__button {
				color: var(--text-color);
				background-color: var(--primary-color);
				transition: 0.3s ease;

				&:hover,
				&:focus {
					background-color: var(--primary-color-hover);
					transform: scale(1.01);
				}

				&:active {
					transform: scale(0.99);
				}
			}

			&__no-acc {
				text-align: center;
				font-size: 16px;
				color: var(--text-color);
			}
		}
	}
</style>
