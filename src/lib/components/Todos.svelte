<script lang="ts">
	import { pb, type Todo } from '$lib/pocketbase';
	import { onMount, onDestroy } from 'svelte';

	interface Props {
		initialTodos?: Todo[];
		userId?: string;
		error?: string | null;
	}

	let { initialTodos = [], userId, error: initialError = null }: Props = $props();

	let todos = $state(initialTodos || []);
	let error = $state(initialError);
	let newTodoName = $state('');
	let newTodoDescription = $state('');
	let creating = $state(false);

	// Real-time subscriptions
	onMount(() => {
		// Subscribe to todos collection changes
		pb.collection('todos').subscribe('*', (e) => {
			if (e.action === 'create') {
				// Add new todo to the list
				todos = [e.record as Todo, ...todos];
			} else if (e.action === 'update') {
				// Update existing todo
				todos = todos.map((t) => (t.id === e.record.id ? (e.record as Todo) : t));
			} else if (e.action === 'delete') {
				// Remove deleted todo
				todos = todos.filter((t) => t.id !== e.record.id);
			}
		});
	});

	onDestroy(() => {
		// Unsubscribe when component is destroyed
		pb.collection('todos').unsubscribe('*');
	});

	async function createTodo() {
		if (!newTodoName.trim()) return;

		creating = true;
		try {
			await pb.collection('todos').create<Todo>({
				name: newTodoName,
				Description: newTodoDescription || '',
				completed: false,
				user: userId
			});

			// Real-time subscription will handle adding to the list

			// Reset form
			newTodoName = '';
			newTodoDescription = '';
		} catch (err) {
			console.error('Error creating todo:', err);
			alert('Failed to create todo');
		} finally {
			creating = false;
		}
	}

	async function toggleTodo(todo: Todo) {
		try {
			await pb.collection('todos').update<Todo>(todo.id, {
				completed: !todo.completed
			});

			// Real-time subscription will handle updating the list
		} catch (err) {
			console.error('Error updating todo:', err);
		}
	}
</script>

<!-- Create Todo Form -->
<div class="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
	<h2 class="mb-4 text-xl font-semibold">Create New Todo</h2>
	<form onsubmit={(e) => { e.preventDefault(); createTodo(); }} class="space-y-4">
		<div>
			<label for="name" class="mb-1 block text-sm font-medium text-gray-700">
				Task Name
			</label>
			<input
				id="name"
				type="text"
				bind:value={newTodoName}
				required
				placeholder="What needs to be done?"
				class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
			/>
		</div>

		<div>
			<label for="description" class="mb-1 block text-sm font-medium text-gray-700">
				Description (optional)
			</label>
			<textarea
				id="description"
				bind:value={newTodoDescription}
				rows="3"
				placeholder="Add more details..."
				class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
			></textarea>
		</div>

		<button
			type="submit"
			disabled={creating || !newTodoName.trim()}
			class="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
		>
			{creating ? 'Creating...' : 'Add Todo'}
		</button>
	</form>
</div>

{#if error}
	<div class="rounded-lg border border-red-300 bg-red-50 p-4 text-red-800">
		<p class="font-semibold">Error:</p>
		<p>{error}</p>
		<p class="mt-2 text-sm">
			Check the PocketBase API Rules for the 'todos' collection.
		</p>
	</div>
{:else if todos.length === 0}
	<div class="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
		<p class="text-gray-600">No todos yet. Create one above!</p>
	</div>
{:else}
	<div class="space-y-3">
		{#each todos as todo (todo.id)}
			<div class="flex items-start gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md">
				<input
					type="checkbox"
					checked={todo.completed}
					onchange={() => toggleTodo(todo)}
					class="mt-1 h-5 w-5 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
				/>
				<div class="flex-1">
					<h3
						class="text-lg font-medium"
						class:line-through={todo.completed}
						class:text-gray-400={todo.completed}
					>
						{todo.name}
					</h3>
					{#if todo.Description}
						<div
							class="prose prose-sm mt-2 max-w-none text-gray-600"
							class:text-gray-400={todo.completed}
						>
							{@html todo.Description}
						</div>
					{/if}
					<div class="mt-2 text-sm text-gray-500">
						Created: {new Date(todo.created).toLocaleDateString()}
					</div>
				</div>
			</div>
		{/each}
	</div>
{/if}
