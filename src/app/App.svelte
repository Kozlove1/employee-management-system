<script>
  import SimpleNavbar from '$lib/components/Layout/SimpleNavbar.svelte';
  import ErrorMessage from '$lib/components/UI/ErrorMessage.svelte';
  import LoadingSpinner from '$lib/components/UI/LoadingSpinner.svelte';
  import { CONTAINER_SM, getAppContainerStyle } from '$lib/utils';
  import '../app.css';

  let currentScreen = $state('accruals');

  const isAccrualsScreen = $derived(currentScreen === 'accruals');
  const isEmployeesScreen = $derived(currentScreen === 'employees');
  const isDepartmentsScreen = $derived(currentScreen === 'departments');
  const isPositionsScreen = $derived(currentScreen === 'positions');
  const isStatisticsScreen = $derived(currentScreen === 'statistics');
</script>

<div class="min-h-screen bg-neutral-50">
  <SimpleNavbar bind:currentScreen />

  <main class={getAppContainerStyle('py-6')}>
    {#if isAccrualsScreen}
      <div class="text-center py-12">
        <h2 class="text-3xl font-bold text-neutral-900 mb-4">
          🏆 Начисления АммоКоинов
        </h2>
        <p class="text-neutral-600 mb-8">
          Система управления бонусными начислениями сотрудникам
        </p>
        <div
          class="bg-primary-50 p-8 rounded-lg shadow-sm {CONTAINER_SM} border border-neutral-200"
        >
          <h3 class="text-xl font-semibold mb-4 text-neutral-900">
            Основные функции:
          </h3>
          <ul class="text-left space-y-2 text-neutral-700">
            <li>✅ Просмотр всех начислений с фильтрацией</li>
            <li>✅ Форма добавления новых начислений</li>
            <li>✅ Поиск по сотрудникам и типам начислений</li>
            <li>✅ Статистика по начислениям</li>
          </ul>
        </div>
      </div>
    {:else if isEmployeesScreen}
      {#await import('$lib/screens/Employees/EmployeeRegistry.svelte')}
        <LoadingSpinner />
      {:then module}
        {@const EmployeeRegistry = module.default}
        <EmployeeRegistry />
      {:catch error}
        <ErrorMessage message={error.message} />
      {/await}
    {:else if isStatisticsScreen}
      {#await import('$lib/screens/Statistics')}
        <LoadingSpinner />
      {:then module}
        {@const StatisticsView = module.StatisticsView}
        <StatisticsView />
      {:catch error}
        <ErrorMessage message={error.message} />
      {/await}
    {/if}
  </main>
</div>
