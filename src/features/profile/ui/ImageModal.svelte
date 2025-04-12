<script lang="ts">
	export let imageUrl: string;
	export let altText: string = 'Изображение';
</script>

<div class="image-modal">
	<img src={imageUrl} alt={altText} class="modal-image" />
	<button>заглушка (костылёк)</button>
</div>

<style lang="scss">
	.image-modal {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;

		.modal-image {
			width: 45rem;
			height: 30rem;
			border-radius: 10%;
			object-fit: cover;
		}

		button {
			opacity: 0;
			cursor: auto;
		}
	}

	@media (min-width: 576px) and (max-width: 768px) {
		.image-modal {
			.modal-image {
				width: 35rem;
			}
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
