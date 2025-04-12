import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getUserByUsername } from 'src/features/profile/api/getUserByUsername';
import {
	mockFetch,
	mockGetUserByUsernameResponses,
	expectedResults,
	mockUser
} from '../../utils/mocks';
import { expectGetUserByUsernameFetchCall } from '../../utils/testHelpers';
import { get } from 'svelte/store';

vi.mock('$lib/fetchWithRefresh', () => ({
	default: vi.fn().mockImplementation((url, options) => {
		return mockFetch(url, options);
	})
}));

vi.mock('$stores/data/userStore', () => ({
	userStore: {
		subscribe: vi.fn()
	},
	setUser: vi.fn()
}));

vi.mock('svelte/store', () => ({
	get: vi.fn()
}));

describe('getUserByUsername', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockFetch.mockReset();
		localStorage.clear();
		localStorage.setItem('access_token', 'test-access-token');

		vi.mocked(get).mockReturnValue({ user: { username: 'testuser' } });
	});

	it('успешно получает данные пользователя', async () => {
		mockFetch.mockResolvedValueOnce(mockGetUserByUsernameResponses.success);

		const result = await getUserByUsername();

		expectGetUserByUsernameFetchCall('testuser');
		expect(result).toEqual({ success: true, user: mockUser });
	});

	it('возвращает ошибку, если имя пользователя пустое', async () => {
		vi.mocked(get).mockReturnValue({ user: { username: '' } });

		const result = await getUserByUsername();

		expect(mockFetch).not.toHaveBeenCalled();
		expect(result).toEqual(expectedResults.getUserByUsername.badRequest);
	});

	it('возвращает ошибку при неверном запросе', async () => {
		mockFetch.mockResolvedValueOnce(mockGetUserByUsernameResponses.badRequest);

		const result = await getUserByUsername();

		expectGetUserByUsernameFetchCall('testuser');
		expect(result).toEqual(expectedResults.getUserByUsername.badRequest);
	});

	it('возвращает ошибку при отсутствии авторизации', async () => {
		mockFetch.mockResolvedValueOnce(mockGetUserByUsernameResponses.unauthorized);

		const result = await getUserByUsername();

		expectGetUserByUsernameFetchCall('testuser');
		expect(result).toEqual(expectedResults.getUserByUsername.unauthorized);
	});

	it('возвращает ошибку при ошибке сервера', async () => {
		mockFetch.mockResolvedValueOnce(mockGetUserByUsernameResponses.serverError);

		const result = await getUserByUsername();

		expectGetUserByUsernameFetchCall('testuser');
		expect(result).toEqual(expectedResults.getUserByUsername.serverError);
	});

	it('возвращает ошибку при ошибке сети', async () => {
		mockFetch.mockRejectedValueOnce(new Error('Network error'));

		const result = await getUserByUsername();

		expectGetUserByUsernameFetchCall('testuser');
		expect(result).toEqual(expectedResults.getUserByUsername.networkError);
	});
});
