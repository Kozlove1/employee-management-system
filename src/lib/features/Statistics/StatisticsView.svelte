<script lang="ts">
	import { ErrorMessage, IconRow, RefreshButton } from '$lib/components/UI'
	import { getAppContainerStyle } from '../../utils'
	import { AccrualTypesStatisticsSection, EmployeesStatisticsSection } from './components'
	import { statisticsStore } from './store/statisticsStore.svelte'

	let topEmployees = $derived(statisticsStore.getTopEmployees())
	let topAccrualTypes = $derived(statisticsStore.getTopAccrualTypes())
	let isLoading = $derived(statisticsStore.getIsLoading())
	let error = $derived(statisticsStore.getError())

	let initialized = $state(false)

	$effect(() => {
		if (!initialized) {
			initialized = true
			statisticsStore.fetchStatistics()
		}
	})
</script>

<div class={getAppContainerStyle('min-h-screen bg-neutral-50 relative')}>
	<header class="flex w-full flex-col items-start justify-start gap-2 py-4 text-left sm:py-6">
		<div
			class="flex w-full flex-col items-start justify-between gap-4 sm:flex-row sm:items-center sm:gap-0"
		>
			<div class="flex items-center gap-3">
				<IconRow icon="chart" iconSize="3xl" iconColor="blue" backgroundColor="bg-primary-50" />
				<h1 class="text-xl font-bold text-neutral-900 sm:text-2xl lg:text-3xl">Статистика</h1>
			</div>

			<RefreshButton onClick={() => statisticsStore.refreshData()} disabled={isLoading} variant="primary" />
		</div>
	</header>

	<main class="relative pb-6">
		{#if error}
			<div class="mb-6">
				<ErrorMessage
					message={error}
					onRetry={() => statisticsStore.retry()}
					onDismiss={() => statisticsStore.clearError()}
				/>
			</div>
		{/if}
		<EmployeesStatisticsSection />
		<AccrualTypesStatisticsSection />
	</main>
</div>
