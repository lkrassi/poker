<script lang="ts">
	import { claimDailyReward } from '../../api/user/dailyReward';
	import { getUserByUsername } from '../../api/user/getUserByUsername';
	import { showMessage } from '../../stores/messageStore';
	import { withLoader } from '$lib/loader';

	let rewardMessage = '';
	let rewardAmount = 0;

	const handleClaimReward = async () => {
		const result = await withLoader(claimDailyReward());

		if (result.success) {
			rewardMessage = `Вы получили награду: ${result.amount} монет!`;
			rewardAmount = result.amount;
			showMessage('success', rewardMessage);
			await withLoader(getUserByUsername());
		} else {
			showMessage('error', result.message || 'Ошибка при получении награды');
		}
	};
</script>

<div>
	<button class="reward-button" on:click={handleClaimReward}>Получить награду</button>
</div>

<style>
	.reward-button {
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
</style>
