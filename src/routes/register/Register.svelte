<script lang="ts">
	import { registerUser } from '../../api/auth/register';

	import ConfirmEmail from '../../components/ConfirmEmail.svelte';

	import UserIcon from '../../assets/icons/UserIcon.svelte';
	import EmailIcon from '../../assets/icons/EmailIcon.svelte';
	import PasswordIcon from '../../assets/icons/PasswordIcon.svelte';

	import { emailStore } from '../../stores/emailStore';
	import { showMessage } from '../../stores/messageStore';

	import { withLoader } from '$lib/loader';

	let username: string = '';
	let email: string = '';
	let password: string = '';
	let showConfirmEmail: boolean = false;

	const handleSubmit = async (): Promise<void> => {
		const result = await withLoader(registerUser(username, email, password));

		if (result.success) {
			showMessage('success', 'Теперь код подтверждения будет отправлен на ваш email!');
			emailStore.set(email);
			showConfirmEmail = true;
		} else {
			showMessage('error', result.message || 'Ошибка регистрации');
		}
	};
</script>

<div class="register-page">
	{#if showConfirmEmail}
		<ConfirmEmail on:close={() => (showConfirmEmail = false)} />
	{/if}

	<section class="register-container">
		<form class="register-form" on:submit|preventDefault={handleSubmit}>
			<h2 class="register-form__title">Регистрация</h2>
			<div class="input-container">
				<UserIcon />
				<input
					class="register-form__input"
					type="text"
					bind:value={username}
					placeholder="Имя"
					required
					minlength="4"
					maxlength="32"
				/>
			</div>

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

			<button class="register-form__button" type="submit">Зарегистрироваться</button>

			<p class="register-form__have-acc">Уже зарегистрирован? <a href="/login">Войти</a></p>
		</form>
	</section>
</div>

<style lang="scss">
	.register-page {
		position: relative;
		min-height: 100vh;

		.register-container {
			display: flex;
			justify-content: center;
			align-items: center;
			min-height: 100vh;
			background-image: url(../../assets/images/background.jpg);
			background-size: cover;
			background-position: center;
			background-repeat: no-repeat;

			.register-form {
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

				.register-form__title {
					text-align: center;
					font-size: 2.2rem;
					color: var(--text-color);
				}

				.input-container {
					position: relative;
					width: 100%;

					.register-form__input {
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
				}

				.register-form__button {
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

				.register-form__have-acc {
					text-align: center;
					font-size: 16px;
					color: var(--text-color);
				}
			}
		}
	}
</style>
