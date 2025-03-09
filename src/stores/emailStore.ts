import { writable } from 'svelte/store';

export const emailStore = writable<string>('');
