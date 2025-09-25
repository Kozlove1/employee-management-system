<script>
	import SimpleNavbar from '$lib/components/Layout/SimpleNavbar.svelte'
	import { authStore } from '$lib/features/Auth'
	import { handleAuthRedirect } from '$lib/features/Auth/middleware'
	import { getAppContainerStyle } from '$lib/utils'
	import { onMount } from 'svelte'
	import '../app.css'

	const props = $props()
	const children = props.children

	let isAuthenticated = $derived(authStore.isAuthenticated)
	let isLoading = $derived(authStore.getIsLoading())

	$effect(() => {
		if (!isLoading && typeof window !== 'undefined') {
			handleAuthRedirect()
		}
	})

	onMount(() => {
		authStore.initialize()
	})
</script>

<div class="min-h-screen bg-neutral-50">
	{#if isAuthenticated}
		<SimpleNavbar />
	{/if}

	<main class="{getAppContainerStyle('py-6')} {isAuthenticated ? 'pt-20' : ''}">
		{#if isLoading}
			<div class="flex items-center justify-center py-12">
				<div class="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
				<span class="ml-2">Загрузка...</span>
			</div>
		{:else}
			{@render children()}
		{/if}
	</main>
</div>
