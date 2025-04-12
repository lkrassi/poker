import { describe, it, expect, vi, beforeEach } from 'vitest';
import { refreshToken } from 'src/features/auth/api/refresh';
import { setUser } from '$stores/data/userStore';
import { mockFetch, mockApiResponses, expectedResults, newTokens } from '../../utils/mocks';
import type { ApiResponse } from '../../utils/types';
import {
	expectRefreshTokenFetchCall,
	expectTokensSaved,
	expectTokensNotSaved,
	expectUserNotSet
} from '../../utils/testHelpers';

const mockLocalStorage = {
	setItem: vi.fn()
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

vi.mock('$stores/data/userStore', () => {
	const mockSetUser = vi.fn() as any;
	return {
		setUser: mockSetUser
	};
});

const mockSetUser = vi.mocked(setUser);

describe('refreshToken', () => {
	const oldTokens = {
		access_token: 'old-access-token-789',
		refresh_token: 'old-refresh-token-012'
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('успешно обновляет токены', async () => {
		const successResponse = {
			status: 201,
			ok: true,
			json: () =>
				Promise.resolve({
					access_token: newTokens.access_token,
					refresh_token: newTokens.refresh_token
				})
		};
		mockFetch.mockResolvedValueOnce(successResponse);

		const result: ApiResponse = await refreshToken(oldTokens.access_token, oldTokens.refresh_token);

		expectRefreshTokenFetchCall(oldTokens.access_token, oldTokens.refresh_token);
		expectTokensSaved(mockLocalStorage, expectedResults.auth.refreshSuccess.tokens);
		expectUserNotSet(mockSetUser);
		expect(result).toEqual(expectedResults.auth.refreshSuccess);
	});

	it('возвращает ошибку при неуспешном обновлении токенов', async () => {
		mockFetch.mockResolvedValueOnce(mockApiResponses.refreshError);

		const result: ApiResponse = await refreshToken(oldTokens.access_token, oldTokens.refresh_token);

		expectRefreshTokenFetchCall(oldTokens.access_token, oldTokens.refresh_token);
		expectTokensNotSaved(mockLocalStorage);
		expectUserNotSet(mockSetUser);
		expect(result).toEqual(expectedResults.auth.refreshError);
	});

	it('возвращает ошибку при проблемах с сетью', async () => {
		mockFetch.mockRejectedValueOnce(new Error('Network error'));

		const result: ApiResponse = await refreshToken(oldTokens.access_token, oldTokens.refresh_token);

		expectRefreshTokenFetchCall(oldTokens.access_token, oldTokens.refresh_token);
		expectTokensNotSaved(mockLocalStorage);
		expectUserNotSet(mockSetUser);
		expect(result).toEqual(expectedResults.networkError);
	});
});
