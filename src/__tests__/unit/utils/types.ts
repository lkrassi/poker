export interface ApiResponse {
	success: boolean;
	message?: string;
	expTime?: string;
	nextCodeTime?: string;
	user?: UserData;
	tokens?: Tokens;
	amount?: number;
	sector?: string;
}

export interface UserData {
	username: string;
	email: string;
	password: string;
	id?: number;
}

export interface MockResponse {
	status: number;
	ok: boolean;
	json: () => Promise<any>;
}

export interface Tokens {
	access_token: string;
	refresh_token: string;
}

export interface LobbyData {
	ante: number;
	blind_increase_time: string;
	cache_game: boolean;
	max_players: number;
	small_blind: number;
}

export interface User {
	id: number;
	username: string;
	email: string;
	avatar: string;
	created_at: string;
	updated_at: string;
}

export interface UserResponse {
	success: boolean;
	user?: User;
	message?: string;
}

export interface MockApiResponse {
	success: MockResponse;
	badRequest: MockResponse;
	unauthorized: MockResponse;
	serverError: MockResponse;
}

export interface MockApiResponses {
	success: MockApiResponse;
	badRequest: MockApiResponse;
	unauthorized: MockApiResponse;
	serverError: MockApiResponse;
	getUserByUsername: {
		success: MockResponse;
		badRequest: MockResponse;
		unauthorized: MockResponse;
		serverError: MockResponse;
		notFound: MockResponse;
	};
}
