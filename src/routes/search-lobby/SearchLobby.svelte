<script lang="ts">
	import Header from '../../components/Header.svelte';
</script>

<section class="search-lobby-page">
	<Header />

	<div class="search-lobby">
		<h1>
			поиск лобби тут, отображение открытых лобби мб, хз пока как будет на сервере реализовано
		</h1>
	</div>
</section>

<style lang="scss">
	.search-lobby-page {
		min-height: 100vh;
		background-image: url(../../assets/images/background.jpg);
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;

		.search-lobby {
			width: 90%;
			margin: -1rem auto;
			text-align: center;
		}
	}
</style>
