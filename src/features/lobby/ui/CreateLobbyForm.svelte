<script lang="ts">
	import { apiFacade } from '../../../shared/lib/api/apiFacade';

	import { showMessage } from '../../../shared/model/stores/messageStore';

	import TimeIcon from '../../../shared/assets/icons/TimeIcon.svelte';
	import UserIcon from '../../../shared/assets/icons/UserIcon.svelte';
	import ChipIcon from '../../../shared/assets/icons/ChipIcon.svelte';

	let blindIncreaseTime: number | null = null;
	let maxPlayers: number | null = null;
	let smallBlind: number | null = null;

	const resetForm = () => {
		blindIncreaseTime = null;
		maxPlayers = null;
		smallBlind = null;
	};

	const handleCreateLobby = async () => {
		const blindIncreaseTimeFormatted = blindIncreaseTime ? `${blindIncreaseTime}m` : '15m';

		const isDefaultSettings =
			blindIncreaseTime === null && maxPlayers === null && smallBlind === null;

		const response = await apiFacade.createLobby({
			blind_increase_time: blindIncreaseTimeFormatted,
			max_players: maxPlayers || 2,
			small_blind: smallBlind || 0
		});

		if (response.success) {
			const message = isDefaultSettings
				? 'Лобби успешно создано с настройками по умолчанию'
				: 'Лобби успешно создано!';

			showMessage('success', message);
			resetForm();
		} else {
			showMessage('error', response.message || 'Ошибка при создании лобби');
		}
	};
</script>

<section class="create-lobby">
	<div class="create-lobby__container">
		<h1 class="create-lobby__title">Создание лобби</h1>
		<div class="create-lobby__game-mode">
			<h2>Кэш игра</h2>
		</div>
		<form class="create-lobby__form" on:submit|preventDefault={handleCreateLobby}>
			<div class="create-lobby__input-container">
				<TimeIcon />
				<input
					type="number"
					id="blindIncreaseTime"
					class="create-lobby__input"
					bind:value={blindIncreaseTime}
					min="1"
					placeholder="Время увеличения блайндов (в минутах)"
				/>
			</div>

			<div class="create-lobby__input-container">
				<UserIcon />
				<input
					type="number"
					id="maxPlayers"
					class="create-lobby__input"
					bind:value={maxPlayers}
					min="2"
					max="10"
					placeholder="Максимальное количество игроков"
				/>
			</div>

			<div class="create-lobby__input-container">
				<ChipIcon />
				<input
					type="number"
					id="smallBlind"
					class="create-lobby__input"
					bind:value={smallBlind}
					min="0"
					placeholder="Малый блайнд"
				/>
			</div>

			<button class="create-lobby__submit-button" type="submit">Создать лобби</button>
		</form>
	</div>
</section>

<style lang="scss">
	.create-lobby {
		display: flex;
		justify-content: center;
		align-items: center;

		&__container {
			display: flex;
			flex-direction: column;
			width: 100%;
			max-width: 800px;
			background: transparent;
			backdrop-filter: blur(10px);
			padding: 2rem;
			border-radius: 1.5rem;
			border: 1px solid rgba(255, 255, 255, 0.2);
			box-shadow: 0 4px 10px var(--box-shadow-color);
		}

		&__title {
			text-align: center;
			font-size: 2.2rem;
			color: var(--text-color);
			margin: 0 0 1rem;
		}

		&__game-mode {
			text-align: center;
			margin: 0 0 1rem;
			font-size: 1.2rem;
		}

		&__form {
			display: flex;
			flex-direction: column;
			gap: 1rem;
		}

		&__input-container {
			position: relative;
			display: flex;
			align-items: center;
		}

		&__input {
			width: 100%;
			padding: 15px 15px 15px 40px;
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
			}
		}

		&__submit-button {
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
	}

	@media (max-width: 576px) {
		.create-lobby {
			margin: 6rem 0 0;

			&__title {
				font-size: 1.8rem;
			}

			&__input {
				&::placeholder {
					font-size: 0.7rem;
				}
			}
		}
	}
</style>
