<script lang="ts">
	export let currentPage: number;
	export let totalPages: number;
	export let onPageChange: (page: number) => void;
</script>

<div class="pagination">
	<button
		class="pagination__button"
		on:click={() => onPageChange(currentPage - 1)}
		disabled={currentPage === 0}
	>
		← Назад
	</button>
	<span class="pagination__info">
		{currentPage + 1} из {totalPages}
	</span>
	<button
		class="pagination__button"
		on:click={() => onPageChange(currentPage + 1)}
		disabled={currentPage >= totalPages - 1}
	>
		Вперед →
	</button>
</div>

<style lang="scss">
	.pagination {
		display: flex;
		align-items: center;
		gap: 15px;

		&__button {
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

		&__info {
			font-size: 0.9rem;
			color: var(--text-color);
		}
	}

	@media (max-width: 576px) {
		.pagination {
			gap: 10px;

			&__button {
				padding: 6px 10px;
				font-size: 0.8rem;
			}

			&__info {
				font-size: 0.8rem;
			}
		}
	}
</style>
