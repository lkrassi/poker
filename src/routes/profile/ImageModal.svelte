<script lang="ts">
	export let imageUrl: string;
	export let altText: string = 'Изображение';
</script>

<div class="image-modal">
	<img src={imageUrl} alt={altText} class="modal-image" />
</div>

<style lang="scss">
	.image-modal {
		display: flex;
		justify-content: center;
		align-items: center;

		.modal-image {
			width: 90%;
			height: 20rem;
			border-radius: 10%;
			object-fit: cover;
		}
	}

	@media (max-width: 576px) {
		.image-modal {
			.modal-image {
				width: 90%;
				height: auto;
			}
		}
	}
</style>
