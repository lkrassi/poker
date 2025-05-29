<script lang="ts">
	import { page } from '$app/state';

	let isMenuOpen = false;
	let headerEl: HTMLElement;

	const toggleMenu = () => {
		isMenuOpen = !isMenuOpen;
	};
</script>

<div bind:this={headerEl} class="header">
	<button class="header__burger {isMenuOpen ? 'header__burger--open' : ''}" on:click={toggleMenu}>
		<span class="header__burger-line">ㅤ</span>
		<span class="header__burger-line">ㅤ</span>
		<span class="header__burger-line">ㅤ</span>
	</button>

	<nav class="header__navbar {isMenuOpen ? 'header__navbar--open' : ''}">
		<a
			class="header__link"
			href="/search-lobby"
			class:active={page.url.pathname === '/search-lobby'}
		>
			Найти лобби
		</a>
		<a class="header__link" href="/profile" class:active={page.url.pathname === '/profile'}>
			Профиль
		</a>
		<a
			class="header__link"
			href="/create-lobby"
			class:active={page.url.pathname === '/create-lobby'}
		>
			Создать лобби
		</a>
	</nav>
</div>

<style lang="scss">
	.header {
		display: flex;
		justify-content: center;
		position: relative;

		&__burger {
			display: none;
			flex-direction: column;
			justify-content: space-around;
			width: 30px;
			height: 25px;
			background: transparent;
			border: none;
			cursor: pointer;
			padding: 0;

			&-line {
				width: 100%;
				height: 0.1rem;
				background-color: var(--text-color);
				transition: all 0.3s ease;
				transform-origin: center;
			}

			&--open {
				.header__burger-line {
					&:nth-child(1) {
						transform: translateY(8px) rotate(45deg);
					}
					&:nth-child(2) {
						opacity: 0;
					}
					&:nth-child(3) {
						transform: translateY(-8px) rotate(-45deg);
					}
				}
			}
		}

		&__navbar {
			margin: 2rem 0;
			display: flex;
			gap: 1rem;
			z-index: 1;

			&--open {
				opacity: 1;
				visibility: visible;
				transform: translateY(0);
			}
		}

		&__link {
			color: var(--text-color);

			&::after {
				background-color: var(--text-color);
			}

			&.active::after {
				width: 100%;
				background-color: var(--text-color);
			}
		}
	}

	@media (max-width: 576px) {
		.header {
			flex-direction: column;
			align-items: center;
			gap: 0;
		}

		.header__burger {
			display: flex;
			margin: 2rem 0;
		}

		.header__navbar {
			display: flex;
			flex-direction: column;
			align-items: center;
			position: absolute;
			top: 2rem;
			background: transparent;
			width: 100%;
			padding: 1rem 0;
			transition: 0.3s ease-in-out;
			opacity: 0;
			visibility: hidden;
			transform: translateY(-2rem);

			&--open {
				opacity: 1;
				visibility: visible;
				transform: translateY(0);
			}
		}
	}
</style>
