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

		#go-back__goto-first-btn {
			width: 18rem;
			padding: 10px 15px;
			font-size: 16px;
			color: #fff;
			background-color: #007bff;
			border-radius: 4px;
			cursor: pointer;
			transition:
				background-color 0.3s ease,
				transform 0.1s ease;

			&:hover,
			&:focus {
				background-color: #0056b3;
			}

			&:active {
				transform: scale(0.98);
			}
		}
	}
</style>
