<script lang="ts">
  import { RefreshButton, Skeleton } from '$lib/components/UI';
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
    class="flex flex-col justify-start items-start gap-2 w-full text-left py-4 sm:py-6"
  >
    <div
      class="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-4 sm:gap-0"
    >
      <div class="flex items-center gap-3">
        <div class="flex items-center gap-3">
          <div class="bg-primary-50 rounded-md p-1">
            <svg
              class="w-5 h-5 sm:w-6 sm:h-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              ></path>
            </svg>
          </div>
          <h1
            class="text-xl sm:text-2xl lg:text-3xl font-bold text-neutral-900"
          >
            Статистика
          </h1>
        </div>
      </div>

      <RefreshButton
        onClick={() => statisticsStore.refreshData()}
        {isLoading}
        variant="primary"
      />
    </div>
  </header>

  <main class="pb-6">
    <section class="card overflow-hidden">
      <header class="px-4 sm:px-6 py-4 border-b border-gray-200">
        <div class="flex items-center gap-3">
          <div class="bg-yellow-100 rounded-md p-1">
            <svg
              class="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
              ></path>
            </svg>
          </div>
          <h2 class="text-lg sm:text-xl font-semibold text-neutral-900">
            Топ-{topEmployeesCount} сотрудников по балансу АммоКоинов
          </h2>
        </div>
      </header>

      <div class="divide-y divide-gray-200">
        {#if isLoading}
          <Skeleton type="statistics-table" count={topEmployeesCount} />
        {:else if topEmployees.length === 0}
          <div class="px-4 sm:px-6 py-8 text-center text-gray-500">
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
