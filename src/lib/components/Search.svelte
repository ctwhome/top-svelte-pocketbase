<script lang="ts">
	import { pb, type Todo, type Post } from '$lib/pocketbase';
	import { debounce } from '$lib/utils/debounce';

	let searchQuery = $state('');
	let searching = $state(false);
	let todoResults = $state<Todo[]>([]);
	let postResults = $state<Post[]>([]);
	let showResults = $state(false);

	async function performSearch(query: string) {
		if (!query.trim()) {
			todoResults = [];
			postResults = [];
			showResults = false;
			return;
		}

		searching = true;
		showResults = true;

		try {
			// Search todos - search in name and Description fields
			const todosPromise = pb.collection('todos').getList<Todo>(1, 5, {
				filter: `name ~ "${query}" || Description ~ "${query}"`,
				sort: '-created'
			});

			// Search posts - search in title and content fields
			const postsPromise = pb.collection('posts').getList<Post>(1, 5, {
				filter: `title ~ "${query}" || content ~ "${query}"`,
				sort: '-created'
			});

			const [todos, posts] = await Promise.all([todosPromise, postsPromise]);

			todoResults = todos.items;
			postResults = posts.items;
		} catch (err) {
			console.error('Search error:', err);
		} finally {
			searching = false;
		}
	}

	// Debounce search to avoid too many API calls
	const debouncedSearch = debounce((query: string) => performSearch(query), 300);

	$effect(() => {
		debouncedSearch(searchQuery);
	});

	function handleClickOutside(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (!target.closest('.search-container')) {
			showResults = false;
		}
	}
</script>

<svelte:window onclick={handleClickOutside} />

<div class="search-container relative">
	<div class="relative">
		<input
			type="text"
			bind:value={searchQuery}
			placeholder="Search todos and posts..."
			class="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
			onfocus={() => {
				if (searchQuery.trim()) showResults = true;
			}}
		/>
		<svg
			class="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
			/>
		</svg>
	</div>

	{#if showResults && searchQuery.trim()}
		<div
			class="absolute z-50 mt-2 w-full rounded-lg border border-gray-200 bg-white shadow-lg max-h-96 overflow-y-auto"
		>
			{#if searching}
				<div class="p-4 text-center text-sm text-gray-600">Searching...</div>
			{:else if todoResults.length === 0 && postResults.length === 0}
				<div class="p-4 text-center text-sm text-gray-600">No results found</div>
			{:else}
				<!-- Todo Results -->
				{#if todoResults.length > 0}
					<div class="border-b border-gray-200 p-3">
						<h3 class="text-xs font-semibold uppercase text-gray-500">Todos</h3>
					</div>
					{#each todoResults as todo}
						<a
							href="/"
							class="block border-b border-gray-100 p-3 hover:bg-gray-50 transition"
							onclick={() => {
								showResults = false;
							}}
						>
							<div class="flex items-start gap-2">
								<svg
									class="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
									/>
								</svg>
								<div class="flex-1 min-w-0">
									<p class="text-sm font-medium text-gray-900 truncate">{todo.name}</p>
									{#if todo.Description}
										<p class="text-xs text-gray-600 truncate">{todo.Description}</p>
									{/if}
								</div>
							</div>
						</a>
					{/each}
				{/if}

				<!-- Post Results -->
				{#if postResults.length > 0}
					<div class="border-b border-gray-200 p-3">
						<h3 class="text-xs font-semibold uppercase text-gray-500">Blog Posts</h3>
					</div>
					{#each postResults as post}
						<a
							href="/blog/{post.id}"
							class="block border-b border-gray-100 p-3 hover:bg-gray-50 transition"
							onclick={() => {
								showResults = false;
							}}
						>
							<div class="flex items-start gap-2">
								<svg
									class="mt-0.5 h-4 w-4 flex-shrink-0 text-purple-600"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
									/>
								</svg>
								<div class="flex-1 min-w-0">
									<p class="text-sm font-medium text-gray-900 truncate">{post.title}</p>
									<p class="text-xs text-gray-600 truncate">
										{new Date(post.created).toLocaleDateString()}
									</p>
								</div>
							</div>
						</a>
					{/each}
				{/if}
			{/if}
		</div>
	{/if}
</div>
