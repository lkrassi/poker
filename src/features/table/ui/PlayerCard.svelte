<script lang="ts">
	import type { Player } from '../model/types/types';

	export let player: Player;
	export let position: { left: string; top: string };
	export let isCurrentPlayer: boolean;

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

<div
	class="player"
	class:current-player={isCurrentPlayer}
	style="left: {position.left}; top: {position.top}"
	data-player-id={player.id}
>
	<div class="player__avatar">
		<img src={player.profile_picture_url} alt={player.username} />
	</div>
	<div class="player__info">
		<div class="player__name">{player.username}</div>
		<div class="player__balance">{player.balance}</div>
		<div class="player__cards">
			{#if player.cards}
				{#each player.cards as card}
					<div class="card card--small" data-card={card}>
						<div class="card__value">{card.slice(0, -1)}</div>
						<div class="card__suit">{getSuitSymbol(card.slice(-1))}</div>
					</div>
				{/each}
			{:else}
				<div class="card-place card-place--small"></div>
				<div class="card-place card-place--small"></div>
			{/if}
		</div>
	</div>
</div>

<style lang="scss">
	.player {
		position: absolute;
		transform: translate(-50%, -50%);
		background: rgba(0, 0, 0, 0.8);
		padding: 0.5rem;
		border-radius: 1rem;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		min-width: 10rem;
		transition: 0.3s ease;

		&.current-player {
			background: rgba(33, 150, 243, 0.9);
			box-shadow: 0 0 15px rgba(33, 150, 243, 0.5);
			transform: translate(-50%, -50%) scale(1.05);
			z-index: 2;

			.player__name {
				color: white;
				font-weight: bold;
			}

			.player__balance {
				color: #fff;
			}
		}

		&__avatar {
			position: relative;
			width: 4rem;
			height: 4rem;
			border-radius: 50%;
			overflow: hidden;

			img {
				width: 100%;
				height: 100%;
				object-fit: cover;
			}
		}

		&__info {
			flex: 1;
			font-size: 0.9rem;
		}

		&__name {
			color: white;
			font-size: 1rem;
			margin-bottom: 0.2rem;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}

		&__balance {
			color: #4caf50;
			font-size: 0.9rem;
		}

		&__cards {
			display: flex;
			gap: 0.3rem;
			margin-top: 0.5rem;
		}
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

		&--small {
			width: 3rem;
			height: 5rem;
		}

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
			width: 3rem;
			height: 5rem;
		}

		&:hover {
			background: rgba(255, 255, 255, 0.15);
		}
	}

	@media screen and (max-width: 1200px) {
		.player {
			min-width: 9rem;
			padding: 0.4rem;

			&__avatar {
				width: 3.5rem;
				height: 3.5rem;
			}

			&__info {
				font-size: 0.85rem;
			}

			&__name {
				font-size: 0.95rem;
			}
		}

		.card--small {
			width: 2.8rem;
			height: 4.5rem;
		}

		.card-place {
			&--small {
				width: 2.8rem;
				height: 4.5rem;
			}
		}
	}

	@media screen and (max-width: 992px) {
		.player {
			min-width: 8rem;
			padding: 0.35rem;

			&__avatar {
				width: 3rem;
				height: 3rem;
			}

			&__info {
				font-size: 0.8rem;
			}

			&__name {
				font-size: 0.9rem;
			}
		}

		.card--small {
			width: 2.5rem;
			height: 4rem;
		}

		.card-place {
			&--small {
				width: 2.5rem;
				height: 4rem;
			}
		}
	}

	@media screen and (max-width: 768px) {
		.player {
			min-width: 7rem;
			padding: 0.3rem;

			&__avatar {
				width: 2.5rem;
				height: 2.5rem;
			}

			&__info {
				font-size: 0.75rem;
			}

			&__name {
				font-size: 0.85rem;
			}
		}

		.card--small {
			width: 2.2rem;
			height: 3.5rem;
		}

		.card-place {
			&--small {
				width: 2.2rem;
				height: 3.5rem;
			}
		}
	}

	@media screen and (max-width: 576px) {
		.player {
			min-width: 6rem;
			padding: 0.25rem;

			&__avatar {
				width: 2rem;
				height: 2rem;
			}

			&__info {
				font-size: 0.7rem;
			}

			&__name {
				font-size: 0.8rem;
			}

			&__cards {
				gap: 0.2rem;
			}
		}

		.card--small {
			width: 2rem;
			height: 3rem;
		}

		.card-place {
			&--small {
				width: 2rem;
				height: 3rem;
			}
		}
	}
</style>
