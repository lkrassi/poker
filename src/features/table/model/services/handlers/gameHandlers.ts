import { showNotification } from '../../stores/notificationStore';
import { gameStore } from '../../stores/gameStore';
import { parseCards } from '../utils/cardUtils';
import type { Player } from '../../types/types';

export const handleCanDo = (message: any) => {
	console.log('Received can_do event:', message);

	const playerIdMatch = message.event_data.match(
		/player (.*?) can do (call|check|raise|fold)(?: with (\d+))?/
	);
	if (!playerIdMatch) {
		console.log('Failed to parse can_do event:', message.event_data);
		return;
	}

	const playerId = playerIdMatch[1];
	const action = playerIdMatch[2];
	const amount = playerIdMatch[3] ? parseInt(playerIdMatch[3]) : 0;

	console.log('Can do event parsed:', {
		rawEvent: message.event_data,
		playerId,
		action,
		amount,
		fullMessage: message
	});

	gameStore.update((state) => {
		console.log('Current game state before can_do update:', {
			bank: state.bank,
			players: state.players,
			currentPlayerId: state.currentPlayerId
		});

		const availableActions = {
			canCall: action === 'call',
			canCheck: action === 'check',
			canRaise: true,
			callAmount: amount
		};

		console.log('Updating available actions:', availableActions);

		const newState = {
			...state,
			currentPlayerId: playerId,
			availableActions
		};

		console.log('New game state after can_do update:', {
			bank: newState.bank,
			players: newState.players,
			currentPlayerId: newState.currentPlayerId
		});

		return newState;
	});
};

export const handleCommunityCards = (message: any) => {
	console.log('Received community cards event:', message);

	const cards = parseCards(message.event_data);
	console.log('Parsed community cards:', cards);

	gameStore.update((state) => {
		console.log('Updating community cards:', {
			oldCards: state.communityCards,
			newCards: cards
		});

		return {
			...state,
			communityCards: cards
		};
	});
};

export const handleGetCards = (message: any) => {
	const playerIdMatch = message.event_data.match(/player (.*?) get cards/);
	if (!playerIdMatch) return;

	const playerId = playerIdMatch[1];
	const cards = parseCards(message.event_data);

	gameStore.update((state) => {
		const updatedPlayers = state.players.map((player) =>
			player.id === playerId ? { ...player, cards } : player
		);
		return { ...state, players: updatedPlayers };
	});
};

export const handleGameStarted = () => {
	showNotification('success', 'Игра началась!');
};

export const handleNewRound = (message: any) => {
	console.log('New round event received');
	showNotification('success', 'Новый раунд!');

	if (message.bank_amount !== undefined) {
		gameStore.update((state) => {
			console.log('Resetting bank for new round:', {
				oldBank: state.bank,
				newBank: message.bank_amount
			});

			return {
				...state,
				bank: message.bank_amount
			};
		});
	}
};

export const handleBlind = (message: any) => {
	const playerIdMatch = message.event_data.match(/player (.*?) bet (\d+) as/);
	if (!playerIdMatch) return;

	const playerId = playerIdMatch[1];
	const betAmount = parseInt(playerIdMatch[2]);

	let currentBank = 0;
	gameStore.subscribe((state) => {
		currentBank = state.bank;
	})();

	console.log('Blind bet event:', {
		eventType: message.event_type,
		playerId,
		betAmount,
		currentBank
	});

	gameStore.update((state) => {
		const updatedPlayers = state.players.map((player) =>
			player.id === playerId ? { ...player, balance: player.balance - betAmount } : player
		);

		const newBank = (state.bank || 0) + betAmount;
		console.log('Updating bank after blind:', {
			oldBank: state.bank,
			betAmount,
			newBank
		});

		const currentPlayerIndex = updatedPlayers.findIndex((p) => p.id === playerId);
		const nextPlayerIndex = (currentPlayerIndex + 1) % updatedPlayers.length;

		const nextPlayer =
			message.event_type === 'big_blind'
				? updatedPlayers[(nextPlayerIndex + 1) % updatedPlayers.length]
				: updatedPlayers[nextPlayerIndex];

		console.log('Setting next player after blind:', {
			currentPlayerId: playerId,
			nextPlayerId: nextPlayer.id,
			eventType: message.event_type
		});

		return {
			...state,
			players: updatedPlayers,
			bank: newBank,
			currentPlayerId: nextPlayer.id
		};
	});

	showNotification(
		'info',
		`${message.event_type === 'small_blind' ? 'Малый' : 'Большой'} блайнд: ${betAmount}`
	);
};

