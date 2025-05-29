<script lang="ts">
	import { apiFacade } from '../../../shared/lib/api/apiFacade';

	import { showMessage } from '../../../shared/model/stores/messageStore';

	import { onMount } from 'svelte';

	import LobbyList from './LobbyList.svelte';
	import Pagination from './Pagination.svelte';

	interface LobbyInfo {
		lobby_id: string;
		blind_increase_time: number;
		last_blind_increase_time: string;
		max_players: number;
		min_players_to_start: number;
		current_players_count: number;
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

	onMount(() => {
		fetchLobbies(0);
	});

	const fetchLobbies = async (page: number = 0) => {
		try {
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
		} catch (error) {
			showMessage('error', 'Не удалось загрузить лобби');
		}
	};

	const handlePageChange = (page: number) => {
		fetchLobbies(page);
	};
</script>

<section class="search-lobby">
	<div class="search-lobby__container">
		<h1 class="search-lobby__title">Доступные лобби</h1>
		<div class="search-lobby__controls">
			<button class="search-lobby__button" on:click={() => fetchLobbies(currentPage)}
				>Обновить список</button
			>
			<Pagination {currentPage} {totalPages} onPageChange={handlePageChange} />
		</div>

		<LobbyList {lobbies} />
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

		&__controls {
			display: flex;
			flex-direction: column;
			align-items: center;
			margin: 0 0 1rem;
		}

		&__button {
			display: block;
			padding: 10px 20px;
			margin: 0 0 1rem;

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
	}

	@media (max-width: 576px) {
		.search-lobby {
			margin: 6rem 0 0;
		}
	}
</style>
