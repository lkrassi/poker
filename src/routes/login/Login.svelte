<script lang="ts">
	import { loginUser } from './api/login';

	import Message from '../../components/Message.svelte';
	import ConfirmEmail from '../../components/ConfirmEmail.svelte';
	import Loader from '../../components/Loader.svelte';

	import EmailIcon from '../../assets/icons/EmailIcon.svelte';
	import PasswordIcon from '../../assets/icons/PasswordIcon.svelte';

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

<div class="login-page">
	<Message type={messageType} {message} />

	<section class="login-container">
		<form class="login-form" on:submit|preventDefault={handleSubmit}>
			<h2 class="login-form__title">Вход</h2>
			<div class="input-container">
				<EmailIcon />
				<input
					class="register-form__input"
					type="email"
					bind:value={email}
					placeholder="Email"
					required
				/>
			</div>

			<div class="input-container">
				<PasswordIcon />
				<input
					class="register-form__input"
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

	{#if $isLoading}
		<Loader />
	{/if}
</div>

<style lang="scss">
	.login-page {
		position: relative;
		min-height: 100vh;
	}

	.login-container {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 100vh;
		background-image: url(../../assets/images/auth-background.png);
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;

		.login-form {
			display: flex;
			flex-direction: column;
			gap: 10px;
			width: 100%;
			max-width: 500px;
			background: transparent;
			backdrop-filter: blur(10px);
			padding: 20px;
			border-radius: 20px;
			border: 1px solid rgba(255, 255, 255, 0.2);
			box-shadow: 0 4px 10px var(--box-shadow-color);

			.login-form__title {
				text-align: center;
				font-size: 2.2rem;
			}

			.input-container {
				position: relative;
				width: 100%;

				.register-form__input {
					width: 100%;
					padding: 10px;
					padding-left: 40px;
					border: 1px solid rgba(255, 255, 255, 0.3);
					border-radius: 20px;
					font-size: 16px;
					color: var(--text-color);

					&:focus {
						border-color: var(--primary-color-hover);
						outline: none;
					}
				}
			}

			.login-form__button {
				padding: 10px 15px;
				font-size: 16px;
				color: #fff;
				background-color: var(--primary-color);
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
					color: var(--text-color);

					&::after {
						content: '';
						position: absolute;
						left: 0;
						bottom: 0;
						width: 0;
						height: 0.01rem;
						background-color: var(--primary-color);
						transition: width 0.3s ease-in-out;
					}

					&:hover::after,
					&:focus::after {
						width: 100%;
					}
				}
			}
		}
	}
</style>
