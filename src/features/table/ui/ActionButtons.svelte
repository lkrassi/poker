<script lang="ts">
	import { sendAction } from '../model/services/utils/websocketService';

	import { gameStore } from '../model/stores/gameStore';

	$: currentPlayer = $gameStore.players.find((p) => p.id === $gameStore.currentPlayerId);
	$: minRaise = $gameStore.availableActions.callAmount * 2;
	$: maxRaise = currentPlayer?.balance ?? 0;
	$: raiseAmount = minRaise;
	$: canRaise = (currentPlayer?.balance ?? 0) >= minRaise;
	$: isCurrentPlayerTurn = $gameStore.currentPlayerId === currentPlayer?.id;
	$: canMakeAction =
		isCurrentPlayerTurn &&
		($gameStore.availableActions.canCall || $gameStore.availableActions.canCheck);

	const handleRaise = () => {
		if (canRaise && canMakeAction) {
			sendAction('raise', raiseAmount);
		}
	};
</script>

<div class="actions">
	<button class="action-button action-button--fold" on:click={() => sendAction('fold')}>
		Fold
	</button>

	<button
		class="action-button action-button--check"
		class:disabled={!$gameStore.availableActions.canCheck}
		on:click={() => $gameStore.availableActions.canCheck && sendAction('check')}
	>
		Check
	</button>

	<button
		class="action-button action-button--call"
		class:disabled={!$gameStore.availableActions.canCall}
		on:click={() =>
			$gameStore.availableActions.canCall &&
			sendAction('call', $gameStore.availableActions.callAmount)}
	>
		Call {$gameStore.availableActions.callAmount}
	</button>

	<div class="raise-action">
		{#if canRaise}
			<div class="raise-controls">
				<input
					type="range"
					min={minRaise}
					max={maxRaise}
					step={$gameStore.availableActions.callAmount}
					bind:value={raiseAmount}
					class="raise-slider"
					class:disabled={!canMakeAction}
					disabled={!canMakeAction}
				/>
			</div>
		{/if}
		<button
			class="action-button action-button--raise"
			class:disabled={!canRaise || !canMakeAction}
			on:click={handleRaise}
		>
			Raise {raiseAmount}
		</button>
	</div>
</div>

<style lang="scss">
	.actions {
		position: absolute;
		bottom: 2rem;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		gap: 1rem;
		align-items: center;
		z-index: 2;
	}

	.raise-action {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		row-gap: 1rem;
	}

	.raise-controls {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		min-width: 200px;
	}

	.raise-slider {
		width: 100%;
		height: 4px;
		background: var(--primary-color);
		border-radius: 2px;
		outline: none;
		transition: opacity 0.3s ease;

		&.disabled {
			opacity: 0.5;
			cursor: not-allowed;
			pointer-events: all;
		}

		&::-webkit-slider-thumb {
			-webkit-appearance: none;
			width: 16px;
			height: 16px;
			background: var(--primary-color);
			border-radius: 50%;
			cursor: pointer;
			transition: 0.3s ease;

			&:hover {
				transform: scale(1.1);
			}
		}

		&::-moz-range-thumb {
			width: 16px;
			height: 16px;
			background: var(--primary-color);
			border-radius: 50%;
			cursor: pointer;
			border: none;
			transition: 0.3s ease;

			&:hover {
				transform: scale(1.1);
			}
		}
	}

	.action-button {
		padding: 0.8rem 1.5rem;
		border: none;
		border-radius: 0.5rem;
		font-size: 1rem;
		font-weight: bold;
		color: var(--text-color);
		background-color: var(--primary-color);
		cursor: pointer;
		transition: 0.3s ease;

		&:hover:not(.disabled),
		&:focus:not(.disabled) {
			background-color: var(--primary-color-hover);
			transform: scale(1.01);
		}

		&:active:not(.disabled) {
			transform: scale(0.96);
		}

		&.disabled {
			opacity: 0.5;
			cursor: not-allowed;
			pointer-events: all;
		}
	}

	@media screen and (max-width: 1200px) {
		.actions {
			bottom: 1.75rem;
			gap: 0.8rem;
		}

		.raise-controls {
			min-width: 180px;
		}

		.action-button {
			padding: 0.7rem 1.3rem;
			font-size: 0.95rem;
		}
	}

	@media screen and (max-width: 992px) {
		.actions {
			bottom: 1.5rem;
			gap: 0.6rem;
		}

		.raise-controls {
			min-width: 160px;
		}

		.action-button {
			padding: 0.6rem 1.1rem;
			font-size: 0.9rem;
		}
	}

	@media screen and (max-width: 768px) {
		.actions {
			bottom: 1.25rem;
			gap: 0.5rem;
		}

		.raise-controls {
			min-width: 140px;
		}

		.action-button {
			padding: 0.5rem 0.9rem;
			font-size: 0.85rem;
		}
	}

	@media screen and (max-width: 576px) {
		.actions {
			bottom: 1rem;
			gap: 0.4rem;
			flex-wrap: wrap;
			justify-content: center;
		}

		.raise-controls {
			min-width: 120px;
			order: -1;
			width: 100%;
			margin-bottom: 0.5rem;
		}

		.action-button {
			padding: 0.4rem 0.7rem;
			font-size: 0.8rem;
		}
	}
</style>
