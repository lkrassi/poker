<script lang="ts">
	import { goto } from '$app/navigation';

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

	export let info: LobbyInfo;

	const formatTime = (timeString: string) => {
		return new Date(timeString).toLocaleTimeString();
	};

	const handleJoinLobby = (lobbyId: string) => {
		goto(`/table?lobby=${lobbyId}`);
	};
</script>

<div class="lobby-card">
	<div class="lobby-card__header">
		<h3 class="lobby-card__title">
			Кэш-игра #{info.lobby_id.slice(0, 8)}
		</h3>
		<div class="lobby-card__players">
			Игроки: {info.current_players_count}/{info.max_players}
		</div>
	</div>

	<div class="lobby-card__body">
		<div class="lobby-card__row">
			<span>Блайнд:</span>
			<span>{info.small_blind}/{info.small_blind * 2}</span>
		</div>
		<div class="lobby-card__row">
			<span>Анте:</span>
			<span>{info.ante}</span>
		</div>
		<div class="lobby-card__row">
			<span>Банк:</span>
			<span>{info.bank_amount}</span>
		</div>
		<div class="lobby-card__row">
			<span>След. уровень:</span>
			<span>{formatTime(info.last_blind_increase_time)}</span>
		</div>
	</div>

	<button class="lobby-card__join-button" on:click={() => handleJoinLobby(info.lobby_id)}>
		Присоединиться
	</button>
</div>

<style lang="scss">
	.lobby-card {
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

		&__header {
			border-bottom: 1px solid var(--border-color);
			padding-bottom: 10px;
			margin-bottom: 10px;
		}

		&__title {
			margin-bottom: 8px;
			font-size: 1.2rem;
			color: var(--text-color);
		}

		&__body {
			display: flex;
			flex-direction: column;
			gap: 8px;
			flex-grow: 1;
		}

		&__row {
			display: flex;
			justify-content: space-between;
			font-size: 0.95rem;
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
		.lobby-card {
			flex: 1 1 100%;
		}
	}
</style>
