<script lang="ts">
	import { apiFacade } from '../../../shared/lib/api/apiFacade';

	import { showMessage } from '../../../shared/model/stores/messageStore';

	import { onMount } from 'svelte';

	let labels: string[] = [
		'10000',
		'1000',
		'5000',
		'1000',
		'250',
		'1000',
		'2000',
		'1000',
		'750',
		'1',
		'1500',
		'1000',
		'500',
		'1000',
		'3000',
		'1000',
		'100',
		'1000'
	];

	let wheelContainer: HTMLElement;
	let animationSpins = 5;
	let animationTime = 5000;
	let degreeses: number;
	let current = 0;
	let isLock = false;
	let rewardAmount: number | null = null;

	onMount(() => {
		degreeses = 360 / labels.length;
	});

	const easeInOut = (time: number): number => {
		return 0.5 * (1 - Math.cos(Math.PI * time));
	};

	const startAnimation = (
		duration: number,
		callback: (progress: number) => void,
		finish: () => void
	) => {
		let startAnimationTime: number | null = null;

		function measure(time: number) {
			if (!startAnimationTime) {
				startAnimationTime = time;
			}

			const progress = (time - startAnimationTime) / duration;
			callback(progress);

			if (progress < 1) {
				requestAnimationFrame(measure);
			} else {
				callback(1);
				finish();
			}
		}

		requestAnimationFrame(measure);
	};

	const spin = async () => {
		if (isLock) return;

		isLock = true;
		rewardAmount = null;

		try {
			const result = await apiFacade.claimDailyReward();

			if (!result.success) {
				showMessage('error', result.message || 'Ошибка при получении награды');
				isLock = false;
				return;
			}

			const index = result.sector;
			rewardAmount = result.amount;

			const segmentDegreeses = degreeses * index - 90 - degreeses / 2;
			const randomDegreeses = (degreeses - 6) * Math.random() + 3;
			const animationRotate = 360 * animationSpins;
			const rotate = -segmentDegreeses - randomDegreeses - animationRotate;

			startAnimation(
				animationTime,
				(progress) => {
					wheelContainer.style.transform = `rotate(${current + (rotate - current) * easeInOut(progress)}deg)`;
				},
				async () => {
					current = rotate % 360;
					isLock = false;
					showMessage('success', `Поздравляем! Вам добавлено фишек в размере: ${rewardAmount}`);

					const userResult = await apiFacade.getUserByUsername();
					if (!userResult.success) {
						showMessage('error', userResult.message || 'Ошибка при обновлении данных пользователя');
					}
				}
			);
		} catch (error) {
			showMessage('error', 'Произошла ошибка при запросе');
			isLock = false;
		}
	};
</script>

<div class="wheel-of-fortune">
	<div class="wheel-of-fortune__container" bind:this={wheelContainer}>
		{#each labels as label, index}
			<div
				class="wheel-of-fortune__segment"
				class:even={index % 2 === 0}
				style="transform: rotate({degreeses * index +
					(degreeses - 90) -
					degreeses / 2}deg) skewX({degreeses - 90}deg)"
			></div>
			<div class="wheel-of-fortune__label" style="transform: rotate({degreeses * index}deg)">
				<div class="wheel-of-fortune__label-text">{label}</div>
			</div>
		{/each}
	</div>

	<div class="wheel-center">
		<button class="wheel-center-button" on:click={spin}>SPIN</button>
		<div class="wheel-center-arrow"></div>
	</div>
</div>

<style lang="scss">
	.wheel-of-fortune {
		position: relative;
		width: 20rem;
		height: 20rem;

		&__container {
			position: absolute;
			overflow: hidden;
			top: 0;
			left: 0;
			border-radius: 50%;
			width: 100%;
			height: 100%;
			z-index: 1;
		}

		&__segment {
			position: absolute;
			left: 50%;
			top: -50%;
			width: 100%;
			height: 100%;
			transform-origin: 0 100%;
			background: var(--primary-color);

			&.even {
				background: var(--primary-color-hover);
			}
		}

		&__label {
			position: absolute;
			top: 0;
			left: 50%;
			width: 50%;
			height: 50%;
			transform-origin: 0 100%;
			display: flex;
			align-items: center;
			justify-content: flex-start;
			padding-bottom: 2rem;
		}

		&__label-text {
			transform: rotate(-90deg);
			transform-origin: left center;
			text-align: center;
			font-size: 1rem;
			color: var(--text-color);
			white-space: nowrap;
		}
	}

	.wheel-center {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 6rem;
		height: 6rem;
		border-radius: 50%;
		z-index: 1;

		.wheel-center-button {
			position: relative;
			width: 100%;
			height: 100%;
			border-radius: 50%;
			border: none;
			background: var(--primary-color);
			color: var(--text-color);
			font-size: 1.6rem;
			font-weight: bold;
			cursor: pointer;
			box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
			transition: all 0.3s ease;

			&::after {
				content: '';
				position: absolute;
				top: 50%;
				right: -0.5rem;
				transform: translateY(-50%);
				width: 0;
				height: 0;
				border-style: solid;
				border-width: 0.9rem 0 0.9rem 0.8rem;
				border-color: transparent transparent transparent var(--primary-color);
				transition: all 0.3s ease;
			}

			&:hover,
			&:focus {
				background: var(--primary-color-hover);
				transform: scale(1.01);

				&::after {
					border-color: transparent transparent transparent var(--primary-color-hover);
				}
			}

			&:active {
				transform: scale(0.99);

				&::after {
					border-color: transparent transparent transparent var(--primary-color-hover);
				}
			}
		}
	}

	@media (max-width: 576px) {
		.wheel-of-fortune {
			width: 12rem;
			height: 12rem;
			margin: 0 0 4rem;

			&__label {
				padding-bottom: 1.5rem;
			}
		}

		.wheel-center {
			width: 5rem;
			height: 5rem;
		}

		.wheel-center-button {
			font-size: 1rem;
		}

		.wheel-of-fortune__label-text {
			font-size: 0.8rem;
		}

		.wheel-center-arrow {
			border-width: 0.5rem 0 0.5rem 0.5rem;
		}
	}
</style>
