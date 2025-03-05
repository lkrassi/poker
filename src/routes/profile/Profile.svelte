<script lang="ts">
	import Header from '../../components/Header.svelte';

	import { clearCookies } from '$lib/clearCookies';

	import { goto } from '$app/navigation';

	const logout = () => {
		clearCookies();
		goto('/');
	};
</script>

<Header />

<main class="profile">
	<h1>тут инфа о пользователе (имя, почта и тп.)</h1>
	<div class="profile__logout">
		<button class="logout-btn" on:click={logout}>Выйти</button>
	</div>
</main>

<style lang="scss">
	.profile {
		.profile__logout {
			display: flex;
			justify-content: center;
			margin-top: 20px;

			.logout-btn {
				background-color: var(--primary-color);
				color: #fff;
			}
		}
	}
</style>
