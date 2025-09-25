<script lang="ts">
	import { goto } from '$app/navigation'
	import { page } from '$app/state'
	import { ErrorMessage, LoadingSpinner, Logo } from '$lib/components/UI'
	import { authStore } from '../store/authStore.svelte'

	let isLoading = $derived(authStore.getIsLoading())
	let error = $derived(authStore.getError())
	let isAuthenticated = $derived(authStore.isAuthenticated)

	let email = $state('')
	let password = $state('')
	let formErrors = $state<Record<string, string>>({})

	function validateForm() {
		const errors: Record<string, string> = {}

		if (!email.trim()) {
			errors.email = 'Email обязателен'
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			errors.email = 'Введите корректный email адрес'
		}

		if (!password.trim()) {
			errors.password = 'Пароль обязателен'
		} else if (password.length < 6) {
			errors.password = 'Пароль должен содержать минимум 6 символов'
		}

		formErrors = errors
		return Object.keys(errors).length === 0
	}

	async function handleSubmit(event: Event) {
		event.preventDefault()
		authStore.clearError()

		if (!validateForm()) return

		await authStore.login({ email, password })

		if (isAuthenticated) {
			const redirectTo = page.url.searchParams.get('redirect') || '/accruals'
			goto(redirectTo)
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			handleSubmit(event)
		}
	}
</script>

<div class="mx-auto w-full max-w-md">
	<div class="rounded-lg bg-white p-8 shadow-2xl shadow-gray-300/60">
		<!-- Logo Section -->
		<div class="mb-8 text-center">
			<Logo size="xxl" className="mb-6" />
			<div class="mb-4">
				<p class="text-sm text-gray-500">Управление активами сотрудников</p>
			</div>
		</div>

		{#if error}
			<ErrorMessage message={error} title="Login Error" />
		{/if}

		<form onsubmit={handleSubmit} class="space-y-6">
			<div>
				<label for="email" class="mb-2 block text-sm font-bold text-gray-700">
					Адрес электронной почты
				</label>
				<input
					id="email"
					type="email"
					bind:value={email}
					onkeydown={handleKeydown}
					class="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 {formErrors.email
						? 'border-red-500'
						: ''}"
					placeholder="Введите ваш email"
					disabled={isLoading}
				/>
				{#if formErrors.email}
					<p class="mt-1 text-sm text-red-600">{formErrors.email}</p>
				{/if}
			</div>

			<div>
				<label for="password" class="mb-2 block text-sm font-bold text-gray-700"> Пароль </label>
				<input
					id="password"
					type="password"
					bind:value={password}
					onkeydown={handleKeydown}
					class="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 {formErrors.password
						? 'border-red-500'
						: ''}"
					placeholder="Введите ваш пароль"
					disabled={isLoading}
				/>
				{#if formErrors.password}
					<p class="mt-1 text-sm text-red-600">{formErrors.password}</p>
				{/if}
			</div>

			<button
				type="submit"
				disabled={isLoading}
				class="flex w-full items-center justify-center rounded-md border border-transparent bg-primary-500 px-4 py-2 text-sm text-white shadow-sm hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
			>
				{#if isLoading}
					<LoadingSpinner size="sm" />
					<span class="ml-2">Вход в систему...</span>
				{:else}
					Войти
				{/if}
			</button>
		</form>
	</div>
</div>
