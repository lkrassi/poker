<script lang="ts">
	import { apiFacade } from '$lib/apiFacade';

	import MoneyIcom from '$icons/MoneyIcom.svelte';
	import TimeIcon from '$icons/TimeIcon.svelte';
	import UserIcon from '$icons/UserIcon.svelte';
	import ChipIcon from '$icons/ChipIcon.svelte';

	import { showMessage } from '$stores/ui/messageStore';

	let ante: number | null = null;
	let blindIncreaseTime: number | null = null;
	let cacheGame = true;
	let maxPlayers: number | null = null;
	let smallBlind: number | null = null;

	const handleCreateLobby = async () => {
		const blindIncreaseTimeFormatted = blindIncreaseTime ? `${blindIncreaseTime}m` : '15m';

		const isDefaultSettings =
			ante === null && blindIncreaseTime === null && maxPlayers === null && smallBlind === null;

		const response = await apiFacade.createLobby({
			ante: ante || 0,
			blind_increase_time: blindIncreaseTimeFormatted,
			cache_game: cacheGame,
			max_players: maxPlayers || 2,
			small_blind: smallBlind || 0
		});

		if (response.success) {
			const message = isDefaultSettings
				? 'Лобби успешно создано с настройками по умолчанию'
				: 'Лобби успешно создано!';
			showMessage('success', message);
		} else {
			showMessage('error', response.message || 'Ошибка при создании лобби');
		}
	};

	const setGameMode = (mode: 'cache' | 'sitngo') => {
		cacheGame = mode === 'cache';
	};
</script>

<section class="create-lobby">
	<div class="create-lobby__container">
		<h1 class="create-lobby__title">Создание лобби</h1>
		<h1 class="create-lobby__title">Тип лобби</h1>
		<div class="create-lobby__game-mode">
			<button
				class="create-lobby__game-mode-button {cacheGame ? 'active' : ''}"
				on:click={() => setGameMode('cache')}
			>
				Кэш
			</button>
			<button
				class="create-lobby__game-mode-button {!cacheGame ? 'active' : ''}"
				on:click={() => setGameMode('sitngo')}
			>
				Sit & Go
			</button>
		</div>
		<form class="create-lobby__form" on:submit|preventDefault={handleCreateLobby}>
			<div class="create-lobby__input-container">
				<MoneyIcom />
				<input
					type="number"
					id="ante"
					class="create-lobby__input"
					bind:value={ante}
					min="0"
					placeholder="Анте"
				/>
			</div>

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
			gap: 20px;
			width: 100%;
			max-width: 800px;
			background: transparent;
			backdrop-filter: blur(10px);
			padding: 20px;
			border-radius: 15px;
			border: 1px solid rgba(255, 255, 255, 0.2);
			box-shadow: 0 4px 10px var(--box-shadow-color);
		}

		&__title {
			text-align: center;
			font-size: 2.2rem;
			color: var(--text-color);
		}

		&__game-mode {
			display: flex;
			justify-content: space-between;
			margin-bottom: 1rem;

			&-button {
				flex: 1;
				margin: 0 2rem;
				color: var(--text-color);
				background-color: var(--primary-color);
				transition: 0.3s ease;

				&:hover,
				&:focus {
					background-color: var(--primary-color-hover);
					transform: scale(1.01);
				}

				&.active {
					background-color: var(--primary-color-hover);
					transform: scale(0.99);
				}
			}
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
				box-shadow: 0 0 8px rgba(var(--primary-color-rgb), 0.4);
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

			&__game-mode {
				flex-direction: column;
				row-gap: 1rem;
			}

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
