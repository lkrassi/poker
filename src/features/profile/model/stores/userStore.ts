import { writable } from 'svelte/store';

interface User {
	id: string;
	email: string;
	username: string;
	profile_picture_url: string;
	balance: number;
}

interface UserStore {
	user: User | null;
	error: string | null;
}

const isBrowser = typeof window !== 'undefined';

const initialState: UserStore = {
	user: isBrowser ? JSON.parse(localStorage.getItem('user') || 'null') : null,
	error: null
};

export const userStore = writable<UserStore>(initialState);

export const setUser = (user: User) => {
	if (isBrowser) {
		localStorage.setItem('user', JSON.stringify(user));
	}
	userStore.update((state) => ({ ...state, user, error: null }));
};

export const clearUser = () => {
	if (isBrowser) {
		localStorage.removeItem('user');
	}
	userStore.update((state) => ({ ...state, user: null, error: null }));
};
