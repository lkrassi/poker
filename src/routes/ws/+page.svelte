<script lang="ts">
	import { onDestroy } from 'svelte';

	let connectionStatus: string = 'Не подключено';
	let socket: WebSocket | null = null;
	let pingInterval: number | null = null;
	const PING_INTERVAL = 30000;

	// Game state
	let gameStarted = false;
	let playerCards: string[] = [];
	let communityCards: string[] = [];
	let currentBet = 0;
	let canAct = false;
	let lastMessage = '';
	let playerBalance = 0;

	const lobbyId = 'ae1f782d-4e54-4813-8113-1a5c23e525fe';
	const BASE_URL = import.meta.env.VITE_BASE_URL;

	const log = (message: string) => {
		lastMessage = message;
	};

	const setupPing = () => {
		if (pingInterval) clearInterval(pingInterval);

		pingInterval = setInterval(() => {
			if (socket?.readyState === WebSocket.OPEN) {
				socket.send(JSON.stringify({ type: 'ping' }));
			}
		}, PING_INTERVAL) as unknown as number;
	};

	const handleGameMessage = (message: string) => {
		try {
			const data = JSON.parse(message);

			if (data.EventType === 'info') {
				log(data.EventData);
				return;
			}

			if (data.EventType === 'game') {
				const eventData = data.EventData;

				if (eventData.includes('game') && eventData.includes('started')) {
					gameStarted = true;
					log('Игра началась!');
					return;
				}

				if (eventData.includes('New round started')) {
					log(`Новый раунд: ${eventData}`);
					return;
				}

				if (eventData.includes('get cards:')) {
					const cardsMatch = eventData.match(/get cards: (\[.*\])/);
					if (cardsMatch) {
						playerCards = JSON.parse(cardsMatch[1].replace(/{/g, '[').replace(/}/g, ']'));
						log(`Ваши карты: ${playerCards.map((card) => `${card[0]} ${card[1]}`).join(', ')}`);
					}
					return;
				}

				if (eventData.includes('Community cards:')) {
					const cardsMatch = eventData.match(/Community cards: (\[.*\])/);
					if (cardsMatch) {
						communityCards = JSON.parse(cardsMatch[1].replace(/{/g, '[').replace(/}/g, ']'));
						log(
							`Карты на столе: ${communityCards.map((card) => `${card[0]} ${card[1]}`).join(', ')}`
						);
					}
					return;
				}

				if (eventData.includes('balance =')) {
					const balanceMatch = eventData.match(/balance = (\d+)/);
					if (balanceMatch) {
						playerBalance = parseInt(balanceMatch[1]);
					}
					return;
				}

				if (eventData.includes('win all pots')) {
					const amountMatch = eventData.match(/with (\d+) total amount/);
					if (amountMatch) {
						log(`Поздравляем! Вы выиграли ${amountMatch[1]} фишек!`);
					}
					gameStarted = false;
					playerCards = [];
					communityCards = [];
					canAct = false;
					return;
				}

				if (eventData.includes('has been stopped')) {
					log('Игра завершена');
					gameStarted = false;
					playerCards = [];
					communityCards = [];
					canAct = false;
					return;
				}

				log(eventData);
				return;
			}

			if (message.includes('can do')) {
				canAct = true;
				if (message.includes('call with')) {
					const betMatch = message.match(/call with (\d+)/);
					if (betMatch) {
						currentBet = parseInt(betMatch[1]);
						log(`Ваш ход! Можно сделать колл: ${currentBet}`);
					}
				} else if (message.includes('check')) {
					log('Ваш ход! Можно сделать чек');
				}
				return;
			}
		} catch (err) {
			log(message);
		}
	};

	const sendAction = (action: 'call' | 'raise' | 'fold' | 'check', amount?: number) => {
		if (!socket || !canAct) return;

		let message = '';
		switch (action) {
			case 'call':
				message = `call ${currentBet}`;
				break;
			case 'raise':
				if (!amount || amount < currentBet * 2) {
					log('Рейз должен быть минимум в 2 раза больше текущей ставки');
					return;
				}
				message = `raise ${amount}`;
				break;
			case 'fold':
				message = 'fold';
				break;
			case 'check':
				message = 'check';
				break;
		}

		socket.send(message);
		canAct = false;
		log(`Отправлено действие: ${message}`);
	};

	const connectToWebSocket = () => {
		const accessToken = localStorage.getItem('access_token');

		if (!accessToken) {
			log('Ошибка: токен не найден в localStorage');
			return;
		}

		const wsUrl = `${BASE_URL}/ws/enter?lobby_id=${lobbyId}`;
		connectionStatus = 'Подключение...';
		log(`Подключение к игре...`);

		try {
			socket = new WebSocket(wsUrl);

			socket.onopen = () => {
				connectionStatus = 'Соединение установлено';
				log('Подключено к игре');
				socket?.send(accessToken);
				setupPing();
			};

			socket.onmessage = (event) => {
				handleGameMessage(event.data);
			};

			socket.onclose = (event) => {
				if (pingInterval) clearInterval(pingInterval);
				connectionStatus = event.wasClean ? 'Соединение закрыто' : 'Соединение разорвано';
				log(`Соединение закрыто`);
				gameStarted = false;
				playerCards = [];
				communityCards = [];
				canAct = false;
			};

			socket.onerror = (error) => {
				log(`Ошибка подключения`);
			};
		} catch (err) {
			log(`Ошибка при подключении`);
		}
	};

	const disconnectWebSocket = () => {
		if (socket) {
			if (pingInterval) clearInterval(pingInterval);
			socket.close(1000, 'Закрыто пользователем');
			log('Отключено от игры');
		}
	};

	onDestroy(() => {
		disconnectWebSocket();
	});
