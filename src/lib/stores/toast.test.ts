import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { get } from 'svelte/store';
import { toast } from './toast';

describe('toast store', () => {
	beforeEach(() => {
		vi.useFakeTimers();
		// Drain any toasts left over from a previous test so each test starts clean.
		for (const t of get(toast)) {
			toast.dismiss(t.id);
		}
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('starts with no toasts', () => {
		expect(get(toast)).toEqual([]);
	});

	it('adds a toast with the given message and defaults to type "success"', () => {
		toast.show('Booking confirmed');

		const toasts = get(toast);
		expect(toasts).toHaveLength(1);
		expect(toasts[0].message).toBe('Booking confirmed');
		expect(toasts[0].type).toBe('success');
	});

	it('adds a toast with an explicit type', () => {
		toast.show('Something went wrong', 'error');

		const toasts = get(toast);
		expect(toasts).toHaveLength(1);
		expect(toasts[0].type).toBe('error');
	});

	it('assigns increasing unique ids to each toast', () => {
		const firstId = toast.show('First');
		const secondId = toast.show('Second');

		expect(secondId).toBeGreaterThan(firstId);
		expect(get(toast).map((t) => t.id)).toEqual([firstId, secondId]);
	});

	it('supports multiple toasts stacking simultaneously', () => {
		toast.show('One');
		toast.show('Two');
		toast.show('Three');

		expect(get(toast)).toHaveLength(3);
	});

	it('dismiss removes only the toast with the matching id', () => {
		const firstId = toast.show('Keep me');
		const secondId = toast.show('Remove me');

		toast.dismiss(secondId);

		const toasts = get(toast);
		expect(toasts).toHaveLength(1);
		expect(toasts[0].id).toBe(firstId);
	});

	it('dismissing an id that does not exist is a no-op', () => {
		toast.show('Only toast');
		expect(get(toast)).toHaveLength(1);

		toast.dismiss(999999);

		expect(get(toast)).toHaveLength(1);
	});

	it('auto-dismisses a toast after the default duration (3500ms)', () => {
		toast.show('Auto dismiss me');
		expect(get(toast)).toHaveLength(1);

		vi.advanceTimersByTime(3499);
		expect(get(toast)).toHaveLength(1);

		vi.advanceTimersByTime(1);
		expect(get(toast)).toHaveLength(0);
	});

	it('auto-dismisses a toast after a custom duration', () => {
		toast.show('Custom duration', 'success', 1000);

		vi.advanceTimersByTime(999);
		expect(get(toast)).toHaveLength(1);

		vi.advanceTimersByTime(1);
		expect(get(toast)).toHaveLength(0);
	});

	it('does not affect other toasts when one auto-dismisses', () => {
		toast.show('Short lived', 'success', 500);
		const longLivedId = toast.show('Long lived', 'success', 5000);

		vi.advanceTimersByTime(500);

		const toasts = get(toast);
		expect(toasts).toHaveLength(1);
		expect(toasts[0].id).toBe(longLivedId);
	});
});
