<script lang="ts">
	import LoadingSpinner from '$lib/components/UI/LoadingSpinner.svelte'
	import { authStore } from '$lib/features/Auth'
	import StatisticsView from '$lib/features/Statistics/StatisticsView.svelte'

	let isLoggingOut = $derived(authStore.getIsLoggingOut())
</script>

<svelte:head>
	<title>Статистика | Система АммоКоинов</title>
</svelte:head>

{#if isLoggingOut}
	<LoadingSpinner title="Выход из системы..." size="lg" />
{:else}
	<StatisticsView />
{/if}
