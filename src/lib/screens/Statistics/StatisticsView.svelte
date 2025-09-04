<script lang="ts">
  import { IconRow, RefreshButton, Skeleton } from '$lib/components/UI';
  import { getAppContainerStyle } from '../../utils';
  import StatisticsRow from './StatisticsRow.svelte';
  import { statisticsStore } from './store/statisticsStore.svelte';

  let topEmployees = $derived(statisticsStore.getTopEmployees());
  let isLoading = $derived(statisticsStore.getIsLoading());
  let error = $derived(statisticsStore.getError());
  let topEmployeesCount = $derived(statisticsStore.getTopEmployeesCount());
  let hasData = $derived(statisticsStore.hasData);

  $effect(() => {
    if (topEmployees.length === 0 && !isLoading && !error) {
      statisticsStore.fetchStatistics();
    }
  });
</script>

<div class={getAppContainerStyle('min-h-screen bg-neutral-50')}>
  <header
    class="flex flex-col justify-start items-start gap-2 w-full text-left py-6"
  >
    <div class="flex items-center justify-between w-full">
      <IconRow
        title="Статистика"
        icon={'chart'}
        titleSize="3xl"
        titleColor="text-neutral-900"
        iconSize="2xl"
        iconColor="blue"
      />

      <RefreshButton
        onClick={() => statisticsStore.refreshData()}
        {isLoading}
        variant="primary"
      />
    </div>
  </header>

  <main>
    <section class="card">
      <header class="px-6 py-4 border-b border-gray-200">
        <IconRow
          title="Топ-{topEmployeesCount} сотрудников по балансу АммоКоинов"
          icon={'crown'}
          titleSize="xl"
          titleColor="text-neutral-900"
          iconSize="xl"
          iconColor="yellow"
        />
      </header>

      <div class="divide-y divide-gray-200">
        {#if isLoading}
          <Skeleton type="statistics-table" count={topEmployeesCount} />
        {:else if topEmployees.length === 0}
          <div class="px-6 py-8 text-center text-gray-500">
            <p>Нет данных для отображения</p>
          </div>
        {:else}
          {#each topEmployees as employee, index}
            <StatisticsRow {employee} {index} />
          {/each}
        {/if}
      </div>
    </section>
  </main>
</div>
