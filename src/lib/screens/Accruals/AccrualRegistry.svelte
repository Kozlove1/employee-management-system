<script lang="ts">
  import StatCard from '$lib/components/UI/StatCard.svelte';
  import { mockAccrualTypes, mockEmployees } from '$lib/data/mockData';
  import { statisticsCards } from '$lib/data/statisticsData';
  import AccrualForm from './Form/AccrualForm.svelte';
  import { accrualFormStore } from './Form/store/accrualFormStore.svelte';
  import {
    AccrualsDataManager,
    type CreateAccrualData,
    type UpdateAccrualData,
  } from './accrualsData';

  // Состояние компонента
  let searchTerm = $state('');
  let selectedEmployee = $state('');
  let selectedType = $state('');
  let sortOrder = $state('newest');

  let dataVersion = $state(0); // Триггер для обновления

  // Отслеживаем изменения dataVersion
  $effect(() => {
    console.log('dataVersion changed to:', dataVersion);
  });

  let accruals = $derived(() => {
    dataVersion; // Зависимость для принудительного обновления
    return AccrualsDataManager.getAll();
  });

  let filteredAccruals = $derived(() => {
    // Принудительно зависим от accruals() чтобы получать обновления
    const allAccruals = accruals();

    // Находим GUID'ы для фильтрации
    const employeeGuid = selectedEmployee
      ? mockEmployees.find((e) => e.employee === selectedEmployee)
          ?.employee_guid
      : undefined;

    const typeGuid = selectedType
      ? mockAccrualTypes.find((t) => t.type_name === selectedType)?.type_guid
      : undefined;

    const result = AccrualsDataManager.search({
      searchTerm: searchTerm || undefined,
      employeeGuid,
      typeGuid,
      sortOrder: sortOrder as 'newest' | 'oldest',
    });

    return result;
  });

  // Уникальные сотрудники и типы для фильтров
  let uniqueEmployees = $derived(() => {
    const employees = new Set(
      accruals()
        .map((a) => a.employee_name)
        .filter(Boolean)
    );
    return Array.from(employees);
  });

  let uniqueTypes = $derived(() => {
    const types = new Set(
      accruals()
        .map((a) => a.type_name)
        .filter(Boolean)
    );
    return Array.from(types);
  });

  let totalEmployees = $derived(() => {
    dataVersion; // Зависимость для принудительного обновления
    return mockEmployees.length;
  });

  let totalAccrualTypes = $derived(() => {
    dataVersion; // Зависимость для принудительного обновления
    return mockAccrualTypes.length;
  });

  let stats = $derived(() => {
    dataVersion; // Зависимость для принудительного обновления
    return AccrualsDataManager.getStats();
  });

  let statisticsValues = $derived(() => {
    dataVersion; // Зависимость для принудительного обновления
    const values = {
      totalEmployees: totalEmployees(),
      monthlyAccruals: stats().monthlyCount,
      totalAccrualTypes: totalAccrualTypes(),
      totalAmount: stats().monthlyAmount, // Сумма начислений за текущий месяц
    };
    return values;
  });

  function handleAddAccrual(data) {
    const createData: CreateAccrualData = {
      employee_guid: data.employee_guid,
      type_guid: data.type_guid,
      amount: data.amount,
      comment: data.comment || '',
      date: data.date,
    };

    AccrualsDataManager.create(createData, mockEmployees, mockAccrualTypes);

    dataVersion++;
  }

  function handleEditAccrual(accrualToEdit) {
    accrualFormStore.openForEdit(accrualToEdit);
  }

  function handleUpdateAccrual(data) {
    const currentAccrual = accrualFormStore.getCurrentAccrual();

    const updateData: UpdateAccrualData = {
      post_guid: currentAccrual.post_guid,
      employee_guid: data.employee_guid,
      type_guid: data.type_guid,
      amount: data.amount,
      comment: data.comment || '',
      date: data.date,
    };

    const result = AccrualsDataManager.update(
      updateData,
      mockEmployees,
      mockAccrualTypes
    );

    dataVersion++;
  }

  function handleDeleteAccrual(accrualGuid) {
    const success = AccrualsDataManager.delete(accrualGuid);

    if (success) {
      dataVersion++;
    } else {
      console.error('Failed to delete accrual: not found');
    }
  }

  function resetFilters() {
    searchTerm = '';
    selectedEmployee = '';
    selectedType = '';
  }

  function handleFormSubmit(data) {
    const currentAccrual = accrualFormStore.getCurrentAccrual();

    if (currentAccrual) {
      handleUpdateAccrual(data);
    } else {
      handleAddAccrual(data);
    }
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }) +
      ' г. в ' +
      date.toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
      })
    );
  }

  function formatStatValue(value, format, currency) {
    if (format === 'currency' && currency) {
      return `${value || 0} ${currency}`;
    }
    return String(value || '0');
  }
