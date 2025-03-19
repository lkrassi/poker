<script lang="ts">
	import Header from '../../components/Header.svelte';
</script>

<section class="create-lobby-page">
	<Header />

	<div class="create-lobby">
		<h1>
			создание лобби тут, настройка игры, пароль на комнату мб, хз пока как будет на сервере
			реализовано
		</h1>
	</div>
</section>

<style lang="scss">
	.create-lobby-page {
		min-height: 100vh;
		background-image: url(../../assets/images/background.jpg);
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;

		.create-lobby {
			width: 90%;
			margin: -1rem auto;
			text-align: center;
		}
	}
</style>
