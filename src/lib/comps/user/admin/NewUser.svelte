<script lang="ts">
	import { createMutation, useQueryClient } from '@tanstack/svelte-query';
	import { AxiosError } from 'axios';
	import type { UserCreateDto, UserReadDto } from '../../../../Api';
	import { UserRole } from '../../../../Api';
	import { api } from '../../../../Module';
	import { toast } from '$lib/stores/toast';
	import { validateUsername, validatePassword } from '$lib/tools/validators';

	let { IsOpenned = $bindable(false) }: { IsOpenned?: boolean } = $props();

	function emptyForm(): UserCreateDto {
		return { username: '', password: '', email: '', role: UserRole.Value2 };
	}

	let form = $state<UserCreateDto>(emptyForm());
	let usernameError = $state('');
	let passwordError = $state('');

	$effect(() => {
		if (IsOpenned) {
			form = emptyForm();
			usernameError = '';
			passwordError = '';
		}
	});

	const client = useQueryClient();

	const addUserMutation = createMutation({
		mutationFn: async () => {
			const response = await api.users.usersCreate({ ...form, email: form.email || null });
			return response.data as UserReadDto;
		},
		onSuccess: async () => {
			await client.invalidateQueries({ queryKey: ['users'] });
			toast.show('User added', 'success');
			IsOpenned = false;
		},
		onError: (error) => {
			const message =
				error instanceof AxiosError && typeof error.response?.data?.error === 'string'
					? error.response.data.error
					: 'Failed to add user';
			toast.show(message, 'error');
		}
	});

	function validate(): boolean {
		usernameError = validateUsername(form.username);
		passwordError = validatePassword(form.password);
		return !usernameError && !passwordError;
	}

	function submit() {
		if (!validate()) return;
		$addUserMutation.mutate();
	}

	function close() {
		IsOpenned = false;
	}
</script>

{#if IsOpenned}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
		<div class="w-full max-w-md rounded-md border border-accent/20 bg-surface p-6">
			<h2 class="mb-4 text-xl font-bold text-text">New user</h2>

			<label for="user-username" class="mb-1 block text-sm text-text/70">Username</label>
			<input
				bind:value={form.username}
				id="user-username"
				type="text"
				class="mb-1 w-full rounded border border-accent/30 bg-transparent px-3 py-2 text-text placeholder-text/40 transition-colors focus:border-accent focus:outline-none"
			/>
			{#if usernameError}<p class="mb-3 text-xs text-red-500">{usernameError}</p>{:else}<div class="mb-3"></div>{/if}

			<label for="user-password" class="mb-1 block text-sm text-text/70">Password</label>
			<input
				bind:value={form.password}
				id="user-password"
				type="password"
				class="mb-1 w-full rounded border border-accent/30 bg-transparent px-3 py-2 text-text placeholder-text/40 transition-colors focus:border-accent focus:outline-none"
			/>
			{#if passwordError}<p class="mb-3 text-xs text-red-500">{passwordError}</p>{:else}<div class="mb-3"></div>{/if}

			<label for="user-email" class="mb-1 block text-sm text-text/70">Email (optional)</label>
			<input
				bind:value={form.email}
				id="user-email"
				type="email"
				class="mb-3 w-full rounded border border-accent/30 bg-transparent px-3 py-2 text-text placeholder-text/40 transition-colors focus:border-accent focus:outline-none"
			/>

			<label for="user-role" class="mb-1 block text-sm text-text/70">Role</label>
			<select
				bind:value={form.role}
				id="user-role"
				class="w-full rounded border border-accent/30 bg-surface px-3 py-2 text-text transition-colors focus:border-accent focus:outline-none"
			>
				<option value={UserRole.Value2}>Viewer (read-only admin panel)</option>
				<option value={UserRole.Value0}>User</option>
				<option value={UserRole.Value1}>Admin</option>
			</select>

			<div class="mt-6 flex justify-end space-x-3">
				<button
					onclick={submit}
					disabled={$addUserMutation.isPending}
					class="rounded bg-accent px-4 py-2 font-bold text-primary transition-opacity hover:opacity-90 disabled:opacity-50"
				>
					Add
				</button>
				<button
					onclick={close}
					class="rounded border border-accent/40 px-4 py-2 text-text transition-colors hover:bg-accent/10"
				>
					Cancel
				</button>
			</div>
		</div>
	</div>
{/if}
