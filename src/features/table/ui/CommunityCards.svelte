<script lang="ts">
	import { gameStore } from '../model/stores/gameStore';

	const getSuitSymbol = (suit: string): string => {
		const suitMap: { [key: string]: string } = {
			H: '♥',
			D: '♦',
			C: '♣',
			S: '♠'
		};
		return suitMap[suit] || suit;
	};
</script>

<div class="community-cards">
	{#each $gameStore.communityCards as card}
		<div class="card" data-card={card}>
			<div class="card__value">{card.slice(0, -1)}</div>
			<div class="card__suit">{getSuitSymbol(card.slice(-1))}</div>
		</div>
	{:else}
		{#each Array(5) as _}
			<div class="card-place card-place--small"></div>
		{/each}
	{/each}
</div>

<style lang="scss">
	.community-cards {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		display: flex;
		gap: 0.5rem;
		z-index: 1;
	}

	.card {
		background: var(--text-color);
		border-radius: 0.3rem;
		padding: 0.3rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
		position: relative;
		transition: all 0.3s ease;
		width: 4rem;
		height: 6rem;

		&[data-card$='H'],
		&[data-card$='D'] {
			color: red;
		}

		&[data-card$='C'],
		&[data-card$='S'] {
			color: black;
		}

		&__value {
			font-weight: bold;
			margin-bottom: 0.2rem;
		}

		&__suit {
			font-size: 0.8em;
		}
	}

	.card-place {
		background: rgba(255, 255, 255, 0.1);
		border: 2px dashed rgba(255, 255, 255, 0.3);
		border-radius: 0.3rem;
		transition: all 0.3s ease;

		&--small {
			width: 4rem;
			height: 6rem;
		}

		&:hover {
			background: rgba(255, 255, 255, 0.15);
		}
	}

	@media screen and (max-width: 576px) {
		.card {
			width: 2rem;
			height: 4rem;
		}

		.card-place {
			width: 2rem;
			height: 4rem;
		}

		.community-cards {
			margin-top: 3rem;
		}
	}
</style>
