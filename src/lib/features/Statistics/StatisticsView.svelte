<script lang="ts">
	import { IconRow, RefreshButton } from '$lib/components/UI'
	import { getAppContainerStyle } from '../../utils'
	import { AccrualTypesStatisticsSection, EmployeesStatisticsSection } from './components'
	import { statisticsStore } from './store/statisticsStore.svelte'

	let topEmployees = $derived(statisticsStore.getTopEmployees())
	let topAccrualTypes = $derived(statisticsStore.getTopAccrualTypes())
	let isLoading = $derived(statisticsStore.getIsLoading())
	let error = $derived(statisticsStore.getError())

	let initialized = $state(false)
	
	$effect(() => {
		if (!initialized && !isLoading && !error) {
			initialized = true
			if (topEmployees.length === 0 || topAccrualTypes.length === 0) {
				statisticsStore.fetchStatistics()
			}
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

			<RefreshButton onClick={() => statisticsStore.refreshData()} disabled={true} variant="primary" />
		</div>
	</header>

	<main class="relative pb-6">
		<!-- Overlay баннер "В разработке" -->
		<div class="absolute inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-lg">
			<div class="mx-4 max-w-lg rounded-lg border border-amber-200 bg-white p-6 shadow-xl">
				<div class="flex items-start gap-4">
					<div class="flex-shrink-0">
						<svg
							class="h-6 w-6 text-amber-600"
							fill="currentColor"
							viewBox="0 0 20 20"
							aria-hidden="true"
						>
							<path
								fill-rule="evenodd"
								d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
								clip-rule="evenodd"
							/>
						</svg>
					</div>
					<div class="flex-1">
						<h3 class="text-lg font-semibold text-amber-900">Экран находится в разработке</h3>
						<div class="mt-2 text-sm text-amber-800">
							<p>Функционал статистики находится в стадии разработки и будет доступен в ближайшее время.</p>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="pointer-events-none opacity-50">
			<EmployeesStatisticsSection />
			<AccrualTypesStatisticsSection />
		</div>
	</main>
</div>
