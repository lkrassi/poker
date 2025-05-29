<script lang="ts">
	import { connect, disconnect } from '../model/services/utils/websocketService';

	import { gameStore } from '../model/stores/gameStore';

	import { onMount } from 'svelte';

	import PlayerCard from './PlayerCard.svelte';
	import ActionButtons from './ActionButtons.svelte';
	import CommunityCards from './CommunityCards.svelte';
	import Bank from './Bank.svelte';

	export let lobbyId: string;
	let maxPlayers = 10;

	let emptySeats: number;
	let emptySeatsArray: null[];
	let playerPositions: Array<{ left: string; top: string }> = [];
	let emptySeatPositions: Array<{ left: string; top: string }> = [];
	let tableRect: DOMRect;
	let horizontalRadius = 0.45;
	let verticalRadius = 0.35;
	let isMounted = false;

	onMount(() => {
		isMounted = true;
		connect(lobbyId);
		updateTableRect();
		window.addEventListener('resize', handleResize);

		return () => {
			disconnect();
			window.removeEventListener('resize', handleResize);
		};
	});

	const updateTableRect = () => {
		if (!isMounted) return;
		const tableElement = document.querySelector('.table');
		if (tableElement) {
			tableRect = tableElement.getBoundingClientRect();
		}
	};

	const handleResize = () => {
		if (!isMounted) return;
		if (window.innerWidth >= 1200) {
			horizontalRadius = 0.45;
			verticalRadius = 0.35;
		} else if (window.innerWidth >= 992) {
			horizontalRadius = 0.4;
			verticalRadius = 0.4;
		} else if (window.innerWidth >= 768) {
			horizontalRadius = 0.35;
			verticalRadius = 0.42;
		} else if (window.innerWidth >= 576) {
			horizontalRadius = 0.3;
			verticalRadius = 0.45;
		} else if (window.innerWidth >= 280) {
			horizontalRadius = 0.3;
			verticalRadius = 0.65;
		} else {
			horizontalRadius = 0.25;
			verticalRadius = 0.48;
		}
		updatePositions();
	};

	const updatePositions = () => {
		if (!isMounted) return;
		updateTableRect();
		playerPositions = $gameStore.players.map((player, index: number) => {
			const angle = (index * 360) / maxPlayers;
			const hRadius =
				Math.min(tableRect?.width || 800, tableRect?.height || 600) * horizontalRadius;
			const vRadius = Math.min(tableRect?.width || 800, tableRect?.height || 600) * verticalRadius;
			return {
				left: `calc(50% + ${hRadius * Math.cos((angle - 90) * (Math.PI / 180))}px)`,
				top: `calc(50% + ${vRadius * Math.sin((angle - 90) * (Math.PI / 180))}px)`
			};
		});

		emptySeatPositions = emptySeatsArray.map((_, index: number) => {
			const angle = (($gameStore.players.length + index) * 360) / maxPlayers;
			const hRadius =
				Math.min(tableRect?.width || 800, tableRect?.height || 600) * horizontalRadius;
			const vRadius = Math.min(tableRect?.width || 800, tableRect?.height || 600) * verticalRadius;
			return {
				left: `calc(50% + ${hRadius * Math.cos((angle - 90) * (Math.PI / 180))}px)`,
				top: `calc(50% + ${vRadius * Math.sin((angle - 90) * (Math.PI / 180))}px)`
			};
		});
	};

	$: if ($gameStore.lobbyInfo) {
		maxPlayers = $gameStore.lobbyInfo.max_players;
	}

	$: emptySeats = maxPlayers - $gameStore.players.length;
	$: emptySeatsArray = Array(emptySeats).fill(null);

	$: if (isMounted && ($gameStore.players.length > 0 || emptySeatsArray.length > 0)) {
		updatePositions();
	}
</script>

<div class="table">
	<div class="table__content">
		<CommunityCards />
		<Bank />
		<ActionButtons />

		{#each $gameStore.players as player, index}
			<PlayerCard
				{player}
				position={playerPositions[index]}
				isCurrentPlayer={player.id === $gameStore.currentPlayerId}
			/>
		{/each}
	</div>
</div>

<style lang="scss">
	.table {
		position: relative;
		width: 100%;
		height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		padding: 1rem 0;
		box-sizing: border-box;

		&__content {
			position: relative;
			width: 100%;
			height: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}

	@media screen and (max-width: 1200px) {
		.table {
			padding: 1.5rem;
		}
	}

	@media screen and (max-width: 992px) {
		.table {
			padding: 1rem;
		}
	}

	@media screen and (max-width: 768px) {
		.table {
			padding: 0.75rem;
		}
	}

	@media screen and (max-width: 576px) {
		.table {
			padding: 0.5rem;
		}
	}
</style>
