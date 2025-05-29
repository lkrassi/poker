<script lang="ts">
	import { apiFacade } from '../../../shared/lib/api/apiFacade';

	import { emailStore } from '../model/stores/emailStore';
	import { showMessage } from '../../../shared/model/stores/messageStore';
	import { openModal } from '../../../shared/model/stores/modalStore';

	import { withLoader } from '../../../shared/lib/utils/loader';

	import ConfirmEmailForm from './ConfirmEmailForm.svelte';
	import UserIcon from '../../../shared/assets/icons/UserIcon.svelte';
	import EmailIcon from '../../../shared/assets/icons/EmailIcon.svelte';
	import PasswordIcon from '../../../shared/assets/icons/PasswordIcon.svelte';

	let username: string = '';
	let email: string = '';
	let password: string = '';

	const handleSubmit = async (): Promise<void> => {
		const result = await withLoader(apiFacade.registerUser(username, email, password));

		if (result.success) {
			showMessage('success', 'Теперь код подтверждения будет отправлен на ваш email!');
			emailStore.set(email);

			openModal(ConfirmEmailForm, {
				containerClass: 'confirm-email-modal',
				closable: false
			});
		} else {
			showMessage('error', result.message || 'Ошибка регистрации');
		}
	};
</script>

<section class="register-container">
	<form class="register-form" on:submit|preventDefault={handleSubmit}>
		<h2 class="register-form__title">Регистрация</h2>
		<div class="register-form__input-container">
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

		<div class="register-form__input-container">
			<EmailIcon />
			<input
				class="register-form__input"
				type="email"
				bind:value={email}
				placeholder="Email"
				required
			/>
		</div>

		<div class="register-form__input-container">
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

<style lang="scss">
	.register-container {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 100vh;

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

			&__have-acc {
				text-align: center;
				font-size: 16px;
				color: var(--text-color);
			}
		}
	}
</style>
