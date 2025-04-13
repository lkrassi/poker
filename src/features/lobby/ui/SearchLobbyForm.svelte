<script lang="ts">
	import { apiFacade } from '../../../shared/index';

	interface LobbyInfo {
		lobby_id: string;
		blind_increase_time: number;
		last_blind_increase_time: string;
		max_players: number;
		min_players_to_start: number;
		current_players_count: number;
		cache_game: boolean;
		small_blind: number;
		ante: number;
		bank_amount: number;
	}

	interface Lobby {
		info: LobbyInfo;
		players: any;
	}

	interface ApiResponse {
		success: boolean;
		lobbies?: Lobby[];
		message?: string;
		total?: number;
	}

	let lobbies: Lobby[] = [];
	let currentPage = 0;
	let totalPages = 1;
	const LOBBY_PER_PAGE = 50;

	const fetchLobbies = async (page: number = 0) => {
		const response: ApiResponse = await apiFacade.getAllLobbies(page);

		if (response.success && response.lobbies) {
			lobbies = response.lobbies;
			totalPages = response.total
				? Math.ceil(response.total / LOBBY_PER_PAGE)
				: response.lobbies.length === LOBBY_PER_PAGE
					? currentPage + 2
					: currentPage + 1;
			currentPage = page;
		}
	};

	const nextPage = () => {
		if (currentPage < totalPages - 1) {
			fetchLobbies(currentPage + 1);
		}
	};

	const prevPage = () => {
		if (currentPage > 0) {
			fetchLobbies(currentPage - 1);
		}
	};

	const formatTime = (timeString: string) => {
		return new Date(timeString).toLocaleTimeString();
	};

	fetchLobbies(0);
</script>

<section class="search-lobby">
	<div class="search-lobby__container">
		<h1 class="search-lobby__title">Доступные лобби</h1>
		<div class="search-lobby__controls">
			<button class="search-lobby__button" on:click={() => fetchLobbies(currentPage)}
				>Обновить список</button
			>
			<div class="search-lobby__pagination">
				<button class="search-lobby__page-button" on:click={prevPage} disabled={currentPage === 0}>
					← Назад
				</button>
				<span class="search-lobby__page-info">
					{currentPage + 1} из {totalPages}
				</span>
				<button
					class="search-lobby__page-button"
					on:click={nextPage}
					disabled={currentPage >= totalPages - 1}
				>
					Вперед →
				</button>
			</div>
		</div>

		<div class="search-lobby__list">
			{#if lobbies.length === 0}
				<p class="search-lobby__empty">Нет активных лобби. Создайте новое или проверьте позже.</p>
			{:else}
				{#each lobbies as lobby}
					<div class="search-lobby__card">
						<div class="search-lobby__card-header">
							<h3 class="search-lobby__card-title">
								{lobby.info.cache_game ? 'Кэш-игра' : 'Sit&Go-игра'} #{lobby.info.lobby_id.slice(
									0,
									8
								)}
							</h3>
							<div class="search-lobby__players">
								Игроки: {lobby.info.current_players_count}/{lobby.info.max_players}
							</div>
						</div>

						<div class="search-lobby__card-body">
							<div class="search-lobby__card-row">
								<span>Блайнд:</span>
								<span>{lobby.info.small_blind}/{lobby.info.small_blind * 2}</span>
							</div>
							<div class="search-lobby__card-row">
								<span>Анте:</span>
								<span>{lobby.info.ante}</span>
							</div>
							<div class="search-lobby__card-row">
								<span>Банк:</span>
								<span>{lobby.info.bank_amount}</span>
							</div>
							<div class="search-lobby__card-row">
								<span>След. уровень:</span>
								<span>{formatTime(lobby.info.last_blind_increase_time)}</span>
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

		&__controls {
			display: flex;
			flex-direction: column;
			gap: 15px;
			align-items: center;
		}

		&__button {
			display: block;
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

		&__pagination {
			display: flex;
			align-items: center;
			gap: 15px;
		}

		&__page-button {
			padding: 8px 15px;
			color: var(--text-color);
			background-color: var(--primary-color);
			border: none;
			border-radius: 10px;
			cursor: pointer;
			font-size: 0.9rem;
			transition: 0.3s ease;

			&:hover:not(:disabled),
			&:focus:not(:disabled) {
				background-color: var(--primary-color-hover);
				transform: scale(1.01);
			}

			&:active:not(:disabled) {
				transform: scale(0.99);
			}

			&:disabled {
				opacity: 0.5;
				cursor: not-allowed;
			}
		}

		&__page-info {
			font-size: 0.9rem;
			color: var(--text-color);
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

			&__pagination {
				gap: 10px;
			}

			&__page-button {
				padding: 6px 10px;
				font-size: 0.8rem;
			}

			&__page-info {
				font-size: 0.8rem;
			}
		}
	}
</style>
