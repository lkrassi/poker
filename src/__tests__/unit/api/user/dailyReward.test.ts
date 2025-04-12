import { describe, it, expect, vi, beforeEach } from 'vitest';
import { claimDailyReward } from 'src/features/profile/api/dailyReward';
import { mockFetch, mockApiResponses, expectedResults, mockTokens } from '../../utils/mocks';
import type { ApiResponse } from '../../utils/types';
import { expectDailyRewardFetchCall } from '../../utils/testHelpers';

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

import fetchWithRefresh from 'src/shared/lib/api/fetchWithRefresh';
import { apiFacade } from 'src/shared/lib/api/apiFacade';

describe('claimDailyReward', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockLocalStorage.getItem.mockReturnValue(mockTokens.access_token);
		vi.mocked(fetchWithRefresh).mockImplementation((url: string, options: RequestInit) =>
			mockFetch(url, options)
		);
		vi.mocked(apiFacade.refreshToken).mockResolvedValue(expectedResults.auth.refreshError);
	});

	it('успешно получает ежедневную награду', async () => {
		mockFetch.mockResolvedValueOnce(mockApiResponses.dailyRewardSuccess);

		const result: ApiResponse = await claimDailyReward();

		expectDailyRewardFetchCall();
		expect(result).toEqual(expectedResults.user.dailyRewardSuccess);
	});

	it('возвращает ошибку при некорректных данных', async () => {
		const mockBadRequestResponse = {
			status: 400,
			ok: false,
			json: () => Promise.resolve({ message: '2024-04-08T12:00:00Z' })
		};

		mockFetch.mockResolvedValueOnce(mockBadRequestResponse);

		const result: ApiResponse = await claimDailyReward();

		expectDailyRewardFetchCall();
		expect(result).toEqual(expectedResults.user.dailyRewardBadRequest);
	});

	it('возвращает ошибку при неверном идентификаторе пользователя', async () => {
		mockFetch.mockResolvedValueOnce(mockApiResponses.unauthorized);

		const result: ApiResponse = await claimDailyReward();

		expectDailyRewardFetchCall();
		expect(result).toEqual(expectedResults.user.dailyRewardUnauthorized);
	});

	it('возвращает ошибку при неизвестном статусе ответа', async () => {
		mockFetch.mockResolvedValueOnce(mockApiResponses.serverError);

		const result: ApiResponse = await claimDailyReward();

		expectDailyRewardFetchCall();
		expect(result).toEqual(expectedResults.user.dailyRewardServerError);
	});

	it('возвращает ошибку при проблемах с сетью', async () => {
		mockFetch.mockRejectedValueOnce(new Error('Network error'));

		const result: ApiResponse = await claimDailyReward();

		expectDailyRewardFetchCall();
		expect(result).toEqual(expectedResults.networkError);
	});
});
