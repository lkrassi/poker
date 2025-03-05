<script lang="ts">
	import { loginUser } from './api/login';

	import Message from '../../components/Message.svelte';
	import ThemeSwitcher from '../../components/ThemeSwitcher.svelte';
	import ConfirmEmail from '../../components/ConfirmEmail.svelte';
	import Loader from '../../components/Loader.svelte';

	import { emailStore } from '../../stores/emailStore';
	import { isLoading } from '../../stores/loaderStore';
	import { withLoader } from '$lib/loader';

	import { goto } from '$app/navigation';

	let email: string = '';
	let password: string = '';
	let message: string = '';
	let messageType: 'success' | 'error' | 'info' = 'info';

	let showConfirmEmail: boolean = false;

	const handleSubmit = async (): Promise<void> => {
		message = '';

		const result = await withLoader(loginUser(email, password));

		if (result.success) {
			messageType = 'success';
			message = 'Вход успешен!';
			goto('/main');
		} else {
			if (result.message === 'Email не подтвержден') {
				messageType = 'error';
				message = 'Email не подтвержден';
				emailStore.set(email);
				showConfirmEmail = true;

				setTimeout(() => {
					messageType = 'info';
					message = 'Код подтверждения отправлен на ваш email!';
				}, 100);
			} else {
				messageType = 'error';
				message = result.message;
			}
		}
	};
</script>

<div class="theme-switcher">
	<ThemeSwitcher />
</div>

<Message type={messageType} {message} />

<section class="login-container">
	<form class="login-form" on:submit|preventDefault={handleSubmit}>
		<input class="login-form__input" type="email" bind:value={email} placeholder="Email" required />
		<input
			class="login-form__input"
			type="password"
			bind:value={password}
			placeholder="Пароль"
			required
			minlength="8"
			maxlength="32"
		/>
		<button class="login-form__button" type="submit">Войти</button>
		<p class="login-form__no-acc">Ещё нет аккаунта? <a href="/register">Зарегистрироваться</a></p>
	</form>
</section>

{#if showConfirmEmail}
	<ConfirmEmail />
{/if}

{#if $isLoading}
	<Loader />
{/if}

<style lang="scss">
	.theme-switcher {
		display: flex;
		justify-content: end;
		margin: 40px 20px;
	}

	.login-container {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 80vh;
		background-color: var(--bg-color);

		.login-form {
			display: flex;
			flex-direction: column;
			gap: 10px;
			width: 100%;
			max-width: 400px;
			background: var(--bg-color);
			padding: 20px;
			border-radius: 8px;
			box-shadow: 0 4px 10px var(--box-shadow-color);

			.login-form__input {
				width: 100%;
				padding: 10px;
				border: 1px solid var(--border-color);
				border-radius: 4px;
				font-size: 16px;
				background-color: var(--input-bg-color);

				&:focus {
					border-color: var(--primary-color);
					outline: none;
				}
			}

			.login-form__button {
				padding: 10px 15px;
				font-size: 16px;
				color: #fff;
				background-color: var(--primary-color);
				border-radius: 4px;
				cursor: pointer;
				transition:
					background-color 0.3s ease,
					transform 0.1s ease;

				&:hover,
				&:focus {
					background-color: var(--primary-color-hover);
				}

				&:active {
					transform: scale(0.98);
				}
			}

			.login-form__no-acc {
				text-align: center;
				font-size: 16px;
				color: var(--text-color);

				a {
					position: relative;
					text-decoration: none;
					color: var(--primary-color);

					&::after {
						content: '';
						position: absolute;
						left: 0;
						bottom: 0;
						width: 0;
						height: 1px;
						background-color: var(--primary-color);
						transition: width 0.3s ease-in-out;
					}

					&:hover::after {
						width: 100%;
					}
				}
			}
		}
	}
</style>
