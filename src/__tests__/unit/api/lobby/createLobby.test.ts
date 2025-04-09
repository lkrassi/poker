import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createLobby } from '$api/lobby/createLobby';
import {
	mockFetch,
	mockLobbyData,
	mockApiResponses,
	expectedResults,
	mockTokens
} from '../../utils/mocks';
import type { ApiResponse } from '../../utils/types';
import { expectCreateLobbyFetchCall } from '../../utils/testHelpers';

const mockLocalStorage = {
	getItem: vi.fn(),
	setItem: vi.fn()
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

vi.mock('$lib/fetchWithRefresh', () => ({
	default: vi.fn()
}));

vi.mock('$lib/apiFacade', () => ({
	apiFacade: {
		refreshToken: vi.fn()
	}
}));

import fetchWithRefresh from '$lib/fetchWithRefresh';
import { apiFacade } from '$lib/apiFacade';

describe('createLobby', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockLocalStorage.getItem.mockReturnValue(mockTokens.access_token);
		vi.mocked(fetchWithRefresh).mockImplementation((url: string, options: RequestInit) =>
			mockFetch(url, options)
		);
		vi.mocked(apiFacade.refreshToken).mockResolvedValue(expectedResults.auth.refreshError);
	});

	it('успешно создает лобби', async () => {
		mockFetch.mockResolvedValueOnce(mockApiResponses.createLobbySuccess);

		const result: ApiResponse = await createLobby(mockLobbyData);

		expectCreateLobbyFetchCall(mockLobbyData);
		expect(result).toEqual(expectedResults.lobby.createSuccess);
	});

	it('возвращает ошибку при некорректных данных', async () => {
		mockFetch.mockResolvedValueOnce(mockApiResponses.badRequest);

		const result: ApiResponse = await createLobby(mockLobbyData);

		expectCreateLobbyFetchCall(mockLobbyData);
		expect(result).toEqual(expectedResults.lobby.badRequest);
	});

	it('возвращает ошибку при неверном идентификаторе пользователя', async () => {
		mockFetch.mockResolvedValueOnce(mockApiResponses.unauthorized);

		const result: ApiResponse = await createLobby(mockLobbyData);

		expectCreateLobbyFetchCall(mockLobbyData);
		expect(result).toEqual(expectedResults.lobby.unauthorized);
	});

	it('возвращает ошибку при неизвестном статусе ответа', async () => {
		mockFetch.mockResolvedValueOnce(mockApiResponses.serverError);

		const result: ApiResponse = await createLobby(mockLobbyData);

		expectCreateLobbyFetchCall(mockLobbyData);
		expect(result).toEqual(expectedResults.lobby.serverError);
	});

	it('возвращает ошибку при проблемах с сетью', async () => {
		mockFetch.mockRejectedValueOnce(new Error('Network error'));

		const result: ApiResponse = await createLobby(mockLobbyData);

		expectCreateLobbyFetchCall(mockLobbyData);
		expect(result).toEqual(expectedResults.networkError);
	});
});
