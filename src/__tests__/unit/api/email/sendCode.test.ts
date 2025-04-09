import { describe, it, expect, vi, beforeEach } from 'vitest';
import { sendConfirmationCode } from '$api/email/sendCode';
import { mockFetch, mockUserData, mockApiResponses, expectedResults } from '../../utils/mocks';
import type { ApiResponse } from '../../utils/types';
import { expectSendCodeFetchCall } from '../../utils/testHelpers';

describe('sendConfirmationCode', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('успешно отправляет код подтверждения', async () => {
		mockFetch.mockResolvedValueOnce(mockApiResponses.sendCodeSuccess);

		const result: ApiResponse = await sendConfirmationCode(
			mockUserData.email,
			mockUserData.password
		);

		expectSendCodeFetchCall(mockUserData.email, mockUserData.password);
		expect(result).toEqual(expectedResults.email.sendCodeSuccess);
	});

	it('возвращает ошибку при некорректных данных', async () => {
		mockFetch.mockResolvedValueOnce(mockApiResponses.badRequest);

		const result: ApiResponse = await sendConfirmationCode(
			mockUserData.email,
			mockUserData.password
		);

		expectSendCodeFetchCall(mockUserData.email, mockUserData.password);
		expect(result).toEqual(expectedResults.badRequest);
	});

	it('возвращает ошибку при неверном пароле', async () => {
		mockFetch.mockResolvedValueOnce(mockApiResponses.unauthorized);

		const result: ApiResponse = await sendConfirmationCode(
			mockUserData.email,
			mockUserData.password
		);

		expectSendCodeFetchCall(mockUserData.email, mockUserData.password);
		expect(result).toEqual(expectedResults.email.invalidPassword);
	});

	it('возвращает ошибку при уже подтвержденном email', async () => {
		mockFetch.mockResolvedValueOnce(mockApiResponses.conflict);

		const result: ApiResponse = await sendConfirmationCode(
			mockUserData.email,
			mockUserData.password
		);

		expectSendCodeFetchCall(mockUserData.email, mockUserData.password);
		expect(result).toEqual(expectedResults.email.conflict);
	});

	it('возвращает ошибку при проблемах с сетью', async () => {
		mockFetch.mockRejectedValueOnce(new Error('Network error'));

		const result: ApiResponse = await sendConfirmationCode(
			mockUserData.email,
			mockUserData.password
		);

		expectSendCodeFetchCall(mockUserData.email, mockUserData.password);
		expect(result).toEqual(expectedResults.networkError);
	});
});
