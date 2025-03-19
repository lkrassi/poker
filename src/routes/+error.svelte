<script>
	import { goto } from '$app/navigation';

	const goFirst = () => {
		goto('/');
	};
</script>

<section class="error-page">
	<div class="error-page__go-back">
		<h1 class="error-page_go-back__title">Страница не найдена</h1>
		<button id="error-page__go-back__goto-first-btn" on:click={goFirst}>Вернуться на главную</button
		>
	</div>
</section>

<style lang="scss">
	.error-page {
		min-height: 100vh;
		background-image: url(../assets/images/background.jpg);
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;

		.error-page__go-back {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			height: 80vh;
			row-gap: 20px;
			text-align: center;

			.error-page_go-back__title {
				color: var(--text-color);
				font-size: 4rem;
			}

			#error-page__go-back__goto-first-btn {
				color: var(--text-color);
				background-color: var(--primary-color);
				transition: 0.3s ease;
				width: 15rem;

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
	}

	@media (max-width: 576px) {
		.error-page {
			.error-page__go-back {
				.error-page_go-back__title {
					color: var(--text-color);
					font-size: 2rem;
				}
			}
		}
	}
</style>
