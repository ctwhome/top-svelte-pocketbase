<script lang="ts">
	import { authStore } from '$lib/stores/auth.svelte';
	import { goto } from '$app/navigation';
	import Search from './Search.svelte';

	interface Props {
		title: string;
		user?: any;
		showBlogLink?: boolean;
		showSearch?: boolean;
	}

	let { title, user, showBlogLink = true, showSearch = true }: Props = $props();

	function handleLogout() {
		authStore.logout();
		goto('/login');
	}
</script>

<div class="mb-8">
	<div class="flex items-center justify-between mb-6">
		<h1 class="text-4xl font-bold">{title}</h1>
		<div class="flex items-center gap-4">
			{#if showBlogLink}
				<a
					href="/blog"
					class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
				>
					Blog
				</a>
			{/if}
			{#if user}
				<span class="text-sm text-gray-600">{user.email}</span>
			{/if}
			<button
				onclick={handleLogout}
				class="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
			>
				Logout
			</button>
		</div>
	</div>

	{#if showSearch}
		<div class="max-w-2xl">
			<Search />
		</div>
	{/if}
</div>
