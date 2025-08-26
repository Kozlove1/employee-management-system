<script lang="ts">
  import { getTopEmployeesByBalance } from '$lib/screens/Statistics/statisticsMockData';

  import { IconRow, LoadingSpinner, RefreshButton } from '$lib/components/UI';
  import StatisticsRow from './StatisticsRow.svelte';

  import type { EmployeeStats } from '$lib/types';

  const TOP_EMPLOYEES_COUNT = 10;

  let isLoading = $state(false);

  let topEmployees = $state<EmployeeStats[]>([]);

  function loadStatistics() {
    isLoading = true;

    setTimeout(() => {
      topEmployees = getTopEmployeesByBalance(TOP_EMPLOYEES_COUNT);
      isLoading = false;
    }, 1500);
  }

  $effect(() => {
    loadStatistics();
  });
</script>

<div class="space-y-6 w-full">
  <header
    class="flex flex-col justify-start items-start gap-2 w-full text-left"
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

      <RefreshButton onClick={loadStatistics} {isLoading} variant="primary" />
    </div>
  </header>

  <main>
    <section class="card">
      <header class="px-6 py-4 border-b border-gray-200">
        <IconRow
          title="Топ-10 сотрудников по балансу АммоКоинов"
          icon={'crown'}
          titleSize="xl"
          titleColor="text-neutral-900"
          iconSize="xl"
          iconColor="yellow"
        />
      </header>

      <div class="divide-y divide-gray-200">
        {#if isLoading}
          <div class="px-6 py-8 text-center text-gray-500">
            <LoadingSpinner title="Данные о сотрудниках загружаются..." />
          </div>
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
