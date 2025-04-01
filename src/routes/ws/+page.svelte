<script lang="ts">
	import { onDestroy } from 'svelte';

	let connectionStatus: string = 'Не подключено';
	let socket: WebSocket | null = null;
	let pingInterval: number | null = null;
	const PING_INTERVAL = 30000; // 30 секунд

	const lobbyId = '6e70b050-8492-4aac-ab4e-758a7fce8ea2';
	const BASE_URL = import.meta.env.VITE_BASE_URL;

	const log = (message: string) => {
		const timestamp = new Date().toLocaleTimeString();
		console.log(`[${timestamp}] ${message}`);
	};

	const setupPing = () => {
		if (pingInterval) clearInterval(pingInterval);

		pingInterval = setInterval(() => {
			if (socket?.readyState === WebSocket.OPEN) {
				log('Отправка ping сообщения');
				socket.send('nil'); // Отправляем ping
			}
		}, PING_INTERVAL) as unknown as number;
	};

	const connectToWebSocket = () => {
		const accessToken = localStorage.getItem('access_token');

		if (!accessToken) {
			log('Ошибка: токен не найден в localStorage');
			return;
		}

		const wsUrl = `${BASE_URL}/ws/enter?lobby_id=${lobbyId}`;
		connectionStatus = 'Подключение...';
		log(`Попытка подключения к: ${wsUrl}`);

		try {
			socket = new WebSocket(wsUrl);
			log('WebSocket создан, ожидание открытия соединения...');

			socket.onopen = () => {
				connectionStatus = 'Соединение установлено';
				log('Соединение установлено, отправка токена...');
				socket?.send(accessToken);
				setupPing(); // Запускаем ping-pong
			};

			socket.onmessage = (event) => {
				if (event.data === 'nil') {
					log('Получен pong от сервера');
				} else {
					log(`Получено сообщение: ${event.data}`);
				}
			};

			socket.onclose = (event) => {
				if (pingInterval) clearInterval(pingInterval);
				connectionStatus = event.wasClean ? 'Соединение закрыто' : 'Соединение разорвано';
				log(`Соединение закрыто. Код: ${event.code}, причина: ${event.reason || 'неизвестна'}`);
			};

			socket.onerror = (error) => {
				log(`Ошибка WebSocket: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
			};
		} catch (err) {
			log(`Ошибка при подключении: ${err instanceof Error ? err.message : String(err)}`);
		}
	};

	const disconnectWebSocket = () => {
		if (socket) {
			if (pingInterval) clearInterval(pingInterval);
			socket.close(1000, 'Закрыто пользователем');
			log('Инициировано ручное отключение...');
		}
	};

	onDestroy(() => {
		disconnectWebSocket();
	});
</script>

<div>
	<button on:click={connectToWebSocket} disabled={socket?.readyState === WebSocket.OPEN}>
		Подключиться
	</button>
	<button
		on:click={disconnectWebSocket}
		disabled={!socket || socket?.readyState === WebSocket.CLOSED}
	>
		Отключиться
	</button>
	<p>Статус: {connectionStatus}</p>
</div>

<style>
	button {
		background-color: #fff;
	}
</style>
