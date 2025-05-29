<script lang="ts">
	import { apiFacade } from '../../../shared/lib/api/apiFacade';

	import { showMessage } from '../../../shared/model/stores/messageStore';
	import { closeModal } from '../../../shared/model/stores/modalStore';

	let selectedFile: File | null = null;
	let imagePreviewUrl: string | null = null;
	let isDragging = false;
	let fileInput: HTMLInputElement;

	const onFileChange = (file: File) => {
		selectedFile = file;
		imagePreviewUrl = URL.createObjectURL(selectedFile);
		showMessage('success', `Файл успешно выбран! ${selectedFile.name}`);
	};

	const handleFileInputChange = (event: Event) => {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		if (file) {
			onFileChange(file);
		}
	};

	const handleDragOver = (event: DragEvent) => {
		event.preventDefault();
		isDragging = true;
	};

	const handleDragLeave = () => {
		isDragging = false;
	};

	const handleDrop = (event: DragEvent) => {
		event.preventDefault();
		isDragging = false;

		const files = event.dataTransfer?.files;
		if (files?.[0]) {
			onFileChange(files[0]);
		}
	};

	async function submitForm(event: Event) {
		event.preventDefault();
		if (!selectedFile) {
			showMessage('info', 'Выберите файл для загрузки (JPG, PNG или GIF)');
			return;
		}

		try {
			const response = await apiFacade.updateProfilePic(selectedFile);
			if (response.success) {
				closeModal();
				showMessage('success', response.message);
				imagePreviewUrl = null;
				selectedFile = null;
				fileInput.value = '';
			} else {
				showMessage('error', response.message);
			}
		} catch (error) {
			showMessage('error', 'Произошла ошибка при загрузке файла. Попробуйте еще раз.');
		}
	}
</script>

<form class="update-profile-pic" on:submit={submitForm}>
	<h2 class="update-profile-pic__title">Смена аватара профиля</h2>
	<div
		class="update-profile-pic__file-wrapper {isDragging
			? 'update-profile-pic__file-wrapper--dragging'
			: ''}"
		on:dragenter={handleDragOver}
		on:dragover={handleDragOver}
		on:dragleave={handleDragLeave}
		on:drop={handleDrop}
		role="button"
		aria-label="Перетащите файл сюда для загрузки"
		tabindex="0"
		aria-live="polite"
	>
		<input
			id="file-input"
			class="update-profile-pic__file-input"
			type="file"
			accept="image/jpeg, image/png, image/gif"
			bind:this={fileInput}
			on:change={handleFileInputChange}
		/>
		<label for="file-input" class="update-profile-pic__file-label">
			Выберите или перетащите файл сюда
		</label>
	</div>

	{#if imagePreviewUrl}
		<div class="update-profile-pic__preview">
			<img
				src={imagePreviewUrl}
				alt="Предпросмотр выбранного изображения"
				class="update-profile-pic__preview-image"
			/>
		</div>
	{/if}

	<button class="update-profile-pic__button" type="submit">Загрузить новый аватар</button>
</form>

<style lang="scss">
	:global(.update-profile-pic-modal) {
		backdrop-filter: blur(10px);
		padding: 1.5rem;
		border-radius: 1.25rem;
		border: 1px solid rgba(255, 255, 255, 0.2);
		box-shadow: 0 0.25rem 0.625rem var(--box-shadow-color);
	}

	.update-profile-pic {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.5rem;

		&__title {
			font-size: 2.2rem;
			color: var(--text-color);
			text-align: center;
		}

		&__file-wrapper {
			position: relative;
			width: 100%;
			border: 2px dashed var(--text-color);
			border-radius: 15px;
			padding: 2rem 0;
			transition: all 0.3s ease;
			outline: none;
			font-size: 0.8rem;

			&:hover,
			&:focus {
				background-color: var(--primary-color-hover);
				transform: scale(1.01);
			}

			&:active {
				transform: scale(0.99);
			}

			&--dragging {
				animation: pulse 2s infinite;
			}
		}

		&__file-input {
			opacity: 0;
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			cursor: pointer;
		}

		&__file-label {
			display: block;
			text-align: center;
			cursor: pointer;
		}

		&__preview {
			text-align: center;

			&-image {
				max-width: 15rem;
				max-height: 10rem;
				border-radius: 1rem;
			}
		}

		&__button {
			color: var(--text-color);
			background-color: var(--primary-color);
			transition: 0.3s ease;
			width: 100%;

			&:hover,
			&:focus {
				background-color: var(--primary-color-hover);
				transform: scale(1.01);
			}

			&:active {
				transform: scale(0.99);
			}
		}
	}

	@keyframes pulse {
		0% {
			transform: scale(1);
			background-color: var(--primary-color);
		}
		50% {
			transform: scale(1.02);
			background-color: var(--primary-color-hover);
		}
		100% {
			transform: scale(1);
			background-color: var(--primary-color);
		}
	}

	@media (max-width: 576px) {
		.update-profile-pic {
			&__title {
				font-size: 1.9rem;
			}
		}
	}
</style>
