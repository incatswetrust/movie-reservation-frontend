import { describe, it, expect, beforeAll, vi } from 'vitest';
import { FormatParser } from './FormatParser';

// formatDateTime uses toLocaleString, which is timezone-sensitive. Pin the
// timezone so the expected output is deterministic regardless of which TZ
// CI (or a developer's machine) happens to run in.
beforeAll(() => {
	vi.stubEnv('TZ', 'UTC');
});

describe('FormatParser.formatDateTime', () => {
	it('returns an empty string for undefined', () => {
		expect(FormatParser.formatDateTime(undefined)).toBe('');
	});

	it('returns an empty string for null', () => {
		expect(FormatParser.formatDateTime(null)).toBe('');
	});

	it('formats a UTC ISO date string as "Mon D, YYYY, HH:mm" in 24h time', () => {
		expect(FormatParser.formatDateTime('2024-01-15T14:30:00Z')).toBe('Jan 15, 2024, 14:30');
	});

	it('zero-pads single-digit hours and minutes', () => {
		expect(FormatParser.formatDateTime('2024-01-01T00:05:00Z')).toBe('Jan 1, 2024, 00:05');
	});

	it('formats end-of-year dates correctly', () => {
		expect(FormatParser.formatDateTime('2024-12-31T23:59:00Z')).toBe('Dec 31, 2024, 23:59');
	});

	it('returns "Invalid Date" for an unparsable string', () => {
		expect(FormatParser.formatDateTime('not-a-date')).toBe('Invalid Date');
	});
});

describe('FormatParser.formatMinutesToHours', () => {
	it('returns an empty string for undefined', () => {
		expect(FormatParser.formatMinutesToHours(undefined)).toBe('');
	});

	it('formats minutes under an hour as "Xm"', () => {
		expect(FormatParser.formatMinutesToHours(45)).toBe('45m');
	});

	it('formats zero minutes as "0m"', () => {
		expect(FormatParser.formatMinutesToHours(0)).toBe('0m');
	});

	it('formats exactly 60 minutes as "1h 0m" (boundary)', () => {
		expect(FormatParser.formatMinutesToHours(60)).toBe('1h 0m');
	});

	it('formats 59 minutes as "59m" (boundary below the hour cutoff)', () => {
		expect(FormatParser.formatMinutesToHours(59)).toBe('59m');
	});

	it('formats minutes over an hour as "Xh Ym"', () => {
		expect(FormatParser.formatMinutesToHours(135)).toBe('2h 15m');
	});

	it('formats large runtimes correctly', () => {
		expect(FormatParser.formatMinutesToHours(181)).toBe('3h 1m');
	});
});

describe('FormatParser.shortNameFormat', () => {
	it('returns "undefined" for an undefined input (documents current behavior)', () => {
		expect(FormatParser.shortNameFormat(undefined)).toBe('undefined');
	});

	it('returns "undefined" for a null input (documents current behavior)', () => {
		expect(FormatParser.shortNameFormat(null)).toBe('undefined');
	});

	it('returns an empty string unchanged', () => {
		expect(FormatParser.shortNameFormat('')).toBe('');
	});

	it('leaves short strings untouched', () => {
		expect(FormatParser.shortNameFormat('Inception')).toBe('Inception');
	});

	it('leaves a 19-character string untouched (just below the truncation boundary)', () => {
		const input = 'a'.repeat(19);
		expect(FormatParser.shortNameFormat(input)).toBe(input);
	});

	it('truncates and appends "..." at exactly 20 characters (boundary)', () => {
		const input = 'a'.repeat(20);
		expect(FormatParser.shortNameFormat(input)).toBe('a'.repeat(20) + '...');
	});

	it('truncates longer strings to 20 characters plus "..."', () => {
		const input = 'A very long movie title that goes on and on';
		expect(FormatParser.shortNameFormat(input)).toBe(input.slice(0, 20) + '...');
	});
});
