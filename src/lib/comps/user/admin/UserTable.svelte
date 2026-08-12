<script lang="ts">
	import { createMutation, createQuery, useQueryClient } from '@tanstack/svelte-query';
	import { api } from '../../../../Module';
	import { type UserReadDto, UserRole } from '../../../../Api';
	import { auth } from '$lib/stores/auth';
	import { toast } from '$lib/stores/toast';
	import NewUser from './NewUser.svelte';

	const client = useQueryClient();

	const users = createQuery<UserReadDto[]>({
		queryKey: ['users'],
		queryFn: async () => {
			const response = await api.users.usersList();
			return response.data;
		}
	});

	const deleteMutation = createMutation({
		mutationFn: async (id: number) => {
			await api.users.usersDelete(id);
		},
		onSuccess: () => {
			void client.invalidateQueries({ queryKey: ['users'] });
			toast.show('User deleted', 'success');
		},
		onError: () => {
			toast.show('Failed to delete user', 'error');
		}
	});

	function handleDelete(user: UserReadDto) {
		if (user.id === undefined) return;
		if (confirm(`Delete user "${user.username}"? This cannot be undone.`)) {
			$deleteMutation.mutate(user.id);
		}
	}

	function roleLabel(role: UserRole | undefined) {
		if (role === UserRole.Value1) return 'Admin';
		if (role === UserRole.Value2) return 'Viewer';
		return 'User';
	}

	function isFeaturedRole(role: UserRole | undefined) {
		return role === UserRole.Value1;
	}

	let isNewUserOpen = $state(false);
</script>

<section class="bg-app">
	<div class="container mx-auto px-5 py-10">
		<div class="mb-8 flex flex-wrap items-start justify-between gap-4">
			<div>
				<h1 class="text-2xl font-bold text-ink sm:text-3xl">Users</h1>
				<div class="mt-2 h-1 w-16 rounded-full bg-brand-gold"></div>
				<p class="mt-3 text-ink-secondary">Manage registered accounts.</p>
			</div>
			{#if $auth.isAdmin}
				<button onclick={() => (isNewUserOpen = true)} class="btn-primary">+ Add user</button>
			{/if}
		</div>

		{#if $users.isLoading}
			<p class="text-ink-muted">Loading users...</p>
		{:else if $users.isError}
			<p class="text-brand-red">Failed to load users.</p>
		{:else if $users.data && $users.data.length > 0}
			<div class="card overflow-x-auto">
				<table class="min-w-full text-left text-sm">
					<thead class="bg-surface-secondary text-ink-secondary">
						<tr>
							<th class="px-4 py-3 font-semibold">Id</th>
							<th class="px-4 py-3 font-semibold">Username</th>
							<th class="px-4 py-3 font-semibold">Email</th>
							<th class="px-4 py-3 font-semibold">Role</th>
							<th class="px-4 py-3"></th>
						</tr>
					</thead>
					<tbody class="divide-y divide-subtle">
						{#each $users.data as user (user.id)}
							<tr class="text-ink transition-colors duration-fast hover:bg-surface-secondary">
								<td class="px-4 py-3 text-ink-muted">{user.id}</td>
								<td class="px-4 py-3 font-medium">{user.username}</td>
								<td class="px-4 py-3 text-ink-secondary">{user.email ?? '—'}</td>
								<td class="px-4 py-3">
									<span class={isFeaturedRole(user.role) ? 'chip chip-selected' : 'chip'}>
										{roleLabel(user.role)}
									</span>
								</td>
								<td class="px-4 py-3 text-right">
									{#if $auth.isAdmin}
										<button
											onclick={() => handleDelete(user)}
											aria-label={`Delete ${user.username}`}
											title="Delete user"
											class="icon-button h-9 w-9 rounded-sm text-brand-red hover:border-brand-red"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												stroke-width="1.75"
												stroke-linecap="round"
												stroke-linejoin="round"
												class="h-4 w-4"
											>
												<path d="M3 6h18" />
												<path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
												<path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
												<path d="M10 11v6" />
												<path d="M14 11v6" />
											</svg>
										</button>
									{/if}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{:else}
			<p class="text-ink-muted">No users found.</p>
		{/if}
	</div>
</section>

{#if $auth.isAdmin}
	<NewUser bind:IsOpenned={isNewUserOpen} />
{/if}
