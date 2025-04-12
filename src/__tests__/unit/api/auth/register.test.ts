import { describe, it, expect, vi, beforeEach } from 'vitest';
import { registerUser } from '$api/auth/register';
import { sendConfirmationCode } from 'src/features/auth/api/sendCode';
import { mockFetch, mockApiResponses, mockUserData, expectedResults } from '../../utils/mocks';
import type { ApiResponse } from '../../utils/types';
import {
	expectRegisterFetchCall,
	expectSendConfirmationCodeCall,
	expectSendConfirmationCodeNotCalled
} from '../../utils/testHelpers';

vi.mock('$api/email/sendCode', () => {
	const mockSendConfirmationCode = vi.fn();
	return {
		sendConfirmationCode: mockSendConfirmationCode
	};
});

const mockSendConfirmationCode = vi.mocked(sendConfirmationCode);

describe('registerUser', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('успешно регистрирует пользователя и отправляет код подтверждения', async () => {
		mockFetch.mockResolvedValueOnce(mockApiResponses.success);
		mockSendConfirmationCode.mockResolvedValueOnce({
			success: true,
			expTime: '2024-04-08T12:00:00Z',
			nextCodeTime: '2024-04-08T13:00:00Z'
		});

		const result: ApiResponse = await registerUser(
			mockUserData.username,
			mockUserData.email,
			mockUserData.password
		);

		expectRegisterFetchCall();
		expectSendConfirmationCodeCall(mockSendConfirmationCode);
		expect(result).toEqual(expectedResults.register.registerSuccess);
	});

	it('возвращает ошибку при некорректных данных', async () => {
		mockFetch.mockResolvedValueOnce(mockApiResponses.badRequest);

		const result: ApiResponse = await registerUser(
			mockUserData.username,
			mockUserData.email,
			mockUserData.password
		);

		expectRegisterFetchCall();
		expect(result).toEqual(expectedResults.badRequest);
		expectSendConfirmationCodeNotCalled(mockSendConfirmationCode);
	});

	it('возвращает ошибку при занятом email или username', async () => {
		mockFetch.mockResolvedValueOnce(mockApiResponses.conflict);

		const result: ApiResponse = await registerUser(
			mockUserData.username,
			mockUserData.email,
			mockUserData.password
		);

		expectRegisterFetchCall();
		expect(result).toEqual(expectedResults.register.conflict);
		expectSendConfirmationCodeNotCalled(mockSendConfirmationCode);
	});

	it('возвращает ошибку при проблемах с сетью', async () => {
		mockFetch.mockRejectedValueOnce(new Error('Network error'));

		const result: ApiResponse = await registerUser(
			mockUserData.username,
			mockUserData.email,
			mockUserData.password
		);

		expectRegisterFetchCall();
		expect(result).toEqual(expectedResults.networkError);
		expectSendConfirmationCodeNotCalled(mockSendConfirmationCode);
	});

	it('возвращает ошибку при неудачной отправке кода подтверждения', async () => {
		mockFetch.mockResolvedValueOnce(mockApiResponses.success);
		mockSendConfirmationCode.mockRejectedValueOnce(new Error('Failed to send code'));

		const result: ApiResponse = await registerUser(
			mockUserData.username,
			mockUserData.email,
			mockUserData.password
		);

		expectRegisterFetchCall();
		expectSendConfirmationCodeCall(mockSendConfirmationCode);
		expect(result).toEqual(expectedResults.networkError);
	});

	it('возвращает ошибку при неизвестном статусе ответа', async () => {
		mockFetch.mockResolvedValueOnce(mockApiResponses.serverError);

		const result: ApiResponse = await registerUser(
			mockUserData.username,
			mockUserData.email,
			mockUserData.password
		);

		expectRegisterFetchCall();
		expect(result).toEqual(expectedResults.register.serverError);
		expectSendConfirmationCodeNotCalled(mockSendConfirmationCode);
	});

	it('возвращает ошибку при ошибке в sendConfirmationCode', async () => {
		mockFetch.mockResolvedValueOnce(mockApiResponses.success);
		mockSendConfirmationCode.mockRejectedValueOnce(new Error('Email service error'));

		const result: ApiResponse = await registerUser(
			mockUserData.username,
			mockUserData.email,
			mockUserData.password
		);

		expectRegisterFetchCall();
		expectSendConfirmationCodeCall(mockSendConfirmationCode);
		expect(result).toEqual(expectedResults.networkError);
	});
});
