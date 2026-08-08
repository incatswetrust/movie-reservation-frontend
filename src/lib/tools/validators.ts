export function validateRequired(value: string, fieldName: string): string {
	if (!value || value.trim() === '') {
		return `${fieldName} is required`;
	}
	return '';
}

export function validateUsername(username: string): string {
	if (!username || username.trim() === '') {
		return 'Username is required';
	}
	if (username.length < 3) {
		return 'Username must be at least 3 characters';
	}
	return '';
}

export function validatePassword(password: string): string {
	if (!password) {
		return 'Password is required';
	}
	if (password.length < 8) {
		return 'Password must be at least 8 characters';
	}
	return '';
}

export function validatePasswordConfirmation(password: string, confirmation: string): string {
	if (!confirmation) {
		return 'Please confirm your password';
	}
	if (password !== confirmation) {
		return 'Passwords do not match';
	}
	return '';
}