</script>

<div class="space-y-6">
  <!-- Карточки статистики -->
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
    {#each statisticsCards as card}
      <StatCard
        title={card.title}
        value={formatStatValue(
          statisticsValues()[card.valueKey],
          card.format,
          card.currency
        )}
        subtitle={card.subtitle}
        icon={card.icon}
        color={card.color}
      />
    {/each}
  </div>

  <!-- Заголовок и поиск -->
  <div class="bg-white rounded-lg shadow-sm border border-gray-200">
    <div
      class="px-6 py-4 border-b border-gray-200 flex justify-between items-center"
    >
      <h1 class="text-xl font-semibold text-gray-900">Начисления АммоКоинов</h1>
      <button
        onclick={() => {
          accrualFormStore.openForCreate();
        }}
        class="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
      >
        <svg
          class="h-4 w-4 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
        Добавить начисление
      </button>
    </div>

    <div class="p-6">
      <div class="flex flex-col lg:flex-row lg:items-center gap-4">
        <div class="flex-1">
          <div class="relative">
            <svg
              class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Поиск по сотруднику, типу, коммент"
              bind:value={searchTerm}
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div class="flex flex-wrap gap-3">
          <select
            bind:value={selectedEmployee}
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[200px]"
          >
            <option value="">Все сотрудники ({uniqueEmployees.length})</option>
            {#each uniqueEmployees() as employee}
              <option value={employee}>{employee}</option>
            {/each}
          </select>

          <select
            bind:value={selectedType}
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[200px]"
          >
            <option value="">Все типы ({uniqueTypes.length})</option>
            {#each uniqueTypes() as type}
              <option value={type}>{type}</option>
            {/each}
          </select>

          <select
            bind:value={sortOrder}
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="newest">От новых к старым</option>
            <option value="oldest">От старых к новым</option>
          </select>
        </div>
      </div>

      <!-- Статистика по фильтрам -->
      <div class="mt-4 text-sm text-gray-600">
        Всего: <span class="font-semibold"
          >{filteredAccruals.length} начислений</span
        >
      </div>
    </div>
  </div>

  <!-- Список начислений -->
  <div class="space-y-3">
    {#each filteredAccruals() as accrual}
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div class="flex-shrink-0">
              <div
                class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center"
              >
                <span class="text-sm font-medium text-gray-600">
                  {accrual.employee_name?.charAt(0) || '?'}
                </span>
              </div>
            </div>
            <div class="flex-1">
              <h3 class="text-sm font-medium text-gray-900">
                {accrual.employee_name}
              </h3>
              <p class="text-sm text-gray-500">{accrual.type_name}</p>
              <div class="flex items-center mt-1 text-xs text-gray-400">
                <svg
                  class="h-3 w-3 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {formatDate(accrual.datecreate)}
              </div>
            </div>
          </div>

          <div class="flex items-center space-x-3">
            <span
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-900 text-white"
            >
              {accrual.amount} AK
            </span>
            <div class="flex space-x-2">
              <button
                onclick={() => handleEditAccrual(accrual)}
                class="text-gray-400 hover:text-gray-600"
                title="Редактировать"
                aria-label="Редактировать начисление"
              >
                <svg
                  class="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
              <button
                onclick={() => handleDeleteAccrual(accrual.post_guid)}
                class="text-gray-400 hover:text-red-600"
                title="Удалить"
                aria-label="Удалить начисление"
              >
                <svg
                  class="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    {/each}

    {#if filteredAccruals().length === 0}
      <div
        class="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200"
      >
        <div class="text-gray-400 text-4xl mb-4">📝</div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">
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

<!-- Модальная форма -->
<AccrualForm onSubmit={handleFormSubmit} />
