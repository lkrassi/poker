<script lang="ts">
	import { updateProfilePic } from '../../api/user/updateProfilePic';
	import { getUserByUsername } from '../../api/user/getUserByUsername';

	import { showMessage } from '../../stores/messageStore';

	import { withLoader } from '$lib/loader';

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
			const response = await withLoader(updateProfilePic(selectedFile));
			if (response.success) {
				await getUserByUsername();
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
		class="update-profile-pic__file-wrapper {isDragging ? 'dragging' : ''}"
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
			class="update-profile-pic__file-wrapper__selection"
			type="file"
			accept="image/jpeg, image/png, image/gif"
			bind:this={fileInput}
			on:change={handleFileInputChange}
		/>
		<label for="file-input" class="update-profile-pic__file-wrapper__label">
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
	.update-profile-pic {
		margin: 0 0 2rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.5rem;

		.update-profile-pic__title {
			font-size: 2.2rem;
			color: var(--text-color);
		}

		.update-profile-pic__file-wrapper {
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
			}

			&.dragging {
				animation: pulse 2s infinite;
			}

			.update-profile-pic__file-wrapper__selection {
				opacity: 0;
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				cursor: pointer;
			}
		}

		.update-profile-pic__preview {
			text-align: center;

			.update-profile-pic__preview-image {
				max-width: 15rem;
				max-height: 10rem;
				border-radius: 1rem;
			}
		}

		.update-profile-pic__button {
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
			.update-profile-pic__title {
				font-size: 1.9rem;
			}
		}
	}
</style>
