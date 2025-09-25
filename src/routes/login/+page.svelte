<script lang="ts">
	import { goto } from '$app/navigation'
	import { authStore } from '$lib/features/Auth'
	import LoginForm from '$lib/features/Auth/components/LoginForm.svelte'
	import { onMount } from 'svelte'

	let isAuthenticated = $derived(authStore.isAuthenticated)
	let isLoading = $derived(authStore.getIsLoading())

	$effect(() => {
		if (isAuthenticated) {
			goto('/')
		}
	})

	onMount(() => {
		authStore.initialize()
	})
</script>

<svelte:head>
	<title>Login - Ammo Coins System</title>
	<meta name="description" content="Sign in to your Ammo Coins account" />
</svelte:head>

<div class="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
	<div class="w-full max-w-md">
		{#if isLoading}
			<div class="flex items-center justify-center py-12">
				<div class="h-8 w-8 animate-spin rounded-full border-b-2 border-primary-500"></div>
				<span class="ml-2">Вход в систему...</span>
			</div>
		{:else}
			<LoginForm />
		{/if}
	</div>
</div>
