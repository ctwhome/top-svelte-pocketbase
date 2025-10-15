import PocketBase from 'pocketbase';
import type { Post } from '$lib/pocketbase';
import { POCKETBASE_URL } from '$env/static/private';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	try {
		const pb = new PocketBase(POCKETBASE_URL || 'http://pocketbase:8090');
		const post = await pb.collection('posts').getOne<Post>(params.id);

		return {
			post
		};
	} catch (err) {
		console.error('Error loading post:', err);
		throw error(404, 'Blog post not found');
	}
};
