<script lang="ts">
	import LoadingSpinner from '$lib/components/UI/LoadingSpinner.svelte'
	import { authStore } from '$lib/features/Auth'
	import TypesOfAccruals from '$lib/features/TypesOfAccruals/TypesOfAccruals.svelte'

	let isLoggingOut = $derived(authStore.getIsLoggingOut())
</script>

<svelte:head>
	<title>Типы начислений | Система АммоКоинов</title>
</svelte:head>

{#if isLoggingOut}
	<LoadingSpinner title="Выход из системы..." size="lg" />
{:else}
	<TypesOfAccruals />
{/if}
