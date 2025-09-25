<script lang="ts">
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import ErrorMessage from '$lib/components/UI/ErrorMessage.svelte'

	import LoadingSpinner from '$lib/components/UI/LoadingSpinner.svelte'
	import { authStore } from '../store/authStore.svelte'

	// Reactive variables using $derived with getters
	let isLoading = $derived(authStore.getIsLoading())
	let error = $derived(authStore.getError())
	let isAuthenticated = $derived(authStore.isAuthenticated)

	// Form state
	let email = $state('')
	let password = $state('')
	let formErrors = $state<Record<string, string>>({})

	// Form validation
	function validateForm() {
		const errors: Record<string, string> = {}

		if (!email.trim()) {
			errors.email = 'Email is required'
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			errors.email = 'Please enter a valid email address'
		}

		if (!password.trim()) {
			errors.password = 'Password is required'
		} else if (password.length < 6) {
			errors.password = 'Password must be at least 6 characters'
		}

		formErrors = errors
		return Object.keys(errors).length === 0
	}

	// Handle form submission
	async function handleSubmit(event: Event) {
		event.preventDefault()
		authStore.clearError()

		if (!validateForm()) return

		await authStore.login({ email, password })

		// Redirect after successful login
		if (isAuthenticated) {
			const redirectTo = $page.url.searchParams.get('redirect') || '/accruals'
			goto(redirectTo)
		}
	}

	// Handle Enter key press
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			handleSubmit(event)
		}
	}
</script>

<div class="mx-auto w-full max-w-md">
	<div class="rounded-lg bg-white p-8 shadow-md">
		<div class="mb-8 text-center">
			<h1 class="mb-2 text-2xl font-bold text-gray-900">Welcome Back</h1>
			<p class="text-gray-600">Sign in to your account</p>
		</div>

		{#if error}
			<ErrorMessage message={error} title="Login Error" />
		{/if}

		<form onsubmit={handleSubmit} class="space-y-6">
			<div>
				<label for="email" class="mb-2 block text-sm font-medium text-gray-700">
					Email Address
				</label>
				<input
					id="email"
					type="email"
					bind:value={email}
					onkeydown={handleKeydown}
					class="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 {formErrors.email
						? 'border-red-500'
						: ''}"
					placeholder="Enter your email"
					disabled={isLoading}
				/>
				{#if formErrors.email}
					<p class="mt-1 text-sm text-red-600">{formErrors.email}</p>
				{/if}
			</div>

			<div>
				<label for="password" class="mb-2 block text-sm font-medium text-gray-700">
					Password
				</label>
				<input
					id="password"
					type="password"
					bind:value={password}
					onkeydown={handleKeydown}
					class="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 {formErrors.password
						? 'border-red-500'
						: ''}"
					placeholder="Enter your password"
					disabled={isLoading}
				/>
				{#if formErrors.password}
					<p class="mt-1 text-sm text-red-600">{formErrors.password}</p>
				{/if}
			</div>

			<button
				type="submit"
				disabled={isLoading}
				class="flex w-full items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
			>
				{#if isLoading}
					<LoadingSpinner size="sm" />
					<span class="ml-2">Signing in...</span>
				{:else}
					Sign In
				{/if}
			</button>
		</form>

		<div class="mt-6 text-center">
			<p class="text-sm text-gray-600">
				Don't have an account?
				<span class="font-medium text-blue-600"> Contact administrator </span>
			</p>
		</div>
	</div>
</div>
