import { expect } from 'vitest';
import { mockFetch, BASE_URL, mockUserData } from './mocks';
import type { MockResponse, UserData, Tokens, LobbyData } from './types';

type MockFn = any;

interface FetchCallParams {
	endpoint: string;
	method?: string;
	body?: Record<string, any>;
	headers?: Record<string, string>;
}

const expectFetchCall = ({ endpoint, method = 'POST', body, headers }: FetchCallParams) => {
	expect(mockFetch).toHaveBeenCalledWith(`${BASE_URL}${endpoint}`, {
		method,
		headers: {
			'Content-Type': 'application/json',
			...headers
		},
		body: JSON.stringify(body)
	});
};

export const expectRegisterFetchCall = () => {
	expectFetchCall({
		endpoint: '/auth/sign_up',
		body: mockUserData
	});
};

export const expectLoginFetchCall = () => {
	expectFetchCall({
		endpoint: '/auth/sign_in',
		body: {
			email: mockUserData.email,
			password: mockUserData.password
		}
	});
};

export const expectRefreshTokenFetchCall = (accessToken: string, refreshToken: string) => {
	expectFetchCall({
		endpoint: '/auth/refresh_token',
		body: { access_token: accessToken, refresh_token: refreshToken }
	});
};

export const expectSendCodeFetchCall = (email: string, password: string) => {
	expectFetchCall({
		endpoint: '/auth/send_code',
		body: { email, password }
	});
};

export const expectConfirmEmailFetchCall = (email: string, code: string) => {
	expectFetchCall({
		endpoint: '/auth/confirm_email',
		body: { email, code }
	});
};

export const expectCreateLobbyFetchCall = (lobbyData: LobbyData) => {
	expectFetchCall({
		endpoint: '/lobby/',
		body: lobbyData,
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${localStorage.getItem('access_token')}`
		}
	});
};

export const expectGetAllLobbiesFetchCall = (page: number) => {
	expectFetchCall({
		endpoint: `/lobby/all/${page}`,
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${localStorage.getItem('access_token')}`
		}
	});
};

export const expectGetUserByUsernameFetchCall = (username: string) => {
	expectFetchCall({
		endpoint: `/user/${username}`,
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${localStorage.getItem('access_token')}`
		}
	});
};

export const expectDailyRewardFetchCall = () => {
	expectFetchCall({
		endpoint: '/user/daily',
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${localStorage.getItem('access_token')}`
		}
	});
};

export const expectSendConfirmationCodeCall = (mockSendConfirmationCode: MockFn) => {
	expect(mockSendConfirmationCode).toHaveBeenCalledWith(mockUserData.email, mockUserData.password);
};

export const expectSendConfirmationCodeNotCalled = (mockSendConfirmationCode: MockFn) => {
	expect(mockSendConfirmationCode).not.toHaveBeenCalled();
};

export const expectTokensSaved = (mockLocalStorage: MockFn, tokens: Tokens) => {
	expect(mockLocalStorage.setItem).toHaveBeenCalledWith('access_token', tokens.access_token);
	expect(mockLocalStorage.setItem).toHaveBeenCalledWith('refresh_token', tokens.refresh_token);
};

export const expectTokensNotSaved = (mockLocalStorage: MockFn) => {
	expect(mockLocalStorage.setItem).not.toHaveBeenCalled();
};

export const expectUserSet = (mockSetUser: MockFn, user: UserData) => {
	expect(mockSetUser).toHaveBeenCalledWith(user);
};

export const expectUserNotSet = (mockSetUser: MockFn) => {
	expect(mockSetUser).not.toHaveBeenCalled();
};

export const createSuccessResponseWithUserAndTokens = (
	user: UserData,
	tokens: Tokens
): MockResponse => ({
	status: 201,
	ok: true,
	json: () => Promise.resolve({ user, tokens })
});
