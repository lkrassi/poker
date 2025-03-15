<script>
	import { goto } from '$app/navigation';
	import ThemeSwitcher from '../components/ThemeSwitcher.svelte';

	const goFirst = () => {
		goto('/');
	};
</script>

<div class="theme-switcher">
	<ThemeSwitcher />
</div>

<div class="go-back">
	<h1 class="go_back__title">Страница не найдена</h1>
	<button id="go-back__goto-first-btn" on:click={goFirst}>Вернуться на главную</button>
</div>

<style lang="scss">
	.theme-switcher {
		display: flex;
		justify-content: end;
		padding: 20px 10px;
	}

	.go-back {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 80vh;
		row-gap: 20px;
		text-align: center;

		.go_back__title {
			color: var(--text-color);
		}

		#go-back__goto-first-btn {
			color: #fff;
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
</style>
