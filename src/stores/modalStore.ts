import { writable } from 'svelte/store';

export interface ModalState {
	component: any;
	props: Record<string, any>;
	isOpen: boolean;
}

export const modalStore = writable<ModalState>({
	component: null,
	props: {},
	isOpen: false
});

export const openModal = (component: any, props: Record<string, any> = {}) => {
	modalStore.set({ component, props, isOpen: true });
};

export const closeModal = () => {
	modalStore.set({ component: null, props: {}, isOpen: false });
};
