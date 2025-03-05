<script lang="ts">
	import { theme, toggleTheme } from '../stores/themeStore';
	import sun from '../assets/icons/sun.svg';
	import moon from '../assets/icons/moon.svg';
</script>

<button class="theme-button" on:click={toggleTheme}>
	{#if $theme === 'dark'}
		<img src={sun} alt="Sun Icon" class="theme-icon sun-icon" />
	{:else}
		<img src={moon} alt="Moon Icon" class="theme-icon moon-icon" />
	{/if}
</button>

<style>
	.theme-button {
		outline: none;
		border: none;
		cursor: pointer;
		color: var(--link-color);
		padding: 0;
		transition: 0.3s ease;
		background: none;

		&:hover {
			transform: scale(1.2);
		}
	}

	.theme-icon {
		width: 20px;
		height: 20px;
		animation: fadeIn 0.3s ease-in-out;
	}

	.sun-icon {
		animation-name: sunToMoon;
	}

	.moon-icon {
		animation-name: moonToSun;
	}

	@keyframes sunToMoon {
		0% {
			opacity: 0;
			transform: scale(0.8);
		}
		50% {
			opacity: 1;
			transform: scale(1.2);
		}
		100% {
			opacity: 1;
			transform: scale(1);
		}
	}

	@keyframes moonToSun {
		0% {
			opacity: 0;
			transform: scale(0.8);
		}
		50% {
			opacity: 1;
			transform: scale(1.2);
		}
		100% {
			opacity: 1;
			transform: scale(1);
		}
	}
</style>
