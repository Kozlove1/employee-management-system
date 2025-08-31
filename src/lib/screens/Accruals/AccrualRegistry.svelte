<script lang="ts">
  import IconRow from '$lib/components/UI/IconRow.svelte';
  import AccrualForm from './AccrualForm.svelte';

  import {
    getDepartmentName,
    mockAccrualTypes,
    mockEmployees,
  } from '$lib/data/mockData';
  import type { AccrualFormData, AccrualWithDetails } from '$lib/types';

  // Состояние компонента
  let showForm = $state(false);
  let searchTerm = $state('');
  let selectedEmployee = $state('');
  let selectedType = $state('');
  let dateFrom = $state('');
  let dateTo = $state('');

  // Генерируем тестовые начисления
  let accruals = $state<AccrualWithDetails[]>([
    {
      org_guid: '8753101a-4fb8-11ed-9d6f-00155dd75c64',
      post_guid: 'accrual1',
      post: 'Тестовая награда 2',
      department_guid: '86253ef6-4e33-11ee-9d85-00155de8647c',
      datecreate: '27.07.2025',
      datedisband: '',
      employee_name: 'Абдуллина Надежа Маскутовна',
      type_name: 'Тестовая награда 2 (300 АК)',
      amount: 300,
      comment: '',
    },
    {
      org_guid: '8753101a-4fb8-11ed-9d6f-00155dd75c64',
      post_guid: 'accrual2',
      post: 'Тестовая награда 3',
      department_guid: '86253b1a-4e33-11ee-9d85-00155de8647c',
      datecreate: '20.03.2018',
      datedisband: '',
      employee_name: 'Абдулганеев Ильназар Альфредович',
      type_name: 'Тестовая награда 3 (60 АК)',
      amount: 60,
      comment: 'За качественную работу',
    },
    {
      org_guid: '8753101a-4fb8-11ed-9d6f-00155dd75c64',
      post_guid: 'accrual3',
      post: 'Тестовая награда',
      department_guid: '86253ef6-4e33-11ee-9d85-00155de8647c',
      datecreate: '12.12.2016',
      datedisband: '',
      employee_name: 'Абрахманов Ильшат Ришатович',
      type_name: 'Тестовая награда (100 АК)',
      amount: 100,
      comment: 'Специальная награда',
    },
  ]);

  // Фильтрация данных
  let filteredAccruals = $derived(() => {
    return accruals.filter((accrual) => {
      const matchesSearch =
        !searchTerm ||
        accrual.employee_name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        accrual.type_name?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesEmployee =
        !selectedEmployee || accrual.employee_name === selectedEmployee;
      const matchesType = !selectedType || accrual.type_name === selectedType;

      return matchesSearch && matchesEmployee && matchesType;
    });
  });

  // Уникальные сотрудники и типы для фильтров
  let uniqueEmployees = $derived(() => {
    const employees = new Set(
      accruals.map((a) => a.employee_name).filter(Boolean)
    );
    return Array.from(employees);
  });

  let uniqueTypes = $derived(() => {
    const types = new Set(accruals.map((a) => a.type_name).filter(Boolean));
    return Array.from(types);
  });

  // Статистика
  let totalAccruals = $derived(filteredAccruals.length);
  let totalAmount = $derived(() => {
    const filtered = filteredAccruals();
    return filtered.reduce((sum, accrual) => sum + (accrual.amount || 0), 0);
  });

  function handleAddAccrual(data: AccrualFormData) {
    const employee = mockEmployees.find(
      (e) => e.employee_guid === data.employee_guid
    );
    const type = mockAccrualTypes.find((t) => t.type_guid === data.type_guid);

    const newAccrual: AccrualWithDetails = {
      org_guid: '8753101a-4fb8-11ed-9d6f-00155dd75c64',
      post_guid: `accrual_${Date.now()}`,
      post: type?.type_name || '',
      department_guid: employee?.department_guid || '',
      datecreate: data.date || new Date().toLocaleDateString('ru-RU'),
      datedisband: '',
      employee_name: employee?.employee || '',
      type_name: type?.type_name || '',
      amount: data.amount,
      comment: data.comment || '',
    };

    accruals = [newAccrual, ...accruals];
  }

  function resetFilters() {
    searchTerm = '';
    selectedEmployee = '';
    selectedType = '';
    dateFrom = '';
    dateTo = '';
  }
</script>

