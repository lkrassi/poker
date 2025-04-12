import { vi } from 'vitest';
import type { MockResponse, MockApiResponse, User, UserData, Tokens, LobbyData } from './types';

export const mockFetch = vi.fn();

global.fetch = mockFetch;

export const BASE_URL = 'https://poker-tt7i.onrender.com';

export const mockUserData: UserData = {
	username: 'testuser',
	email: 'test@example.com',
	password: 'password123'
};

export const mockTokens: Tokens = {
	access_token: 'test-access-token',
	refresh_token: 'test-refresh-token'
};

export const mockLobbyData: LobbyData = {
	ante: 10,
	blind_increase_time: '30m',
	cache_game: true,
	max_players: 6,
	small_blind: 5
};

export const mockLobbies = [
	{
		id: 'lobby-1',
		ante: 10,
		blind_increase_time: '30m',
		cache_game: true,
		max_players: 6,
		small_blind: 5,
		created_at: '2024-04-08T12:00:00Z',
		updated_at: '2024-04-08T12:00:00Z',
		creator_id: 1,
		players: []
	},
	{
		id: 'lobby-2',
		ante: 20,
		blind_increase_time: '15m',
		cache_game: false,
		max_players: 4,
		small_blind: 10,
		created_at: '2024-04-08T13:00:00Z',
		updated_at: '2024-04-08T13:00:00Z',
		creator_id: 2,
		players: []
	}
];

export const newTokens: Tokens = {
	access_token: 'new-access-token-123',
	refresh_token: 'new-refresh-token-456'
};

export const mockApiResponses = {
	success: {
		status: 201,
		ok: true,
		json: () => Promise.resolve({})
	} as MockResponse,
	badRequest: {
		status: 400,
		ok: false,
		json: () => Promise.resolve({})
	} as MockResponse,
	unauthorized: {
		status: 401,
		ok: false,
		json: () => Promise.resolve({})
	} as MockResponse,
	forbidden: {
		status: 403,
		ok: false,
		json: () => Promise.resolve({})
	} as MockResponse,
	notFound: {
		status: 404,
		ok: false,
		json: () => Promise.resolve({})
	} as MockResponse,
	conflict: {
		status: 409,
		ok: false,
		json: () => Promise.resolve({})
	} as MockResponse,
	serverError: {
		status: 500,
		ok: false,
		json: () => Promise.resolve({})
	} as MockResponse,
	refreshSuccess: {
		status: 201,
		ok: true,
		json: () =>
			Promise.resolve({
				tokens: newTokens
			})
	} as MockResponse,
	refreshError: {
		status: 401,
		ok: false,
		json: () => Promise.resolve({ message: 'Недействительный токен' })
	} as MockResponse,
	sendCodeSuccess: {
		status: 201,
		ok: true,
		json: () =>
			Promise.resolve({
				exp_time: '2024-04-08T12:00:00Z',
				next_code_time: '2024-04-08T13:00:00Z'
			})
	} as MockResponse,
	confirmEmailSuccess: {
		status: 201,
		ok: true,
		json: () => Promise.resolve({})
	} as MockResponse,
	createLobbySuccess: {
		status: 201,
		ok: true,
		json: () => Promise.resolve({ lobbyId: 'test-lobby-id' })
	} as MockResponse,
	getAllLobbiesSuccess: {
		status: 200,
		ok: true,
		json: () => Promise.resolve(mockLobbies)
	} as MockResponse,
	dailyRewardSuccess: {
		status: 200,
		ok: true,
		json: () => Promise.resolve({ amount: 100, sector: '3' })
	} as MockResponse
};

const commonErrors = {
	badRequest: {
		success: false,
		message: 'Некорректные данные или не все поля заполнены'
	},
	networkError: {
		success: false,
		message: 'Ошибка сети, проверьте подключение'
	},
	notFound: {
		success: false,
		message: 'Email не зарегистрирован'
	}
};

const authErrors = {
	unauthorized: {
		success: false,
		message: 'Неверный логин или пароль'
	},
	forbidden: {
		success: false,
		message: 'Email не подтвержден'
	},
	serverError: {
		success: false,
		message: 'Ошибка авторизации, попробуйте позже'
	}
};

