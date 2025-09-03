<script lang="ts">
  import { getAppContainerStyle } from '$lib/utils';
  import { Search } from '@lucide/svelte';

  import { mockDepartments } from '$lib/data/mockData';

  import {
    ErrorMessage,
    Modal,
    PaginationButton,
    RefreshButton,
  } from '$lib/components/UI';
  import UserDetails from '$lib/components/UserDetails.svelte';
  import { employeeStore } from '$lib/screens/Employees/store/employeeStore.svelte';
  import EmployeeCard from './EmployeeCard.svelte';

  let isLoading = $derived(employeeStore.getIsLoading());
  let error = $derived(employeeStore.getError());
  let apiEmployees = $derived(employeeStore.getApiEmployees());
  let filteredEmployees = $derived(employeeStore.filteredEmployees);
  let paginatedEmployees = $derived(employeeStore.paginatedEmployees);
  let currentPage = $derived(employeeStore.getCurrentPage());
  let totalPages = $derived(employeeStore.totalPages);
  let searchTerm = $derived(employeeStore.getSearchTerm());
  let selectedDepartment = $derived(employeeStore.getSelectedDepartment());
  let activeOnly = $derived(employeeStore.getActiveOnly());
  let showDetailModal = $derived(employeeStore.getShowDetailModal());
  let selectedEmployee = $derived(employeeStore.getSelectedEmployee());

  $effect(() => {
    if (apiEmployees.length === 0 && !isLoading && !error) {
      employeeStore.fetchEmployees();
    }
  });
</script>

<div class={getAppContainerStyle('py-8 min-h-screen bg-neutral-50')}>
  <div class="mb-8">
    <h1 class="text-3xl font-bold text-neutral-900">Сотрудники</h1>
    <p class="mt-2 text-sm text-neutral-600">
      Управление сотрудниками и их балансами АммоКоинов
    </p>
  </div>

  {#if error}
    <div class="mb-6">
      <ErrorMessage
        message={error}
        onRetry={() => employeeStore.retry()}
        onDismiss={() => employeeStore.clearError()}
      />
    </div>
  {/if}

  <!-- Panel search and filters -->
  <div
    class="bg-primary-50 rounded-lg shadow-sm border border-neutral-200 p-6 mb-6"
  >
    <div class="flex flex-col lg:flex-row gap-4 items-center">
      <div class="relative flex-1 min-w-0">
        <div
          class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
        >
          <Search class="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Поиск по имени или ID..."
          value={searchTerm}
          oninput={(e) =>
            employeeStore.setSearchTerm((e.target as HTMLInputElement).value)}
          class="input block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-md leading-5 bg-primary-50 placeholder-neutral-500 sm:text-sm"
        />
      </div>

      <!-- Filter by departments -->
      <div class="w-48 flex-shrink-0">
        <select
          value={selectedDepartment}
          onchange={(e) =>
            employeeStore.setDepartmentFilter(
              (e.target as HTMLSelectElement).value
            )}
          class="select block w-full px-3 pr-8 py-2 border border-neutral-300 rounded-md shadow-sm sm:text-sm bg-primary-50 truncate"
        >
          <option value="">Все подразделения</option>
          {#each mockDepartments as dept}
            <option value={dept.department_guid} class="truncate"
              >{dept.department}</option
            >
          {/each}
        </select>
      </div>

      <!-- Filter only active - fixed width -->
      <div class="flex items-center flex-shrink-0">
        <input
          id="active-only"
          type="checkbox"
          checked={activeOnly}
          onchange={(e) =>
            employeeStore.setActiveOnlyFilter(
              (e.target as HTMLInputElement).checked
            )}
          class="checkbox"
        />
        <label
          for="active-only"
          class="ml-2 block text-sm text-neutral-900 whitespace-nowrap"
        >
          Только активные
        </label>
      </div>

      <!-- Update button -->
      <RefreshButton
        onClick={() => employeeStore.refreshData()}
        {isLoading}
        variant="info"
      />
    </div>

    <!-- Pagination and statistics -->
    <div class="mt-4 flex flex-col sm:flex-row justify-between items-center">
      <div class="text-sm text-neutral-500 mb-2 sm:mb-0 flex flex-row gap-2">
        <div>
          Найдено {filteredEmployees.length} из {apiEmployees.length} сотрудников
        </div>
        <div class="text-neutral-500">•</div>
        <div>
          Показано {paginatedEmployees.length}
        </div>
      </div>

      <PaginationButton
        {currentPage}
        {totalPages}
        onPrevPage={() => employeeStore.prevPage()}
        onNextPage={() => employeeStore.nextPage()}
      />
    </div>
  </div>

  <!-- List of employees -->
  <div
    class="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
  >
    {#if isLoading}
      <!-- Loading skeleton -->
      {#each Array(12) as _}
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
    {:else if paginatedEmployees.length === 0}
      <!-- Empty state -->
      <div class="col-span-full text-center pt-24">
        <div class="mx-auto h-12 w-24 text-neutral-400">
          <Search class="h-full w-full" />
        </div>
        <h3 class="text-lg font-medium text-neutral-900">
          Сотрудники не найдены
        </h3>
        <p class="mt-2 text-sm text-neutral-500">
          Попробуйте изменить критерии поиска или фильтры
        </p>
        <div class="mt-4">
          <button
            onclick={() => employeeStore.clearFilters()}
            class="btn text-info-600 bg-info-100 hover:bg-info-200"
          >
            Сбросить фильтры
          </button>
        </div>
      </div>
    {:else}
      <!-- Employee cards -->
      {#each paginatedEmployees as employee (employee.employee_guid)}
        <EmployeeCard
          {employee}
          onDetailClick={(emp) => employeeStore.openEmployeeDetail(emp)}
        />
      {/each}
    {/if}
  </div>

  <!-- Pagination at the bottom -->
  <div class="mt-8">
    <PaginationButton
      {currentPage}
      {totalPages}
      onPrevPage={() => employeeStore.prevPage()}
      onNextPage={() => employeeStore.nextPage()}
    />
  </div>
</div>

<!-- Modal with employee details -->
<Modal
  isOpen={showDetailModal && selectedEmployee !== null}
  onClose={() => employeeStore.closeModal()}
  title="Детали сотрудника"
>
  {#snippet children()}
    {#if selectedEmployee}
      <UserDetails employee={selectedEmployee} />
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
