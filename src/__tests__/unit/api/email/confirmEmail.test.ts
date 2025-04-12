import { describe, it, expect, vi, beforeEach } from 'vitest';
import { confirmEmail } from 'src/features/auth/api/confirmEmail';
import { mockFetch, mockUserData, mockApiResponses, expectedResults } from '../../utils/mocks';
import type { ApiResponse } from '../../utils/types';
import { expectConfirmEmailFetchCall } from '../../utils/testHelpers';

describe('confirmEmail', () => {
	const mockCode = '123456';

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('успешно подтверждает email', async () => {
		mockFetch.mockResolvedValueOnce(mockApiResponses.confirmEmailSuccess);

		const result: ApiResponse = await confirmEmail(mockUserData.email, mockCode);

		expectConfirmEmailFetchCall(mockUserData.email, mockCode);
		expect(result).toEqual(expectedResults.email.confirmEmailSuccess);
	});

	it('возвращает ошибку при некорректных данных', async () => {
		mockFetch.mockResolvedValueOnce(mockApiResponses.badRequest);

		const result: ApiResponse = await confirmEmail(mockUserData.email, mockCode);

		expectConfirmEmailFetchCall(mockUserData.email, mockCode);
		expect(result).toEqual(expectedResults.badRequest);
	});

	it('возвращает ошибку при неверном коде', async () => {
		mockFetch.mockResolvedValueOnce(mockApiResponses.unauthorized);

		const result: ApiResponse = await confirmEmail(mockUserData.email, mockCode);

		expectConfirmEmailFetchCall(mockUserData.email, mockCode);
		expect(result).toEqual(expectedResults.email.invalidCode);
	});

	it('возвращает ошибку при незарегистрированном email', async () => {
		mockFetch.mockResolvedValueOnce(mockApiResponses.notFound);

		const result: ApiResponse = await confirmEmail(mockUserData.email, mockCode);

		expectConfirmEmailFetchCall(mockUserData.email, mockCode);
		expect(result).toEqual(expectedResults.notFound);
	});

	it('возвращает ошибку при уже подтвержденном email', async () => {
		mockFetch.mockResolvedValueOnce(mockApiResponses.conflict);

		const result: ApiResponse = await confirmEmail(mockUserData.email, mockCode);

		expectConfirmEmailFetchCall(mockUserData.email, mockCode);
		expect(result).toEqual(expectedResults.email.conflict);
	});

	it('возвращает ошибку при ошибке сервера', async () => {
		mockFetch.mockResolvedValueOnce(mockApiResponses.serverError);

		const result: ApiResponse = await confirmEmail(mockUserData.email, mockCode);

		expectConfirmEmailFetchCall(mockUserData.email, mockCode);
		expect(result).toEqual(expectedResults.email.serverError);
	});

	it('возвращает ошибку при проблемах с сетью', async () => {
		mockFetch.mockRejectedValueOnce(new Error('Network error'));

		const result: ApiResponse = await confirmEmail(mockUserData.email, mockCode);

		expectConfirmEmailFetchCall(mockUserData.email, mockCode);
		expect(result).toEqual(expectedResults.networkError);
	});
});
