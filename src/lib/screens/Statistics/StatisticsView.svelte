<script lang="ts">
  import { ErrorMessage, IconRow, RefreshButton } from '$lib/components/UI';
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

      <RefreshButton
        onClick={() => statisticsStore.refreshData()}
        {isLoading}
        variant="primary"
      />

      <!-- Demo error button -->
      <button
        type="button"
        onclick={() => statisticsStore.simulateError()}
        class="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        title="Демонстрация обработки ошибок"
      >
        Симулировать ошибку
      </button>
    </div>
  </header>

  {#if error}
    <div class="mb-6">
      <ErrorMessage
        message={error}
        onRetry={() => statisticsStore.retry()}
        onDismiss={() => statisticsStore.clearError()}
      />
    </div>
  {/if}
  <!-- Demo error button -->

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
          <!-- Loading skeleton -->
          {#each Array(topEmployeesCount) as _, index}
            {@const isTopThree = index < 3}
            {@const positionBg =
              index === 0
                ? 'bg-yellow-200'
                : index === 1
                  ? 'bg-gray-200'
                  : index === 2
                    ? 'bg-orange-200'
                    : 'bg-neutral-300'}

            <div
              class="px-6 py-4 animate-pulse flex items-center justify-between"
            >
              <div class="flex items-center space-x-4">
                <!-- Position skeleton with special styling for top 3 -->
                <div class="flex-shrink-0">
                  <div class="h-8 w-8 {positionBg} rounded-full"></div>
                </div>

                <!-- Employee info skeleton -->
                <div class="flex-1 min-w-0 space-y-2">
                  <div
                    class="h-4 bg-neutral-300 rounded {isTopThree
                      ? 'w-52'
                      : 'w-48'}"
                  ></div>
                  <div
                    class="h-3 bg-neutral-300 rounded {isTopThree
                      ? 'w-36'
                      : 'w-32'}"
                  ></div>
                </div>
              </div>

              <!-- Balance skeleton -->
              <div class="flex-shrink-0 text-right">
                <div class="flex items-center space-x-2">
                  <div class="h-5 w-5 bg-yellow-200 rounded"></div>
                  <div
                    class="h-4 bg-neutral-300 rounded {isTopThree
                      ? 'w-24'
                      : 'w-20'}"
                  ></div>
                </div>
              </div>
            </div>
          {/each}
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
