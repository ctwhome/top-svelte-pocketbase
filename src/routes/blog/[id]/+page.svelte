<script lang="ts">
	import type { Post } from '$lib/pocketbase';

	interface Props {
		data: {
			post: Post;
		};
	}

	let { data }: Props = $props();
</script>

<div class="container mx-auto max-w-4xl px-4 py-8">
	<article class="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
		<header class="mb-8">
			<h1 class="text-4xl font-bold text-gray-900">
				{data.post.title}
			</h1>
			<div class="mt-4 flex items-center gap-4 text-sm text-gray-600">
				<time datetime={data.post.created}>
					Published: {new Date(data.post.created).toLocaleDateString('en-US', {
						year: 'numeric',
						month: 'long',
						day: 'numeric'
					})}
				</time>
				{#if data.post.updated !== data.post.created}
					<span>•</span>
					<time datetime={data.post.updated}>
						Updated: {new Date(data.post.updated).toLocaleDateString('en-US', {
							year: 'numeric',
							month: 'long',
							day: 'numeric'
						})}
					</time>
				{/if}
			</div>
		</header>

		<div class="prose prose-lg max-w-none">
			{@html data.post.content}
		</div>
	</article>

	<div class="mt-8 flex items-center justify-between">
		<a
			href="/blog"
			class="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
		>
			← Back to blog
		</a>
		<a
			href="/"
			class="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
		>
			Home
		</a>
	</div>
</div>
