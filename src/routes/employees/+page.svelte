<script lang="ts">
	import LoadingSpinner from '$lib/components/UI/LoadingSpinner.svelte'
	import { authStore } from '$lib/features/Auth'
	import EmployeeRegistry from '$lib/features/Employees/EmployeeRegistry.svelte'

	let isLoggingOut = $derived(authStore.getIsLoggingOut())
</script>

<svelte:head>
	<title>Сотрудники | Система АммоКоинов</title>
</svelte:head>

{#if isLoggingOut}
	<LoadingSpinner title="Выход из системы..." size="lg" />
{:else}
	<EmployeeRegistry />
{/if}
