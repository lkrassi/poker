import { writable } from 'svelte/store';

type NotificationType = 'success' | 'error' | 'info';

interface Notification {
	id: number;
	type: NotificationType;
	text: string;
}

export const notificationStore = writable<Notification[]>([]);

let nextId = 0;

export const showNotification = (type: NotificationType, text: string) => {
	const id = nextId++;
	notificationStore.update((notifications) => [...notifications, { id, type, text }]);

	setTimeout(() => {
		notificationStore.update((notifications) =>
			notifications.filter((notification) => notification.id !== id)
		);
	}, 5000);
};
