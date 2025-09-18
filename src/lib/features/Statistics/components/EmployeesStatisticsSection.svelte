<script lang="ts">
	import { IconRow, Skeleton } from '$lib/components/UI'
	import { statisticsStore } from '../store/statisticsStore.svelte'
	import StatisticsRow from './StatisticsRow.svelte'

	let topEmployees = $derived(statisticsStore.getTopEmployees())
	let isLoading = $derived(statisticsStore.getIsLoading())
	let topEmployeesCount = $derived(statisticsStore.getTopEmployeesCount())
</script>

<section class="card overflow-hidden">
	<header class="border-b border-gray-200 px-4 py-4 sm:px-6">
		<div class="flex items-center gap-3">
			<IconRow icon="crown" iconSize="xl" iconColor="yellow" backgroundColor="bg-yellow-500" />
			<h2 class="text-lg font-semibold text-neutral-900 sm:text-xl">
				Топ-{topEmployeesCount} сотрудников по балансу АммоКоинов
			</h2>
		</div>
	</header>

	<div class="divide-y divide-gray-200">
		{#if isLoading}
			<Skeleton type="statistics-table" count={topEmployeesCount} />
		{:else if topEmployees.length === 0}
			<div class="px-4 py-8 text-center text-gray-500 sm:px-6">
				<p>Нет данных для отображения</p>
			</div>
		{:else}
			{#each topEmployees as employee, index}
				<StatisticsRow data={employee} {index} type="employee" />
			{/each}
		{/if}
	</div>
</section>
