<script lang="ts">
	import LoadingSpinner from '$lib/components/UI/LoadingSpinner.svelte'
	import AccrualRegistry from '$lib/features/Accruals/AccrualRegistry.svelte'
	import { authStore } from '$lib/features/Auth'

	let isLoggingOut = $derived(authStore.getIsLoggingOut())
</script>

<svelte:head>
	<title>Начисления | Система АммоКоинов</title>
</svelte:head>

{#if isLoggingOut}
	<LoadingSpinner title="Выход из системы..." size="lg" />
{:else}
	<AccrualRegistry />
{/if}
