import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getAllLobbies } from '$api/lobby/getAllLobbies';
import { mockFetch, mockApiResponses, expectedResults, mockTokens } from '../../utils/mocks';
import type { ApiResponse } from '../../utils/types';
import { expectGetAllLobbiesFetchCall } from '../../utils/testHelpers';

// Мокаем localStorage
const mockLocalStorage = {
	getItem: vi.fn(),
	setItem: vi.fn()
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

// Мокаем модули
vi.mock('$lib/fetchWithRefresh', () => ({
	default: vi.fn()
}));

vi.mock('$lib/apiFacade', () => ({
	apiFacade: {
		refreshToken: vi.fn()
	}
}));

// Импортируем моки после их создания
import fetchWithRefresh from '$lib/fetchWithRefresh';
import { apiFacade } from '$lib/apiFacade';

describe('getAllLobbies', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockLocalStorage.getItem.mockReturnValue(mockTokens.access_token);
		vi.mocked(fetchWithRefresh).mockImplementation((url: string, options: RequestInit) =>
			mockFetch(url, options)
		);
		vi.mocked(apiFacade.refreshToken).mockResolvedValue(expectedResults.auth.refreshError);
	});

	it('успешно получает список лобби', async () => {
		mockFetch.mockResolvedValueOnce(mockApiResponses.getAllLobbiesSuccess);

		const result: ApiResponse = await getAllLobbies(0);

		expectGetAllLobbiesFetchCall(0);
		expect(result).toEqual(expectedResults.lobby.getAllSuccess);
	});

	it('возвращает ошибку при отрицательном номере страницы', async () => {
		const result: ApiResponse = await getAllLobbies(-1);

		expect(mockFetch).not.toHaveBeenCalled();
		expect(result).toEqual(expectedResults.lobby.invalidPage);
	});

	it('возвращает ошибку при некорректных данных', async () => {
		mockFetch.mockResolvedValueOnce(mockApiResponses.badRequest);

		const result: ApiResponse = await getAllLobbies(0);

		expectGetAllLobbiesFetchCall(0);
		expect(result).toEqual(expectedResults.lobby.getAllBadRequest);
	});

	it('возвращает ошибку при неверном идентификаторе пользователя', async () => {
		mockFetch.mockResolvedValueOnce(mockApiResponses.unauthorized);

		const result: ApiResponse = await getAllLobbies(0);

		expectGetAllLobbiesFetchCall(0);
		expect(result).toEqual(expectedResults.lobby.unauthorized);
	});

	it('возвращает ошибку при неизвестном статусе ответа', async () => {
		mockFetch.mockResolvedValueOnce(mockApiResponses.serverError);

		const result: ApiResponse = await getAllLobbies(0);

		expectGetAllLobbiesFetchCall(0);
		expect(result).toEqual(expectedResults.lobby.getAllServerError);
	});

	it('возвращает ошибку при проблемах с сетью', async () => {
		mockFetch.mockRejectedValueOnce(new Error('Network error'));

		const result: ApiResponse = await getAllLobbies(0);

		expectGetAllLobbiesFetchCall(0);
		expect(result).toEqual(expectedResults.networkError);
	});
});
