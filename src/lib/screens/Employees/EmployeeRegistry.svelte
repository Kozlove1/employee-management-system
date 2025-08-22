<script lang="ts">
  import EmployeeCard from './EmployeeCard.svelte';
  import Modal from '$lib/components/UI/Modal.svelte';
  import UserDetails from './UserDetails.svelte';
  import { employeeStore } from '$lib/stores/employeeStore.svelte';
  import { mockDepartments } from '$lib/data/mockData';
  import {
    ChevronLeft,
    ChevronRight,
    RefreshCcw,
    Search,
  } from '@lucide/svelte';

  // Загрузка данных при инициализации
  $effect(() => {
    if (employeeStore.apiEmployees.length === 0) {
      employeeStore.fetchEmployees();
    }
  });
</script>

<div class="min-h-screen bg-neutral-50">
  <div class="container mx-auto px-4 py-8">
    <!-- Заголовок -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-neutral-900">Реестр сотрудников</h1>
      <p class="mt-2 text-sm text-neutral-600">
        Управление сотрудниками и их балансами АммоКоинов
      </p>
    </div>

    <!-- Панель поиска и фильтров -->
    <div
      class="bg-primary-50 rounded-lg shadow-sm border border-neutral-200 p-6 mb-6"
    >
      <div class="flex flex-col lg:flex-row gap-4 items-center">
        <!-- Поиск -->
        <div class="relative flex-1">
          <div
            class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
          >
            <Search class="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Поиск по имени или ID..."
            bind:value={employeeStore.searchTerm}
            oninput={(e) =>
              employeeStore.setSearchTerm((e.target as HTMLInputElement).value)}
            class="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-md leading-5 bg-primary-50 placeholder-neutral-500 focus:outline-none focus:placeholder-neutral-400 focus:ring-1 focus:ring-info-500 focus:border-info-500 sm:text-sm"
          />
        </div>

        <!-- Фильтр по подразделениям -->
        <div class="min-w-48">
          <select
            bind:value={employeeStore.selectedDepartment}
            onchange={(e) =>
              employeeStore.setDepartmentFilter(
                (e.target as HTMLSelectElement).value
              )}
            class="block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-info-500 focus:border-info-500 sm:text-sm bg-primary-50"
          >
            <option value="">Все подразделения</option>
            {#each mockDepartments as dept}
              <option value={dept.department_guid}>{dept.department}</option>
            {/each}
          </select>
        </div>

        <!-- Фильтр только активные -->
        <div class="flex items-center">
          <input
            id="active-only"
            type="checkbox"
            bind:checked={employeeStore.activeOnly}
            onchange={(e) =>
              employeeStore.setActiveOnlyFilter(
                (e.target as HTMLInputElement).checked
              )}
            class="h-4 w-4 text-info-500 focus:ring-info-500 border-neutral-300 rounded"
          />
          <label for="active-only" class="ml-2 block text-sm text-neutral-900">
            Только активные
          </label>
        </div>

        <!-- Кнопка обновить -->
        <button
          onclick={() => employeeStore.refreshData()}
          disabled={employeeStore.isLoading}
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-50 bg-info-500 hover:bg-info-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-info-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCcw
            class="w-4 h-4 mr-2 {employeeStore.isLoading ? 'animate-spin' : ''}"
          />
          Обновить
        </button>
      </div>

      <!-- Пагинация и статистика -->
      <div class="mt-4 flex flex-col sm:flex-row justify-between items-center">
        <div class="text-sm text-neutral-500 mb-2 sm:mb-0">
          Показано {employeeStore.paginatedEmployees().length} из {employeeStore.filteredEmployees()
            .length} сотрудников
        </div>

        <!-- Пагинация -->
        {#if employeeStore.totalPages() > 1}
          <div class="flex items-center space-x-2">
            <button
              onclick={() => employeeStore.prevPage()}
              disabled={employeeStore.currentPage === 1}
              class="p-2 rounded-md border border-neutral-300 bg-primary-50 text-neutral-500 hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft class="w-4 h-4" />
            </button>

            <span class="text-sm text-neutral-700">
              {employeeStore.currentPage} / {employeeStore.totalPages()}
            </span>

            <button
              onclick={() => employeeStore.nextPage()}
              disabled={employeeStore.currentPage ===
                employeeStore.totalPages()}
              class="p-2 rounded-md border border-neutral-300 bg-primary-50 text-neutral-500 hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight class="w-4 h-4" />
            </button>
          </div>
        {/if}
      </div>
    </div>

    <!-- Список сотрудников -->
    <div
      class="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
    >
      {#if employeeStore.isLoading}
        <!-- Скелетон загрузки -->
        {#each Array(12) as _, i}
          <div
            class="bg-primary-50 rounded-lg border border-neutral-200 p-4 animate-pulse"
          >
            <div class="flex items-start space-x-4">
              <div class="h-10 w-10 bg-neutral-300 rounded-full"></div>
              <div class="flex-1 space-y-2">
                <div class="h-4 bg-neutral-300 rounded w-3/4"></div>
                <div class="h-3 bg-neutral-300 rounded w-1/2"></div>
              </div>
            </div>
            <div class="mt-4 space-y-2">
              <div class="h-3 bg-neutral-300 rounded"></div>
              <div class="h-3 bg-neutral-300 rounded w-5/6"></div>
            </div>
          </div>
        {/each}
      {:else if employeeStore.paginatedEmployees().length === 0}
        <!-- Пустое состояние -->
        <div class="col-span-full text-center py-12">
          <div class="mx-auto h-24 w-24 text-neutral-400">
            <Search class="h-full w-full" />
          </div>
          <h3 class="mt-4 text-lg font-medium text-neutral-900">
            Сотрудники не найдены
          </h3>
          <p class="mt-2 text-sm text-neutral-500">
            Попробуйте изменить критерии поиска или фильтры
          </p>
          <div class="mt-4">
            <button
              onclick={() => employeeStore.clearFilters()}
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-info-600 bg-info-100 hover:bg-info-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-info-500"
            >
              Сбросить фильтры
            </button>
          </div>
        </div>
      {:else}
        <!-- Карточки сотрудников -->
        {#each employeeStore.paginatedEmployees() as employee (employee.employee_guid)}
          <EmployeeCard
            {employee}
            onDetailClick={(emp) => employeeStore.openEmployeeDetail(emp)}
          />
        {/each}
      {/if}
    </div>
  </div>
</div>

<!-- Модальное окно с деталями сотрудника -->
<Modal
  isOpen={employeeStore.showDetailModal &&
    employeeStore.selectedEmployee !== null}
  onClose={() => employeeStore.closeModal()}
  title="Детали сотрудника"
  size="xl"
>
  {#snippet children()}
    {#if employeeStore.selectedEmployee}
      <UserDetails employee={employeeStore.selectedEmployee} />
    {/if}
  {/snippet}

  {#snippet footer()}
    <button
      type="button"
      onclick={() => employeeStore.closeModal()}
      class="inline-flex justify-center rounded-md border border-neutral-300 shadow-sm px-4 py-2 bg-primary-50 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
    >
      Закрыть
    </button>
  {/snippet}
</Modal>
