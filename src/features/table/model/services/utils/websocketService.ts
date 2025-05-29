import { gameStore } from '../../stores/gameStore';
import type { WebSocketMessage, WebSocketEventType } from '../../types/websocket';

import {
	handlePlayerEnter,
	handlePlayersStats,
	handlePlayersUpdate
} from '../handlers/playerHandlers';
import {
	handleCanDo,
	handleCommunityCards,
	handleGetCards,
	handleGameStarted,
	handleNewRound,
	handleBlind,
	handleDo,
	handleWinPot,
	handleNextMove
} from '../handlers/gameHandlers';
import { handleLobbyInfo } from '../handlers/lobbyHandlers';

import { showNotification } from '../../stores/notificationStore';

let socket: WebSocket | null = null;

const eventHandlers: Partial<
	Record<WebSocketEventType, (message: WebSocketMessage) => void | Promise<void>>
> = {
	players_stats: handlePlayersStats,
	player_enter: handlePlayerEnter,
	can_do: handleCanDo,
	community_cards: handleCommunityCards,
	get_cards: handleGetCards,
	game_started: handleGameStarted,
	new_round: handleNewRound,
	small_blind: handleBlind,
	big_blind: handleBlind,
	do: handleDo,
	win_pot: handleWinPot,
	next_move: handleNextMove
};

const handleMessage = async (message: WebSocketMessage) => {
	try {
		if (message.info && message.players) {
			handleLobbyInfo(message);
			handlePlayersUpdate(message);
			return;
		}

		const eventType = message.event_type as WebSocketEventType;
		if (eventType) {
			const handler = eventHandlers[eventType];
			if (handler) {
				await handler(message);
			}
		}
	} catch (error) {
		showNotification('error', 'Произошла ошибка при обработке сообщения');
	}
};

export const connect = (lobbyId: string) => {
	if (socket?.readyState === WebSocket.OPEN) {
		console.log('WebSocket уже подключен');
		return;
	}

	const token = localStorage.getItem('access_token');
	if (!token) {
		showNotification('error', 'Токен доступа не найден');
		return;
	}

	console.log('Подключение к WebSocket...');
	const wsUrl = `${import.meta.env.VITE_BASE_URL}/ws/enter?lobby_id=${lobbyId}`;
	socket = new WebSocket(wsUrl);

	socket.onopen = () => {
		console.log('WebSocket подключен');
		if (socket) {
			socket.send(token);
		}
		showNotification('success', 'Вы успешно вошли в лобби');
	};

	socket.onmessage = (event) => {
		try {
			const message = JSON.parse(event.data) as WebSocketMessage;
			handleMessage(message);
		} catch (error) {
			console.error('Ошибка при обработке сообщения:', error);
			showNotification('error', 'Ошибка при обработке сообщения от сервера');
		}
	};

	socket.onerror = (error) => {
		console.error('WebSocket ошибка:', error);
		showNotification('error', 'Произошла ошибка подключения');
	};

	socket.onclose = (event) => {
		console.log('WebSocket соединение закрыто:', event.code, event.reason);
		socket = null;
	};
};

export const disconnect = () => {
	if (socket) {
		socket.close();
		socket = null;
	}
};

export const sendAction = (action: string, amount?: number) => {
	if (!socket || socket.readyState !== WebSocket.OPEN) {
		showNotification('error', 'Нет подключения к серверу');
		return;
	}

	const message = {
		action,
		amount: amount || 0
	};

	console.log('Отправка действия:', message);

	gameStore.update((state) => ({
		...state,
		availableActions: {
			canCall: false,
			canCheck: false,
			canRaise: false,
			callAmount: 0
		}
	}));

	try {
		socket.send(JSON.stringify(message));
	} catch (error) {
		console.error('Ошибка при отправке действия:', error);
		showNotification('error', 'Ошибка при отправке действия');
	}
};
