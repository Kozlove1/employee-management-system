<script lang="ts">
	import { goto } from '$app/navigation'
	import LoadingSpinner from '$lib/components/UI/LoadingSpinner.svelte'
	import { authStore } from '$lib/features/Auth'
	import { onMount } from 'svelte'

	// Reactive variables using $derived with getters
	let isAuthenticated = $derived(authStore.isAuthenticated)
	let isLoading = $derived(authStore.getIsLoading())
	let isLoggingOut = $derived(authStore.getIsLoggingOut())

	onMount(() => {
		// Initialize auth status
		authStore.initialize()
	})

	$effect(() => {
		if (!isLoading && typeof window !== 'undefined') {
			if (!isAuthenticated) {
				goto('/login', { replaceState: true })
			} else {
				goto('/accruals', { replaceState: true })
			}
		}
	})
</script>

{#if isLoggingOut}
	<LoadingSpinner title="Выход из системы..." size="lg" />
{:else if isLoading}
	<div class="py-12 text-center">
		<h2 class="mb-4 text-3xl font-bold text-neutral-900">Система АммоКоинов</h2>
		<p class="text-neutral-600">Загрузка...</p>
	</div>
{/if}
