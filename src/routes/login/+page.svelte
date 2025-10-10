<script lang="ts">
	import { authStore } from '$lib/stores/auth.svelte';
	import { goto } from '$app/navigation';

	let email = $state('');
	let password = $state('');
	let error = $state('');
	let loading = $state(false);

	async function handleLogin() {
		if (!email || !password) {
			error = 'Please fill in all fields';
			return;
		}

		loading = true;
		error = '';

		try {
			await authStore.login(email, password);
			// Force full page reload to ensure server picks up the cookie
			window.location.href = '/';
		} catch (err: any) {
			error = err.message || 'Failed to login';
			console.error('Login error:', err);
			loading = false;
		}
	}
</script>

<div class="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
	<div class="w-full max-w-md">
		<div class="rounded-lg bg-white p-8 shadow-md">
			<h1 class="mb-6 text-center text-3xl font-bold">Login</h1>

			{#if error}
				<div class="mb-4 rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-800">
					{error}
				</div>
			{/if}

			<form onsubmit={(e) => { e.preventDefault(); handleLogin(); }} class="space-y-4">
				<div>
					<label for="email" class="mb-1 block text-sm font-medium text-gray-700">
						Email
					</label>
					<input
						id="email"
						type="email"
						bind:value={email}
						required
						class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
						placeholder="you@example.com"
					/>
				</div>

				<div>
					<label for="password" class="mb-1 block text-sm font-medium text-gray-700">
						Password
					</label>
					<input
						id="password"
						type="password"
						bind:value={password}
						required
						class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
						placeholder="••••••••"
					/>
				</div>

				<button
					type="submit"
					disabled={loading}
					class="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
				>
					{loading ? 'Logging in...' : 'Login'}
				</button>
			</form>

			<p class="mt-4 text-center text-sm text-gray-600">
				Don't have an account?
				<a href="/register" class="font-medium text-blue-600 hover:text-blue-700">
					Register
				</a>
			</p>
		</div>
	</div>
</div>
