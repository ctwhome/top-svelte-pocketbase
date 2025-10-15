<script lang="ts">
	import type { Post } from '$lib/pocketbase';

	interface Props {
		data: {
			posts: Post[];
			error?: string;
		};
	}

	let { data }: Props = $props();
</script>

<div class="container mx-auto max-w-4xl px-4 py-8">
	<div class="mb-8">
		<h1 class="text-4xl font-bold">Blog</h1>
		<p class="mt-2 text-gray-600">Read our latest posts</p>
	</div>

	{#if data.error}
		<div class="rounded-lg border border-red-300 bg-red-50 p-4 text-red-800">
			<p class="font-semibold">Error:</p>
			<p>{data.error}</p>
		</div>
	{:else if data.posts.length === 0}
		<div class="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
			<p class="text-gray-600">No blog posts yet.</p>
		</div>
	{:else}
		<div class="space-y-6">
			{#each data.posts as post (post.id)}
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

	<div class="mt-8">
		<a
			href="/"
			class="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
		>
			← Back to todos
		</a>
	</div>
</div>
