<script lang="ts">
	import { pb, type Post } from '$lib/database';
	import { onMount } from 'svelte';
	import Search from '$lib/components/Search.svelte';

	let posts = $state<Post[]>([]);
	let error = $state<string | null>(null);
	let loading = $state(true);

	onMount(async () => {
		try {
			const result = await pb.collection('posts').getList<Post>(1, 50, {
				sort: '-created'
			});
			posts = result.items;
		} catch (err) {
			console.error('Error loading posts:', err);
			error = 'Failed to load blog posts';
		} finally {
			loading = false;
		}
	});
</script>

<div class="container mx-auto max-w-4xl px-4 py-8">
	<div class="mb-8">
		<div class="flex items-center justify-between mb-6">
			<div>
				<h1 class="text-4xl font-bold">Blog</h1>
				<p class="mt-2 text-gray-600">Read our latest posts</p>
			</div>
			<a
				href="/"
				class="rounded-lg bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
			>
				← Todos
			</a>
		</div>
		<div class="max-w-2xl">
			<Search />
		</div>
	</div>

	{#if loading}
		<div class="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
			<p class="text-gray-600">Loading posts...</p>
		</div>
	{:else if error}
		<div class="rounded-lg border border-red-300 bg-red-50 p-4 text-red-800">
			<p class="font-semibold">Error:</p>
			<p>{error}</p>
		</div>
	{:else if posts.length === 0}
		<div class="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
			<p class="text-gray-600">No blog posts yet.</p>
		</div>
	{:else}
		<div class="space-y-6">
			{#each posts as post (post.id)}
				<article class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md">
					<a href="/blog/{post.id}" class="block">
						<h2 class="text-2xl font-semibold text-gray-900 hover:text-blue-600 transition">
							{post.title}
						</h2>
						<div class="mt-2 text-sm text-gray-500">
							{new Date(post.created).toLocaleDateString('en-US', {
								year: 'numeric',
								month: 'long',
								day: 'numeric'
							})}
						</div>
						<div class="prose prose-sm mt-4 max-w-none text-gray-700 line-clamp-3">
							{@html post.content}
						</div>
						<div class="mt-4 text-blue-600 font-medium hover:text-blue-700">
							Read more →
						</div>
					</a>
				</article>
			{/each}
		</div>
	{/if}
</div>
