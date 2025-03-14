<script lang="ts">
	import { page } from '$app/state';
</script>

<div class="header">
	<nav class="header__navbar">
		<a
			class="header__navbar__link"
			href="/search-lobby"
			class:active={page.url.pathname === '/search-lobby'}>Найти лобби</a
		>
		<a class="header__navbar__link" href="/profile" class:active={page.url.pathname === '/profile'}
			>Профиль</a
		>
		<a
			class="header__navbar__link"
			href="/create-lobby"
			class:active={page.url.pathname === '/create-lobby'}>Создать лобби</a
		>
	</nav>
</div>

<style lang="scss">
	.header {
		display: flex;
		justify-content: center;
		gap: 15px;
		padding: 10px;
	}

	.header__navbar {
		margin: 30px 20px;
		display: flex;
		gap: 20px;

		.header__navbar__link {
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
