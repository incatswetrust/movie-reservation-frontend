import { writable } from 'svelte/store';

export type ToastType = 'success' | 'error';

export interface ToastMessage {
	id: number;
	message: string;
	type: ToastType;
}

let nextId = 0;

function createToastStore() {
	const { subscribe, update } = writable<ToastMessage[]>([]);

	function dismiss(id: number) {
		update((toasts) => toasts.filter((toast) => toast.id !== id));
	}

	function show(message: string, type: ToastType = 'success', duration = 3500) {
		const id = ++nextId;
		update((toasts) => [...toasts, { id, message, type }]);
		setTimeout(() => dismiss(id), duration);
		return id;
	}

	return { subscribe, show, dismiss };
}

export const toast = createToastStore();
