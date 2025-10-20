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

			<!-- Template Credentials Info -->
			<div class="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
				<div class="flex items-start">
					<div class="flex-shrink-0">
						<svg class="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
						</svg>
					</div>
					<div class="ml-3 flex-1">
						<h3 class="text-sm font-medium text-blue-800">Template Credentials</h3>
						<div class="mt-2 text-xs text-blue-700 space-y-1">
							<p><span class="font-semibold">User:</span> <span class="font-mono">user@ctwhome.com</span> / <span class="font-mono">password</span></p>
							<p class="pt-2 border-t border-blue-300"><span class="font-semibold">PocketBase Admin:</span></p>
							<p class="font-mono">admin@admin.com / adminadmin</p>
							<a href="http://localhost:8090/_/" target="_blank" class="inline-block mt-1 text-blue-600 hover:text-blue-800 underline">→ Admin Panel</a>
						</div>
					</div>
				</div>
			</div>

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
