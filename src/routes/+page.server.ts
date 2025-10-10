import PocketBase from 'pocketbase';
import { POCKETBASE_URL } from '$env/static/private';
import type { Todo } from '$lib/pocketbase';
import { redirect } from '@sveltejs/kit';

export async function load({ cookies }) {
	// Check if user is authenticated
	const authCookie = cookies.get('pb_auth');

	if (!authCookie) {
		throw redirect(303, '/login');
	}

	// Use server-side PocketBase URL (internal Docker network)
	const pb = new PocketBase(POCKETBASE_URL || 'http://pocketbase:8090');

	// Restore auth from cookie (need to format as full cookie string)
	pb.authStore.loadFromCookie(`pb_auth=${authCookie}`);

	try {
		const todos = await pb.collection('todos').getFullList<Todo>({
			sort: '-created'
		});

		return {
			todos,
			user: pb.authStore.model
		};
	} catch (err) {
		console.error('Error fetching todos:', err);
		return {
			todos: [],
			error: err instanceof Error ? err.message : 'Failed to fetch todos',
			user: pb.authStore.model
		};
	}
}