export const handleDo = (message: any) => {
	console.log('Received do event:', message);

	const playerIdMatch = message.event_data.match(
		/player (.*?) do (call|check|raise|fold)(?: with (\d+))? amount/
	);
	if (!playerIdMatch) {
		console.log('Failed to parse do event:', message.event_data);
		return;
	}

	const playerId = playerIdMatch[1];
	const action = playerIdMatch[2];
	const amount = playerIdMatch[3] ? parseInt(playerIdMatch[3]) : 0;

	console.log('Do event parsed:', {
		playerId,
		action,
		amount
	});

	gameStore.update((state) => {
		const newBank = (state.bank || 0) + amount;
		console.log('Updating bank after do event:', {
			oldBank: state.bank,
			amount,
			newBank
		});

		const updatedPlayers = state.players.map((player) =>
			player.id === playerId ? { ...player, balance: player.balance - amount } : player
		);

		return {
			...state,
			bank: newBank,
			players: updatedPlayers,
			availableActions: {
				canCall: false,
				canCheck: false,
				canRaise: false,
				callAmount: 0
			}
		};
	});
};

export const handleWinPot = (message: any) => {
	console.log('Received win_pot event:', message);

	const winMatch = message.event_data.match(/winners of pot \d+ with (\d+) amount: \[(.*?)\]/);
	if (!winMatch) {
		console.log('Failed to parse win_pot event:', message.event_data);
		return;
	}

	const winAmount = parseInt(winMatch[1]);
	const winners = winMatch[2].split(', ');

	console.log('Win pot parsed:', {
		winAmount,
		winners
	});

	gameStore.update((state) => {
		const updatedPlayers = state.players.map((player) => {
			if (winners.includes(player.id)) {
				const newBalance = player.balance + winAmount;
				console.log(`Updating balance for winner ${player.username}:`, {
					oldBalance: player.balance,
					winAmount,
					newBalance
				});
				return { ...player, balance: newBalance };
			}
			return player;
		});

		console.log('Resetting bank after win:', {
			oldBank: state.bank,
			newBank: 0
		});

		return {
			...state,
			players: updatedPlayers,
			bank: 0
		};
	});

	let currentState: any;
	gameStore.subscribe((state) => {
		currentState = state;
	})();

	const winnerNames = winners
		.map((id: string) => {
			const player = currentState.players.find((p: Player) => p.id === id);
			return player?.username || id;
		})
		.join(', ');

	showNotification('success', `Победители: ${winnerNames}. Выигрыш: $${winAmount}`);
};

export const handleNextMove = (message: any) => {
	console.log('Received next_move event:', message);

	const playerIdMatch = message.event_data.match(/next move expect from (.*?) player/);
	if (!playerIdMatch) {
		console.log('Failed to parse next_move event:', message.event_data);
		return;
	}

	const playerId = playerIdMatch[1];
	console.log('Next move player:', playerId);

	gameStore.update((state) => {
		const currentPlayer = state.players.find((player) => player.id === playerId);
		console.log('Current player:', currentPlayer);

		if (currentPlayer) {
			console.log('Showing notification for current player');
			showNotification('info', `Сейчас ходит ${currentPlayer.username}`);
		} else {
			console.log('Player not found in the game');
		}

		return {
			...state,
			currentPlayerId: playerId
		};
	});
};
