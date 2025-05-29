<script lang="ts">
	import { gameStore } from '../model/stores/gameStore';

	const getChipDistribution = (amount: number): Array<{ value: number; count: number }> => {
		const denominations = [500, 200, 100, 50, 25, 10, 5, 1];
		const distribution: Array<{ value: number; count: number }> = [];
		let remaining = amount;

		for (const value of denominations) {
			const count = Math.floor(remaining / value);
			if (count > 0) {
				distribution.push({ value, count });
				remaining -= count * value;
			}
		}

		return distribution;
	};
</script>

<div class="bank">
	<div class="bank__amount">{$gameStore.bank}</div>
	<div class="bank__chips">
		{#each getChipDistribution($gameStore.bank) as { value, count }}
			{#each Array(count) as _}
				<img
					src={`/images/${
						value === 500
							? 'fivehundred'
							: value === 200
								? 'twohundred'
								: value === 100
									? 'hundred'
									: value === 50
										? 'fifty'
										: value === 25
											? 'twentyfive'
											: value === 10
												? 'ten'
												: value === 5
													? 'five'
													: 'one'
					}.png`}
					alt={`${value} chip`}
					class="chip"
				/>
			{/each}
		{/each}
	</div>
</div>

<style lang="scss">
	.bank {
		position: absolute;
		top: calc(50% + 7rem);
		left: 50%;
		transform: translate(-50%, -50%);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		z-index: 1;

		&__amount {
			color: var(--text-color);
			font-size: 1.5rem;
			font-weight: bold;
			text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
		}

		&__chips {
			display: flex;
			gap: 0.3rem;
			flex-wrap: wrap;
			justify-content: center;
		}
	}

	.chip {
		width: 4rem;
		height: 4rem;
		position: relative;
		transform-style: preserve-3d;
		transition: transform 0.2s ease;

		&:hover {
			transform: translateY(-0.2rem);
		}
	}

	@media screen and (max-width: 576px) {
		.bank {
			margin-top: 2rem;
		}

		.chip {
			width: 3rem;
			height: 3rem;
		}
	}
</style>
