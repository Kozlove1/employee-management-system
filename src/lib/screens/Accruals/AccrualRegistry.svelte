<script lang="ts">
  import {
    AccrualListItem,
    ActionButton,
    EmptyState,
    FilterSelect,
    IconRow,
    SearchInput,
    Skeleton,
    StatCard,
  } from '$lib/components/UI';
  import { mockEmployees } from '$lib/data/mockData';
  import { statisticsCards } from '$lib/data/statisticsData';
  import { accrualTypesStore } from '$lib/stores/accrualTypesStore.svelte';
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
  let isLoading = $state(true);

  // Имитация загрузки данных при первом рендере
  $effect(() => {
    if (isLoading) {
      // Имитируем задержку загрузки
      const timer = setTimeout(() => {
        isLoading = false;
      }, 1500);

      return () => clearTimeout(timer);
    }
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
      ? accrualTypesStore.types.find((t) => t.type_name === selectedType)
          ?.type_guid
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
    return accrualTypesStore.types.length;
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
      totalAmount: stats().monthlyAmount,
    };
    return values;
  });

  async function handleAddAccrual(data) {
    const createData: CreateAccrualData = {
      employee_guid: data.employee_guid,
      type_guid: data.type_guid,
      amount: data.amount,
      comment: data.comment || '',
      date: data.date,
    };

    AccrualsDataManager.create(
      createData,
      mockEmployees,
      accrualTypesStore.types
    );

    dataVersion++;
  }

  function handleEditAccrual(accrualToEdit) {
    accrualFormStore.openForEdit(accrualToEdit);
  }

  async function handleUpdateAccrual(data) {
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
      accrualTypesStore.types
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

  function handleEmployeeChange(value: string) {
    selectedEmployee = value;
  }

  function handleTypeChange(value: string) {
    selectedType = value;
  }

  function handleSortOrderChange(value: string) {
    sortOrder = value;
  }

  function handleFormSubmit(data) {
    const currentAccrual = accrualFormStore.getCurrentAccrual();

    if (currentAccrual) {
      handleUpdateAccrual(data);
    } else {
      handleAddAccrual(data);
    }
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
    {#if isLoading}
      <Skeleton type="stat-card" count={4} />
    {:else}
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
    {/if}
  </div>

  <!-- Заголовок и поиск -->
  <div class="bg-white rounded-lg shadow-sm border border-gray-200">
    <div
      class="px-6 py-4 border-b border-gray-200 flex justify-between items-center"
    >
      <IconRow
        title="Начисления АммоКоинов"
        icon={'coins'}
        titleSize="2xl"
        titleColor="text-neutral-900"
        iconSize="xl"
        iconColor="blue"
      />
      <ActionButton
        onClick={() => {
          accrualFormStore.openForCreate();
        }}
        disabled={isLoading}
        text="Добавить начисление"
      />
    </div>

    <div class="p-6">
      {#if isLoading}
        <Skeleton type="search-filters" />
      {:else}
        <div class="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <!-- Поисковая строка -->
          <div class="lg:col-span-2">
            <SearchInput
              value={searchTerm}
              placeholder="Поиск по сотруднику, типу, комментарию"
              bgColor="bg-white"
              borderColor="border-gray-300"
              rounded="rounded-lg"
              onChange={(value) => (searchTerm = value)}
            />
          </div>

          <!-- Селектор сотрудников -->
          <FilterSelect
            value={selectedEmployee}
            options={[
              {
                value: '',
                label: `Все сотрудники (${uniqueEmployees().length})`,
              },
              ...uniqueEmployees().map((employee) => ({
                value: employee,
                label: employee,
              })),
            ]}
            onChange={handleEmployeeChange}
          />

          <!-- Селектор типов -->
          <FilterSelect
            value={selectedType}
            options={[
              { value: '', label: `Все типы (${uniqueTypes().length})` },
              ...uniqueTypes().map((type) => ({ value: type, label: type })),
            ]}
            onChange={handleTypeChange}
          />

          <!-- Селектор сортировки -->
          <FilterSelect
            value={sortOrder}
            options={[
              { value: 'newest', label: 'От новых к старым' },
              { value: 'oldest', label: 'От старым к новым' },
            ]}
            onChange={handleSortOrderChange}
          />
        </div>

        <!-- Статистика по фильтрам -->
        <div class="mt-4 text-sm text-gray-600">
          Всего: <span class="font-semibold"
            >{filteredAccruals().length} начислений</span
          >
        </div>
      {/if}
    </div>
  </div>

  <!-- Список начислений -->
  <div class="space-y-3">
    {#if isLoading}
      <Skeleton type="list-item" count={5} />
    {:else}
      {#each filteredAccruals() as accrual}
        <AccrualListItem
          {accrual}
          onEdit={handleEditAccrual}
          onDelete={handleDeleteAccrual}
        />
      {/each}

      {#if filteredAccruals().length === 0}
        <EmptyState
          showButton={true}
          buttonText="Добавить начисление"
          buttonAction={() => accrualFormStore.openForCreate()}
          title="Нет начислений"
          description="Начните с добавления первого начисления"
          disabled={isLoading}
        />
      {/if}
    {/if}
  </div>
</div>

<!-- Модальная форма -->
<AccrualForm onSubmit={handleFormSubmit} />
