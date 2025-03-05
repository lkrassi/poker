<script lang="ts">
	import { page } from '$app/state';
	import ThemeSwitcher from './ThemeSwitcher.svelte';
</script>

<div class="header">
	<nav class="header__navbar">
		<a class="header__navbar__link" href="/main" class:active={page.url.pathname === '/main'}
			>Главная</a
		>
		<a class="header__navbar__link" href="/profile" class:active={page.url.pathname === '/profile'}
			>Профиль</a
		>
		<a class="header__navbar__link" href="/rules" class:active={page.url.pathname === '/rules'}
			>Правила</a
		>
	</nav>

	<div class="theme-switcher">
		<ThemeSwitcher />
	</div>
</div>

<style lang="scss">
	.header {
		display: flex;
		justify-content: space-between;
		gap: 15px;
		padding: 10px;

		.theme-switcher {
			display: flex;
			justify-content: end;
			margin: 0 10px 0;
		}
	}

	.header__navbar {
		margin: 30px 20px;
		display: flex;
		gap: 20px;

		.header__navbar__link {
			position: relative;
			text-decoration: none;
			color: var(--text-color);
			padding-bottom: 5px;

			&::after {
				content: '';
				position: absolute;
				left: 0;
				bottom: 0;
				width: 0;
				height: 1px;
				background-color: var(--text-color);
				transition: width 0.3s ease-in-out;
			}

			&:hover::after {
				width: 100%;
			}

			&.active::after {
				width: 100%;
				background-color: var(--text-color);
			}
		}
	}

	@media (max-width: 500px) {
		.header {
			flex-direction: column;
			justify-content: center;
			align-items: center;
			gap: 0;
		}
	}
</style>
