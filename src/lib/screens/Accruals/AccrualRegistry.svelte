<script lang="ts">
  import AccrualForm from './AccrualForm.svelte';
  import StatCard from '$lib/components/UI/StatCard.svelte';
  import { statisticsCards, formatStatValue } from '$lib/data/statisticsData';
  import {
    mockEmployees,
    mockAccrualTypes,
    getDepartmentName,
  } from '$lib/data/mockData';

  // Состояние компонента
  let showForm = $state(false);
  let editingAccrual = $state(null);
  let searchTerm = $state('');
  let selectedEmployee = $state('');
  let selectedType = $state('');
  let sortOrder = $state('newest');

  // Генерируем тестовые начисления
  let accruals = $state([
    {
      org_guid: '8753101a-4fb8-11ed-9d6f-00155dd75c64',
      post_guid: 'accrual1',
      post: 'Тестовая награда 2',
      department_guid: '86253ef6-4e33-11ee-9d85-00155de8647c',
      datecreate: '27.07.2025',
      datedisband: '',
      employee_name: 'Абдуллина Наджия Маскутовна',
      type_name: 'Тестовая награда 2 (300 АК)',
      amount: 300,
      comment: '',
    },
    {
      org_guid: '8753101a-4fb8-11ed-9d6f-00155dd75c64',
      post_guid: 'accrual2',
      post: 'Тестовая награда 3',
      department_guid: '86253b1a-4e33-11ee-9d85-00155de8647c',
      datecreate: '27.07.2025',
      datedisband: '',
      employee_name: 'Абдулганеев Ильгизар Альфредович',
      type_name: 'Тестовая награда 3 (60 АК)',
      amount: 60,
      comment: 'За качественную работу',
    },
    {
      org_guid: '8753101a-4fb8-11ed-9d6f-00155dd75c64',
      post_guid: 'accrual3',
      post: 'Тестовая награда',
      department_guid: '86253ef6-4e33-11ee-9d85-00155de8647c',
      datecreate: '27.07.2025',
      datedisband: '',
      employee_name: 'Абдрахманов Ильшат Ришатович',
      type_name: 'Тестовая награда (100 АК)',
      amount: 100,
      comment: 'Специальная награда',
    },
    {
      org_guid: '8753101a-4fb8-11ed-9d6f-00155dd75c64',
      post_guid: 'accrual4',
      post: 'Премия за выслугу лет',
      department_guid: '86253e12-4e33-11ee-9d85-00155de8647c',
      datecreate: '26.07.2025',
      datedisband: '',
      employee_name: 'Колногорова Олеся Александровна',
      type_name: 'Премия за выслугу лет (500 АК)',
      amount: 500,
      comment: 'За 10 лет работы в компании',
    },
    {
      org_guid: '8753101a-4fb8-11ed-9d6f-00155dd75c64',
      post_guid: 'accrual5',
      post: 'Бонус за качественную работу',
      department_guid: '86253ef6-4e33-11ee-9d85-00155de8647c',
      datecreate: '25.07.2025',
      datedisband: '',
      employee_name: 'Макаров Дмитрий Юрьевич',
      type_name: 'Бонус за качественную работу (200 АК)',
      amount: 200,
      comment: 'За отличное выполнение проекта',
    },
  ]);

  // Фильтрация данных
  let filteredAccruals = $derived(() => {
    let filtered = accruals.filter((accrual) => {
      const matchesSearch =
        !searchTerm ||
        accrual.employee_name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        accrual.type_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        accrual.comment?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesEmployee =
        !selectedEmployee || accrual.employee_name === selectedEmployee;
      const matchesType = !selectedType || accrual.type_name === selectedType;

      return matchesSearch && matchesEmployee && matchesType;
    });

    // Сортировка
    if (sortOrder === 'newest') {
      filtered.sort(
        (a, b) =>
          new Date(b.datecreate).getTime() - new Date(a.datecreate).getTime()
      );
    } else {
      filtered.sort(
        (a, b) =>
          new Date(a.datecreate).getTime() - new Date(b.datecreate).getTime()
      );
    }

    return filtered;
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

  // Статистика - правильное использование $derived
  let totalEmployees = $derived(mockEmployees.length);

  let monthlyAccruals = $derived(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    return accruals.filter((accrual) => {
      const accrualDate = new Date(accrual.datecreate);
      return (
        accrualDate.getMonth() === currentMonth &&
        accrualDate.getFullYear() === currentYear
      );
    }).length;
  });

  let totalAccrualTypes = $derived(mockAccrualTypes.length);

  let totalAmount = $derived(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    return accruals
      .filter((accrual) => {
        const accrualDate = new Date(accrual.datecreate);
        return (
          accrualDate.getMonth() === currentMonth &&
          accrualDate.getFullYear() === currentYear
        );
      })
      .reduce((sum, accrual) => sum + (accrual.amount || 0), 0);
  });

  // Объект со всеми значениями статистики
  let statisticsValues = $derived({
    totalEmployees,
    monthlyAccruals: monthlyAccruals(),
    totalAccrualTypes,
    totalAmount: totalAmount(),
  });

  function handleAddAccrual(data) {
    const employee = mockEmployees.find(
      (e) => e.employee_guid === data.employee_guid
    );
    const type = mockAccrualTypes.find((t) => t.type_guid === data.type_guid);

    const newAccrual = {
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
    showForm = false;
  }

  function handleEditAccrual(accrual) {
    editingAccrual = accrual;
    showForm = true;
  }

  function handleUpdateAccrual(data) {
    if (!editingAccrual) return;

    const employee = mockEmployees.find(
      (e) => e.employee_guid === data.employee_guid
    );
    const type = mockAccrualTypes.find((t) => t.type_guid === data.type_guid);

    const updatedAccrual = {
      ...editingAccrual,
      employee_name: employee?.employee || '',
      type_name: type?.type_name || '',
      amount: data.amount,
      comment: data.comment || '',
    };

    accruals = accruals.map((acc) =>
      acc.post_guid === editingAccrual.post_guid ? updatedAccrual : acc
    );

    editingAccrual = null;
    showForm = false;
  }

  function handleDeleteAccrual(accrualGuid) {
    accruals = accruals.filter((acc) => acc.post_guid !== accrualGuid);
  }

  function resetFilters() {
    searchTerm = '';
    selectedEmployee = '';
    selectedType = '';
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
</script>

<div class="space-y-6">
  <!-- Карточки статистики -->
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
    {#each statisticsCards as card}
      <StatCard
        title={card.title}
        value={formatStatValue(
          statisticsValues[card.valueKey],
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
    <div class="px-6 py-4 border-b border-gray-200">
      <h1 class="text-xl font-semibold text-gray-900">Начисления АммоКоинов</h1>
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

          <button
            onclick={() => (showForm = true)}
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
            + Добавить начисление
          </button>
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

    {#if filteredAccruals.length === 0}
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
<AccrualForm
  bind:isOpen={showForm}
  {editingAccrual}
  onSubmit={editingAccrual ? handleUpdateAccrual : handleAddAccrual}
  onCancel={() => {
    showForm = false;
    editingAccrual = null;
  }}
/>
