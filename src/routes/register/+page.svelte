<script lang="ts">
	import { authStore } from '$lib/stores/auth.svelte';
	import { goto } from '$app/navigation';

	let email = $state('');
	let password = $state('');
	let passwordConfirm = $state('');
	let error = $state('');
	let loading = $state(false);

	async function handleRegister() {
		if (!email || !password || !passwordConfirm) {
			error = 'Please fill in all fields';
			return;
		}

		if (password !== passwordConfirm) {
			error = 'Passwords do not match';
			return;
		}

		if (password.length < 8) {
			error = 'Password must be at least 8 characters';
			return;
		}

		loading = true;
		error = '';

		try {
			await authStore.register(email, password, passwordConfirm);
			// Force full page reload to ensure server picks up the cookie
			window.location.href = '/';
		} catch (err: any) {
			error = err.message || 'Failed to register';
			console.error('Registration error:', err);
			loading = false;
		}
	}
</script>

<div class="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
	<div class="w-full max-w-md">
		<div class="rounded-lg bg-white p-8 shadow-md">
			<h1 class="mb-6 text-center text-3xl font-bold">Register</h1>

			{#if error}
				<div class="mb-4 rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-800">
					{error}
				</div>
			{/if}

			<form onsubmit={(e) => { e.preventDefault(); handleRegister(); }} class="space-y-4">
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
						minlength="8"
						class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
						placeholder="••••••••"
					/>
					<p class="mt-1 text-xs text-gray-500">At least 8 characters</p>
				</div>

				<div>
					<label for="passwordConfirm" class="mb-1 block text-sm font-medium text-gray-700">
						Confirm Password
					</label>
					<input
						id="passwordConfirm"
						type="password"
						bind:value={passwordConfirm}
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
					{loading ? 'Creating account...' : 'Register'}
				</button>
			</form>

			<p class="mt-4 text-center text-sm text-gray-600">
				Already have an account?
				<a href="/login" class="font-medium text-blue-600 hover:text-blue-700">
					Login
				</a>
			</p>
		</div>
	</div>
</div>