<div class="space-y-6">
  <!-- Заголовок и статистика -->
  <div
    class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
  >
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Начисления АммоКоинов</h1>
      <p class="mt-1 text-sm text-gray-500">
        Заполните форму для начисления АммоКоинов сотруднику
      </p>
    </div>

    <div class="flex items-center space-x-4 text-sm">
      <div class="bg-primary-50 px-3 py-2 rounded-lg">
        <span class="text-primary-600 font-medium">Всего сотрудников:</span>
        <span class="text-primary-900 font-bold ml-1">1 601</span>
      </div>
      <div class="bg-warning-50 px-3 py-2 rounded-lg">
        <span class="text-warning-600 font-medium">Начислений за месяц:</span>
        <span class="text-warning-900 font-bold ml-1">0</span>
      </div>
      <div class="bg-success-50 px-3 py-2 rounded-lg">
        <span class="text-success-600 font-medium">Типы начислений:</span>
        <span class="text-success-900 font-bold ml-1">6</span>
      </div>
      <div class="bg-gray-50 px-3 py-2 rounded-lg">
        <span class="text-gray-600 font-medium">Общая сумма:</span>
        <span class="text-gray-900 font-bold ml-1">0 АК</span>
      </div>
    </div>
  </div>

  <!-- Фильтры и поиск -->
  <div class="card p-4">
    <div class="flex flex-col lg:flex-row lg:items-center gap-4">
      <div class="flex-1">
        <div class="relative">
          <div
            class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          >
            <IconRow icon="search" iconSize="s" />
          </div>
          <input
            type="text"
            placeholder="Поиск по сотруднику, типу, комментарию..."
            bind:value={searchTerm}
            class="input pl-10"
          />
        </div>
      </div>

      <div class="flex flex-wrap gap-3">
        <select bind:value={selectedEmployee} class="select min-w-[200px]">
          <option value="">Все сотрудники ({mockEmployees.length})</option>
          {#each uniqueEmployees() as employee}
            <option value={employee}>{employee}</option>
          {/each}
        </select>

        <select bind:value={selectedType} class="select min-w-[200px]">
          <option value="">Все типы ({mockAccrualTypes.length})</option>
          {#each uniqueTypes() as type}
            <option value={type}>{type}</option>
          {/each}
        </select>

        <button class="btn-secondary" onclick={resetFilters}>
          <IconRow icon="filter" iconSize="s" />
          Сбросить
        </button>

        <button class="btn-success" onclick={() => (showForm = true)}>
          <IconRow icon="plus" iconSize="s" />
          Добавить начисление
        </button>
      </div>
    </div>
  </div>

  <!-- Статистика по фильтрам -->
  {#if filteredAccruals.length > 0}
    <div class="bg-gray-50 px-4 py-3 rounded-lg">
      <div class="text-sm text-gray-600">
        Всего: <span class="font-semibold">{totalAccruals} начислений</span> на
        сумму
        <span class="font-semibold">{totalAmount} АК</span>
        {#if totalAccruals !== accruals.length}
          (отфильтровано из {accruals.length})
        {/if}
      </div>
    </div>
  {/if}

  <!-- Таблица начислений -->
  <div class="card overflow-hidden">
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Сотрудник
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Тип начисления
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Сумма
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Дата
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Комментарий
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          {#each filteredAccruals() as accrual}
            <tr class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-8 w-8">
                    <div
                      class="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center"
                    >
                      <span class="text-sm font-medium text-primary-600">
                        {accrual.employee_name?.charAt(0) || '?'}
                      </span>
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">
                      {accrual.employee_name}
                    </div>
                    <div class="text-sm text-gray-500">
                      {getDepartmentName(accrual.department_guid)}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                >
                  {accrual.type_name}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">
                  {accrual.amount} АК
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div class="flex items-center">
                  <IconRow icon="calendar" iconSize="s" />
                  {accrual.datecreate}
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-500 max-w-xs truncate">
                  {accrual.comment || '—'}
                </div>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>

      {#if filteredAccruals.length === 0}
        <div class="text-center py-12">
          <div class="text-gray-400 text-lg mb-2">📝</div>
          <h3 class="text-lg font-medium text-gray-900 mb-1">
            Начисления не найдены
          </h3>
          <p class="text-gray-500">
            {#if searchTerm || selectedEmployee || selectedType}
              Попробуйте изменить фильтры поиска
            {:else}
              Начните с добавления первого начисления
            {/if}
          </p>
        </div>
      {/if}
    </div>
  </div>
</div>

<!-- Модальная форма -->
<AccrualForm
  bind:isOpen={showForm}
  onSubmit={handleAddAccrual}
  onCancel={() => (showForm = false)}
/>
