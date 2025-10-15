import PocketBase from 'pocketbase';
import type { Post } from '$lib/pocketbase';
import { POCKETBASE_URL } from '$env/static/private';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	try {
		const pb = new PocketBase(POCKETBASE_URL || 'http://pocketbase:8090');
		const posts = await pb.collection('posts').getList<Post>(1, 50, {
			sort: '-created'
		});

		return {
			posts: posts.items
		};
	} catch (err) {
		console.error('Error loading posts:', err);
		return {
			posts: [],
			error: 'Failed to load blog posts'
		};
	}
};
