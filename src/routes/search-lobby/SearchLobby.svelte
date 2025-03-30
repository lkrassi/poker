<script lang="ts">
	import { apiFacade } from '$lib/apiFacade';
	import { showMessage } from '../../stores/messageStore';

	interface Lobby {
		lobby_id: string;
		max_players: number;
		min_players_to_start: number;
		current_players_count: number;
		cache_game: boolean;
		small_blind: number;
		ante: number;
		bank_amount: number;
		blind_increase_time: number;
		last_blind_increase_time: string;
	}

	let lobbies: Lobby[] = [];

	const fetchLobbies = async () => {
		const response = await apiFacade.getAllLobbies(0);

		if (response.success) {
			lobbies = response.lobbies;
		} else {
			showMessage('error', response.message || 'Ошибка при загрузке лобби');
		}
	};

	const formatTime = (timeString: string) => {
		return new Date(timeString).toLocaleTimeString();
	};
</script>

<section class="search-lobby">
	<div class="search-lobby__container">
		<h1 class="search-lobby__title">Доступные лобби</h1>
		<button class="search-lobby__button" on:click={fetchLobbies}>Обновить список</button>

		<div class="search-lobby__list">
			{#if lobbies.length === 0}
				<p class="search-lobby__empty">Нет активных лобби. Создайте новое или проверьте позже.</p>
			{:else}
				{#each lobbies as lobby}
					<div class="search-lobby__card">
						<div class="search-lobby__card-header">
							<h3 class="search-lobby__card-title">
								{lobby.cache_game ? 'Кэш-игра' : 'Sit&Go-игра'} #{lobby.lobby_id.slice(0, 8)}
							</h3>
							<div class="search-lobby__players">
								Игроки: {lobby.current_players_count}/{lobby.max_players}
								{#if lobby.current_players_count < lobby.min_players_to_start}
									<span class="search-lobby__waiting">(ожидание игроков)</span>
								{:else}
									<span class="search-lobby__ready">(можно начинать)</span>
								{/if}
							</div>
						</div>

						<div class="search-lobby__card-body">
							<div class="search-lobby__card-row">
								<span>Блайнд:</span>
								<span>{lobby.small_blind}/{lobby.small_blind * 2}</span>
							</div>
							<div class="search-lobby__card-row">
								<span>Анте:</span>
								<span>{lobby.ante}</span>
							</div>
							<div class="search-lobby__card-row">
								<span>Банк:</span>
								<span>{lobby.bank_amount}</span>
							</div>
							<div class="search-lobby__card-row">
								<span>След. уровень:</span>
								<span>{formatTime(lobby.last_blind_increase_time)}</span>
							</div>
						</div>

						<button class="search-lobby__join-button">Присоединиться</button>
					</div>
				{/each}
			{/if}
		</div>
	</div>
</section>

<style lang="scss">
	.search-lobby {
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

		&__button {
			display: block;
			margin: 0 auto;
			padding: 10px 20px;
			color: var(--text-color);
			background-color: var(--primary-color);
			border: none;
			border-radius: 15px;
			cursor: pointer;
			font-size: 1rem;
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

		&__list {
			display: flex;
			flex-wrap: wrap;
			gap: 20px;
			justify-content: center;
		}

		&__empty {
			text-align: center;
			font-size: 1.2rem;
			color: var(--text-color);
		}

		&__card {
			flex: 1 1 calc(33.333% - 20px);
			min-width: 250px;
			box-sizing: border-box;
			padding: 15px;
			border: 1px solid var(--border-color);
			border-radius: 15px;
			box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
			display: flex;
			flex-direction: column;
			gap: 12px;

			&-header {
				border-bottom: 1px solid var(--border-color);
				padding-bottom: 10px;
				margin-bottom: 10px;
			}

			&-title {
				margin-bottom: 8px;
				font-size: 1.2rem;
				color: var(--text-color);
			}

			&-body {
				display: flex;
				flex-direction: column;
				gap: 8px;
				flex-grow: 1;
			}

			&-row {
				display: flex;
				justify-content: space-between;
				font-size: 0.95rem;
			}
		}

		&__waiting {
			color: var(--warning-color);
		}

		&__ready {
			color: var(--success-color);
		}

		&__join-button {
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
		.search-lobby {
			margin: 6rem 0 0;

			&__card {
				flex: 1 1 100%;
			}
		}
	}
</style>
