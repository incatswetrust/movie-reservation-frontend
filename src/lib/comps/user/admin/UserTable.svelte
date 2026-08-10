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

	let isNewUserOpen = $state(false);
</script>

<section class="bg-primary">
	<div class="container mx-auto px-5 py-10">
		<div class="mb-2 flex flex-wrap items-start justify-between gap-4">
			<div>
				<h1 class="text-2xl font-semibold text-text sm:text-3xl">Users</h1>
				<div class="mt-2 h-1 w-16 rounded bg-accent"></div>
				<p class="mt-3 text-text/70">Manage registered accounts.</p>
			</div>
			{#if $auth.isAdmin}
				<button
					onclick={() => (isNewUserOpen = true)}
					class="rounded-full bg-accent px-5 py-2 text-sm font-medium text-primary transition-opacity hover:opacity-90"
				>
					+ Add user
				</button>
			{/if}
		</div>
		<div class="mb-8"></div>

		{#if $users.isLoading}
			<p class="text-text/60">Loading users...</p>
		{:else if $users.isError}
			<p class="text-red-400">Failed to load users.</p>
		{:else if $users.data && $users.data.length > 0}
			<div class="overflow-x-auto rounded-lg border border-accent/15 bg-surface">
				<table class="min-w-full text-left text-sm">
					<thead class="border-b border-accent/15 text-text/60">
						<tr>
							<th class="px-4 py-3 font-medium">Id</th>
							<th class="px-4 py-3 font-medium">Username</th>
							<th class="px-4 py-3 font-medium">Email</th>
							<th class="px-4 py-3 font-medium">Role</th>
							<th class="px-4 py-3"></th>
						</tr>
					</thead>
					<tbody class="divide-y divide-accent/10">
						{#each $users.data as user (user.id)}
							<tr class="text-text">
								<td class="px-4 py-3 text-text/70">{user.id}</td>
								<td class="px-4 py-3">{user.username}</td>
								<td class="px-4 py-3 text-text/70">{user.email ?? '—'}</td>
								<td class="px-4 py-3">
									<span class="rounded-full border border-accent/30 px-2 py-0.5 text-xs">
										{roleLabel(user.role)}
									</span>
								</td>
								<td class="px-4 py-3 text-right">
									{#if $auth.isAdmin}
										<button
											onclick={() => handleDelete(user)}
											class="rounded-full border border-red-500/40 px-3 py-1 text-xs text-red-400 transition-colors hover:bg-red-500/10"
										>
											Delete
										</button>
									{/if}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{:else}
			<p class="text-text/60">No users found.</p>
		{/if}
	</div>
</section>

{#if $auth.isAdmin}
	<NewUser bind:IsOpenned={isNewUserOpen} />
{/if}
