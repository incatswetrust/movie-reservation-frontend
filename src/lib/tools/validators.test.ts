import { describe, it, expect } from 'vitest';
import {
	validateRequired,
	validateUsername,
	validatePassword,
	validatePasswordConfirmation,
	validateRange
} from './validators';

describe('validateRequired', () => {
	it('returns an error when the value is an empty string', () => {
		expect(validateRequired('', 'Title')).toBe('Title is required');
	});

	it('returns an error when the value is only whitespace', () => {
		expect(validateRequired('   ', 'Title')).toBe('Title is required');
	});

	it('returns an empty string when the value is present', () => {
		expect(validateRequired('Inception', 'Title')).toBe('');
	});

	it('includes the provided field name in the error message', () => {
		expect(validateRequired('', 'Email')).toBe('Email is required');
	});
});

describe('validateUsername', () => {
	it('returns an error when the username is empty', () => {
		expect(validateUsername('')).toBe('Username is required');
	});

	it('returns an error when the username is only whitespace', () => {
		expect(validateUsername('   ')).toBe('Username is required');
	});

	it('returns a length error when the username is shorter than 3 characters', () => {
		expect(validateUsername('ab')).toBe('Username must be at least 3 characters');
	});

	it('accepts a username exactly 3 characters long (boundary)', () => {
		expect(validateUsername('abc')).toBe('');
	});

	it('accepts a longer valid username', () => {
		expect(validateUsername('moviefan99')).toBe('');
	});
});

describe('validatePassword', () => {
	it('returns an error when the password is empty', () => {
		expect(validatePassword('')).toBe('Password is required');
	});

	it('returns a length error when the password is shorter than 8 characters', () => {
		expect(validatePassword('short7c')).toBe('Password must be at least 8 characters');
	});

	it('accepts a password exactly 8 characters long (boundary)', () => {
		expect(validatePassword('exactly8')).toBe('');
	});

	it('accepts a longer valid password', () => {
		expect(validatePassword('averylongandsecurepassword')).toBe('');
	});
});

describe('validatePasswordConfirmation', () => {
	it('returns an error when confirmation is empty', () => {
		expect(validatePasswordConfirmation('password123', '')).toBe('Please confirm your password');
	});

	it('returns an error when passwords do not match', () => {
		expect(validatePasswordConfirmation('password123', 'password124')).toBe(
			'Passwords do not match'
		);
	});

	it('returns an empty string when passwords match', () => {
		expect(validatePasswordConfirmation('password123', 'password123')).toBe('');
	});

	it('is case sensitive when comparing passwords', () => {
		expect(validatePasswordConfirmation('Password123', 'password123')).toBe(
			'Passwords do not match'
		);
	});
});

describe('validateRange', () => {
	it('returns an error when the value is undefined', () => {
		expect(validateRange(undefined, 1, 10, 'Seats')).toBe('Seats is required');
	});

	it('returns an error when the value is null', () => {
		expect(validateRange(null, 1, 10, 'Seats')).toBe('Seats is required');
	});

	it('returns an error when the value is NaN', () => {
		expect(validateRange(NaN, 1, 10, 'Seats')).toBe('Seats is required');
	});

	it('returns a range error when the value is below the minimum', () => {
		expect(validateRange(0, 1, 10, 'Seats')).toBe('Seats must be between 1 and 10');
	});

	it('returns a range error when the value is above the maximum', () => {
		expect(validateRange(11, 1, 10, 'Seats')).toBe('Seats must be between 1 and 10');
	});

	it('accepts a value exactly at the minimum boundary', () => {
		expect(validateRange(1, 1, 10, 'Seats')).toBe('');
	});

	it('accepts a value exactly at the maximum boundary', () => {
		expect(validateRange(10, 1, 10, 'Seats')).toBe('');
	});

	it('accepts a value within range', () => {
		expect(validateRange(5, 1, 10, 'Seats')).toBe('');
	});

	it('accepts a value of 0 when 0 is within the allowed range', () => {
		expect(validateRange(0, 0, 10, 'Seats')).toBe('');
	});
});
