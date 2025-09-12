<script lang="ts">
	import { IconRow, Skeleton } from '$lib/components/UI'
	import StatisticsRow from './StatisticsRow.svelte'
	import { statisticsStore } from './store/statisticsStore.svelte'

	let topAccrualTypes = $derived(statisticsStore.getTopAccrualTypes())
	let isLoading = $derived(statisticsStore.getIsLoading())
	let topAccrualTypesCount = $derived(statisticsStore.getTopAccrualTypesCount())
</script>

<section class="card mt-6 overflow-hidden">
	<header class="border-b border-gray-200 px-4 py-4 sm:px-6">
		<div class="flex items-center gap-3">
			<IconRow icon="tags" iconSize="xl" iconColor="black" backgroundColor="bg-gray-100" />
			<h2 class="text-lg font-semibold text-neutral-900 sm:text-xl">
				Топ-{topAccrualTypesCount} типов начислений по количеству
			</h2>
		</div>
	</header>

	<div class="divide-y divide-gray-200">
		{#if isLoading}
			<Skeleton type="statistics-table" count={topAccrualTypesCount} />
		{:else if topAccrualTypes.length === 0}
			<div class="px-4 py-8 text-center text-gray-500 sm:px-6">
				<p>Нет данных для отображения</p>
			</div>
		{:else}
			{#each topAccrualTypes as accrualType, index}
				<StatisticsRow data={accrualType} {index} type="accrualType" />
			{/each}
		{/if}
	</div>
</section>