const emailErrors = {
	conflict: {
		success: false,
		message: 'Email уже подтвержден'
	},
	invalidCode: {
		success: false,
		message: 'Неверный код, повторите попытку'
	},
	serverError: {
		success: false,
		message: 'Произошла ошибка на сервере'
	},
	invalidPassword: {
		success: false,
		message: 'Неверный пароль'
	}
};

const registerErrors = {
	conflict: {
		success: false,
		message: 'Email или имя пользователя уже заняты'
	},
	serverError: {
		success: false,
		message: 'Ошибка регистрации, попробуйте позже'
	}
};

const lobbyErrors = {
	badRequest: {
		success: false,
		message: 'Ошибка в данных лобби'
	},
	unauthorized: {
		success: false,
		message: 'Неверный идентификатор пользователя'
	},
	serverError: {
		success: false,
		message: 'Ошибка при создании лобби'
	},
	getAllBadRequest: {
		success: false,
		message: 'Неверный параметр страницы'
	},
	getAllServerError: {
		success: false,
		message: 'Ошибка при получении списка лобби'
	}
};

const userErrors = {
	dailyRewardBadRequest: {
		success: false,
		message: 'Следующая награда будет доступна в понедельник, 8 апреля 2024 г. в 19:00:00 GMT+7'
	},
	dailyRewardUnauthorized: {
		success: false,
		message: 'Некорректный идентификатор пользователя'
	},
	dailyRewardServerError: {
		success: false,
		message: 'Ошибка при получении награды'
	}
};

export const mockUser: User = {
	id: 1,
	username: 'testuser',
	email: 'test@example.com',
	avatar: 'https://example.com/avatar.jpg',
	created_at: '2024-03-19T12:00:00Z',
	updated_at: '2024-03-19T12:00:00Z'
};

export const mockGetUserByUsernameResponses: MockApiResponse = {
	success: {
		status: 200,
		ok: true,
		json: async () => mockUser
	},
	badRequest: {
		status: 400,
		ok: false,
		json: async () => ({ success: false, message: 'Имя пользователя не может быть пустым' })
	},
	unauthorized: {
		status: 401,
		ok: false,
		json: async () => ({ success: false, message: 'Не авторизован' })
	},
	serverError: {
		status: 500,
		ok: false,
		json: async () => ({ success: false, message: 'Ошибка сервера' })
	}
};

export const expectedResults = {
	...commonErrors,
	auth: {
		...authErrors,
		refreshSuccess: {
			success: true,
			message: 'Токены успешно обновлены',
			tokens: newTokens
		},
		refreshError: {
			success: false,
			message: 'Ошибка обновления токенов, попробуйте позже'
		},
		loginSuccess: {
			success: true,
			message: 'Вход успешен!',
			user: mockUserData
		}
	},
	email: {
		...emailErrors,
		confirmEmailSuccess: {
			success: true,
			message: 'Email успешно подтвержден!'
		},
		sendCodeSuccess: {
			success: true,
			expTime: '2024-04-08T12:00:00Z',
			nextCodeTime: '2024-04-08T13:00:00Z'
		}
	},
	register: {
		...registerErrors,
		registerSuccess: {
			success: true,
			message: 'Регистрация успешна! Код отправлен на почту',
			expTime: '2024-04-08T12:00:00Z',
			nextCodeTime: '2024-04-08T13:00:00Z'
		}
	},
	lobby: {
		...lobbyErrors,
		createSuccess: {
			success: true,
			lobbyId: 'test-lobby-id'
		},
		getAllSuccess: {
			success: true,
			lobbies: mockLobbies
		},
		invalidPage: {
			success: false,
			message: 'Номер страницы не может быть отрицательным'
		}
	},
	user: {
		...userErrors,
		dailyRewardSuccess: {
			success: true,
			amount: 100,
			sector: '3'
		}
	},
	getUserByUsername: {
		success: {
			success: true,
			user: mockUser
		},
		badRequest: {
			success: false,
			message: 'Имя пользователя не может быть пустым'
		},
		unauthorized: {
			success: false,
			message: 'Не авторизован'
		},
		serverError: {
			success: false,
			message: 'Ошибка сервера'
		},
		notFound: {
			success: false,
			message: 'Пользователь не найден'
		},
		networkError: {
			success: false,
			message: 'Ошибка сети, проверьте подключение'
		}
	}
};
