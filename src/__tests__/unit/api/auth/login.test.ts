import { describe, it, expect, vi, beforeEach } from 'vitest';
import { loginUser } from '$api/auth/login';
import { sendConfirmationCode } from '$api/email/sendCode';
import { setUser } from '$stores/data/userStore';
import {
	mockFetch,
	mockUserData,
	mockTokens,
	mockApiResponses,
	expectedResults
} from '../../utils/mocks';
import type { ApiResponse } from '../../utils/types';
import {
	expectLoginFetchCall,
	expectSendConfirmationCodeCall,
	expectSendConfirmationCodeNotCalled,
	expectTokensSaved,
	expectTokensNotSaved,
	expectUserSet,
	expectUserNotSet,
	createSuccessResponseWithUserAndTokens
} from '../../utils/testHelpers';

const mockLocalStorage = {
	setItem: vi.fn()
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

vi.mock('$api/email/sendCode', () => {
	const mockSendConfirmationCode = vi.fn();
	return {
		sendConfirmationCode: mockSendConfirmationCode
	};
});

vi.mock('$stores/data/userStore', () => {
	const mockSetUser = vi.fn();
	return {
		setUser: mockSetUser
	};
});

const mockSendConfirmationCode = vi.mocked(sendConfirmationCode);
const mockSetUser = vi.mocked(setUser);

describe('loginUser', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('успешно авторизует пользователя', async () => {
		mockFetch.mockResolvedValueOnce(
			createSuccessResponseWithUserAndTokens(mockUserData, mockTokens)
		);

		const result: ApiResponse = await loginUser(mockUserData.email, mockUserData.password);

		expectLoginFetchCall();
		expectTokensSaved(mockLocalStorage, mockTokens);
		expectUserSet(mockSetUser, mockUserData);
		expectSendConfirmationCodeNotCalled(mockSendConfirmationCode);
		expect(result).toEqual(expectedResults.auth.loginSuccess);
	});

	it('возвращает ошибку при некорректных данных', async () => {
		mockFetch.mockResolvedValueOnce(mockApiResponses.badRequest);

		const result: ApiResponse = await loginUser(mockUserData.email, mockUserData.password);

		expectLoginFetchCall();
		expectTokensNotSaved(mockLocalStorage);
		expectUserNotSet(mockSetUser);
		expectSendConfirmationCodeNotCalled(mockSendConfirmationCode);
		expect(result).toEqual(expectedResults.badRequest);
	});

	it('возвращает ошибку при неверном логине или пароле', async () => {
		mockFetch.mockResolvedValueOnce(mockApiResponses.unauthorized);

		const result: ApiResponse = await loginUser(mockUserData.email, mockUserData.password);

		expectLoginFetchCall();
		expectTokensNotSaved(mockLocalStorage);
		expectUserNotSet(mockSetUser);
		expectSendConfirmationCodeNotCalled(mockSendConfirmationCode);
		expect(result).toEqual(expectedResults.auth.unauthorized);
	});

	it('возвращает ошибку при неподтвержденном email', async () => {
		mockFetch.mockResolvedValueOnce(mockApiResponses.forbidden);
		mockSendConfirmationCode.mockResolvedValueOnce({
			success: true,
			expTime: '2024-04-08T12:00:00Z',
			nextCodeTime: '2024-04-08T13:00:00Z'
		});

		const result: ApiResponse = await loginUser(mockUserData.email, mockUserData.password);

		expectLoginFetchCall();
		expectTokensNotSaved(mockLocalStorage);
		expectUserNotSet(mockSetUser);
		expectSendConfirmationCodeCall(mockSendConfirmationCode);
		expect(result).toEqual(expectedResults.auth.forbidden);
	});

	it('возвращает ошибку при неподтвержденном email и исключении в sendConfirmationCode', async () => {
		mockFetch.mockResolvedValueOnce(mockApiResponses.forbidden);
		mockSendConfirmationCode.mockRejectedValueOnce(new Error('Email service error'));

		const result: ApiResponse = await loginUser(mockUserData.email, mockUserData.password);

		expectLoginFetchCall();
		expectTokensNotSaved(mockLocalStorage);
		expectUserNotSet(mockSetUser);
		expectSendConfirmationCodeCall(mockSendConfirmationCode);
		expect(result).toEqual(expectedResults.networkError);
	});

	it('возвращает ошибку при незарегистрированном email', async () => {
		mockFetch.mockResolvedValueOnce(mockApiResponses.notFound);

		const result: ApiResponse = await loginUser(mockUserData.email, mockUserData.password);

		expectLoginFetchCall();
		expectTokensNotSaved(mockLocalStorage);
		expectUserNotSet(mockSetUser);
		expectSendConfirmationCodeNotCalled(mockSendConfirmationCode);
		expect(result).toEqual(expectedResults.notFound);
	});

	it('возвращает ошибку при неизвестном статусе ответа', async () => {
		mockFetch.mockResolvedValueOnce(mockApiResponses.serverError);

		const result: ApiResponse = await loginUser(mockUserData.email, mockUserData.password);

		expectLoginFetchCall();
		expectTokensNotSaved(mockLocalStorage);
		expectUserNotSet(mockSetUser);
		expectSendConfirmationCodeNotCalled(mockSendConfirmationCode);
		expect(result).toEqual(expectedResults.auth.serverError);
	});

	it('возвращает ошибку при проблемах с сетью', async () => {
		mockFetch.mockRejectedValueOnce(new Error('Network error'));

		const result: ApiResponse = await loginUser(mockUserData.email, mockUserData.password);

		expectLoginFetchCall();
		expectTokensNotSaved(mockLocalStorage);
		expectUserNotSet(mockSetUser);
		expectSendConfirmationCodeNotCalled(mockSendConfirmationCode);
		expect(result).toEqual(expectedResults.networkError);
	});
});
