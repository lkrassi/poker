<script lang="ts">
	import LobbyCard from './LobbyCard.svelte';

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

	export let lobbies: Lobby[];
</script>

<div class="lobby-list">
	{#if lobbies.length === 0}
		<p class="lobby-list__empty">Нет активных лобби. Создайте новое или проверьте позже.</p>
	{:else}
		{#each lobbies as lobby}
			<LobbyCard info={lobby.info} />
		{/each}
	{/if}
</div>

<style lang="scss">
	.lobby-list {
		display: flex;
		flex-wrap: wrap;
		gap: 20px;
		justify-content: center;

		&__empty {
			text-align: center;
			font-size: 1.2rem;
			color: var(--text-color);
		}
	}
</style>
