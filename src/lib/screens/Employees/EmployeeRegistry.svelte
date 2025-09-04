<script lang="ts">
  import { mockDepartments } from '$lib/data/mockData';
  import { getAppContainerStyle } from '$lib/utils';

  import {
    EmptyState,
    ErrorMessage,
    FilterSelect,
    IconRow,
    Modal,
    PaginationButton,
    RefreshButton,
    SearchInput,
    Skeleton,
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

<div class={getAppContainerStyle('min-h-screen bg-neutral-50')}>
  <header class="py-6">
    <IconRow
      title="Сотрудники"
      icon={'user'}
      titleSize="3xl"
      titleColor="text-neutral-900"
      iconSize="2xl"
      iconColor="blue"
    />
    <p class="mt-2 text-sm text-neutral-600">
      Управление сотрудниками и их балансами АммоКоинов
    </p>
  </header>

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
      {#if isLoading}
        <!-- Skeleton for search input -->
        <div class="flex-1 min-w-0">
          <div class="h-10 bg-neutral-300 rounded-md animate-pulse"></div>
        </div>
        <!-- Skeleton for department filter -->
        <div class="w-48 flex-shrink-0">
          <div class="h-10 bg-neutral-300 rounded-md animate-pulse"></div>
        </div>
        <!-- Skeleton for checkbox -->
        <div class="flex items-center flex-shrink-0">
          <div class="h-4 w-4 bg-neutral-300 rounded animate-pulse"></div>
          <div class="ml-2 h-4 bg-neutral-300 rounded w-24 animate-pulse"></div>
        </div>
      {:else}
        <div class="flex-1 min-w-0">
          <SearchInput
            value={searchTerm}
            placeholder="Поиск по имени или ID..."
            bgColor="bg-primary-50"
            borderColor="border-neutral-300"
            rounded="rounded-md"
            onChange={(value) => employeeStore.setSearchTerm(value)}
          />
        </div>

        <!-- Filter by departments -->
        <div class="w-48 flex-shrink-0">
          <FilterSelect
            value={selectedDepartment}
            options={[
              { value: '', label: 'Все подразделения' },
              ...mockDepartments.map((dept) => ({
                value: dept.department_guid,
                label: dept.department,
              })),
            ]}
            bgColor="bg-primary-50"
            onChange={(value) => employeeStore.setDepartmentFilter(value)}
          />
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
      {/if}
      <RefreshButton
        onClick={() => employeeStore.refreshData()}
        {isLoading}
        variant="info"
      />
    </div>

    <!-- Pagination and statistics -->
    <div class="mt-4">
      {#if isLoading}
        <Skeleton type="pagination-stats" />
      {:else}
        <div class="flex flex-col sm:flex-row justify-between items-center">
          <div
            class="text-sm text-neutral-500 mb-2 sm:mb-0 flex flex-row gap-2"
          >
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
      {/if}
    </div>
  </div>

  <!-- List of employees -->
  {#if isLoading}
    <Skeleton type="employee-grid" count={12} />
  {:else if paginatedEmployees.length === 0}
    <!-- Empty state -->
    <div class="col-span-full">
      <EmptyState
        showButton={true}
        buttonText="Сбросить фильтры"
        buttonAction={() => employeeStore.clearFilters()}
        title="Нет сотрудников"
        description="Начните с добавления первого сотрудника"
      />
    </div>
  {:else}
    <!-- Employee cards -->
    <div
      class="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
    >
      {#each paginatedEmployees as employee (employee.employee_guid)}
        <EmployeeCard
          {employee}
          onDetailClick={(emp) => employeeStore.openEmployeeDetail(emp)}
        />
      {/each}
    </div>
  {/if}

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
