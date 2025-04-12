import { writable } from 'svelte/store';

type MessageType = 'success' | 'error' | 'info';

interface Message {
	type: MessageType;
	text: string;
}

export const messageStore = writable<Message | null>(null);

export const showMessage = (type: MessageType, text: string) => {
	messageStore.set({ type, text });

	setTimeout(() => {
		messageStore.set(null);
	}, 5000);
};