</script>

<div class="game-container">
	<div class="controls">
		<button on:click={connectToWebSocket} disabled={socket?.readyState === WebSocket.OPEN}>
			Подключиться
		</button>
		<button
			on:click={disconnectWebSocket}
			disabled={!socket || socket?.readyState === WebSocket.CLOSED}
		>
			Отключиться
		</button>
	</div>

	<div class="game-status">
		<p class="status">Статус: {connectionStatus}</p>
		{#if gameStarted}
			<p class="game-state">Игра идет</p>
			<p class="balance">Баланс: {playerBalance}</p>
		{/if}
	</div>

	{#if gameStarted}
		<div class="game-info">
			{#if playerCards.length > 0}
				<div class="cards-section">
					<h3>Ваши карты</h3>
					<div class="cards">
						{#each playerCards as card}
							<span class="card">{card[0]} {card[1]}</span>
						{/each}
					</div>
				</div>
			{/if}

			{#if communityCards.length > 0}
				<div class="cards-section">
					<h3>Карты на столе</h3>
					<div class="cards">
						{#each communityCards as card}
							<span class="card">{card[0]} {card[1]}</span>
						{/each}
					</div>
				</div>
			{/if}

			{#if canAct}
				<div class="actions">
					<h3>Ваш ход!</h3>
					{#if currentBet > 0}
						<p>Текущая ставка: {currentBet}</p>
						<div class="buttons">
							<button on:click={() => sendAction('call')}>Колл ({currentBet})</button>
							<button on:click={() => sendAction('raise', currentBet * 2)}
								>Рейз ({currentBet * 2})</button
							>
							<button on:click={() => sendAction('fold')}>Фолд</button>
						</div>
					{:else}
						<div class="buttons">
							<button on:click={() => sendAction('check')}>Чек</button>
							<button on:click={() => sendAction('fold')}>Фолд</button>
						</div>
					{/if}
				</div>
			{/if}
		</div>
	{/if}

	<div class="last-message">
		<p>{lastMessage}</p>
	</div>
</div>

<style>
	.game-container {
		padding: 20px;
		max-width: 800px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.controls {
		display: flex;
		gap: 10px;
	}

	.game-status {
		display: flex;
		gap: 20px;
		align-items: center;
	}

	.status {
		color: var(--text-color);
		font-weight: bold;
	}

	.game-state {
		color: var(--primary-color);
		font-weight: bold;
	}

	.balance {
		color: var(--text-color);
		font-weight: bold;
	}

	.game-info {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.cards-section {
		background-color: var(--background-color);
		padding: 15px;
		border-radius: 8px;
	}

	.cards {
		display: flex;
		gap: 10px;
		flex-wrap: wrap;
	}

	.card {
		background-color: var(--primary-color);
		color: var(--text-color);
		padding: 8px 12px;
		border-radius: 4px;
		font-weight: bold;
	}

	.actions {
		background-color: var(--background-color);
		padding: 15px;
		border-radius: 8px;
	}

	.buttons {
		display: flex;
		gap: 10px;
		flex-wrap: wrap;
	}

	.last-message {
		background-color: var(--background-color);
		padding: 10px;
		border-radius: 4px;
		margin-top: auto;
	}

	button {
		color: var(--text-color);
		background-color: var(--primary-color);
		padding: 8px 16px;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		transition: 0.3s ease;

		&:hover,
		&:focus {
			background-color: var(--primary-color-hover);
			transform: scale(1.01);
		}

		&:active {
			transform: scale(0.99);
		}

		&:disabled {
			opacity: 0.5;
			cursor: not-allowed;
			transform: none;
		}
	}

	h3 {
		margin: 0 0 10px 0;
		color: var(--text-color);
	}
</style>
