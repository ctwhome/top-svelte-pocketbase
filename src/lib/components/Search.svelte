<script lang="ts">
	import { pb, type Todo, type Post } from '$lib/database';
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
	<label class="input input-bordered flex items-center gap-2">
		<svg
			class="h-5 w-5 opacity-70"
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
		<input
			type="text"
			bind:value={searchQuery}
			placeholder="Search todos and posts..."
			class="grow"
			onfocus={() => {
				if (searchQuery.trim()) showResults = true;
			}}
		/>
	</label>

	{#if showResults && searchQuery.trim()}
		<div class="card card-compact absolute z-50 mt-2 w-full bg-base-100 shadow-xl max-h-96 overflow-y-auto">
			<div class="card-body p-0">
				{#if searching}
					<div class="p-4 text-center text-sm opacity-70">
						<span class="loading loading-spinner loading-sm"></span>
						<span class="ml-2">Searching...</span>
					</div>
				{:else if todoResults.length === 0 && postResults.length === 0}
					<div class="p-4 text-center text-sm opacity-70">No results found</div>
				{:else}
					<ul class="menu menu-sm">
						<!-- Todo Results -->
						{#if todoResults.length > 0}
							<li class="menu-title">
								<span>Todos</span>
							</li>
							{#each todoResults as todo}
								<li>
									<a
										href="/"
										onclick={() => {
											showResults = false;
										}}
									>
										<svg
											class="h-4 w-4 text-primary"
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
											<div class="font-medium truncate">{todo.name}</div>
											{#if todo.Description}
												<div class="text-xs opacity-70 truncate">{todo.Description}</div>
											{/if}
										</div>
									</a>
								</li>
							{/each}
						{/if}

						<!-- Post Results -->
						{#if postResults.length > 0}
							<li class="menu-title">
								<span>Blog Posts</span>
							</li>
							{#each postResults as post}
								<li>
									<a
										href="/blog/{post.id}"
										onclick={() => {
											showResults = false;
										}}
									>
										<svg
											class="h-4 w-4 text-secondary"
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
											<div class="font-medium truncate">{post.title}</div>
											<div class="text-xs opacity-70 truncate">
												{new Date(post.created).toLocaleDateString()}
											</div>
										</div>
									</a>
								</li>
							{/each}
						{/if}
					</ul>
				{/if}
			</div>
		</div>
	{/if}
</div>
