<script lang="ts">
  import EmployeeCard from './EmployeeCard.svelte';
  import { apiEmployeesData } from './employeesMockData';
  import { mockDepartments } from '$lib/data/mockData';
  import type { EmployeeWithDetails } from '$lib/types';
  import {
    ChevronLeft,
    ChevronRight,
    RefreshCcw,
    Search,
    X,
  } from '@lucide/svelte';

  // Состояние компонента
  let searchTerm = $state('');
  let selectedDepartment = $state('');
  let activeOnly = $state(false);
  let showDetailModal = $state(false);
  let selectedEmployee = $state<EmployeeWithDetails | null>(null);
  let isLoading = $state(false);
  let apiEmployees = $state<any[]>([]);

  // Пагинация
  let currentPage = $state(1);
  let itemsPerPage = $state(6);

  // Имитация API запроса
  async function fetchEmployees() {
    if (isLoading) return; // Предотвращаем множественные вызовы

    isLoading = true;
    try {
      // Симуляция задержки API
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Обогащение данных из API
      const enrichedData = apiEmployeesData.map((employee) => {
        const department = mockDepartments.find(
          (dept) => dept.department_guid === employee.department_guid
        );
        return {
          ...employee,
          department_name:
            department?.department || 'Неизвестное подразделение',
          position_name:
            employee.sex === 'Мужской'
              ? 'Старший мастер по ремонту и обслуживанию оборудования'
              : 'Специалист по договорной работе',
          balance: generateRandomBalance(),
        };
      });

      apiEmployees = enrichedData;
    } catch (error) {
      apiEmployees = [];
    } finally {
      isLoading = false;
    }
  }

  // Генерация случайного баланса АммоКоинов
  function generateRandomBalance() {
    return Math.floor(Math.random() * 50000) + 1000;
  }

  // Загрузка данных при инициализации
  $effect(() => {
    if (apiEmployees.length === 0) {
      fetchEmployees();
    }
  });

  // Подсчет общей статистики
  let totalEmployees = $derived(apiEmployees.length);

  // Фильтрация сотрудников
  let filteredEmployees = $derived.by(() => {
    const filtered = apiEmployees.filter((employee) => {
      // Фильтр по активности
      if (activeOnly && employee.datedismis) {
        return false;
      }

      // Фильтр по подразделению
      if (
        selectedDepartment &&
        employee.department_guid !== selectedDepartment
      ) {
        return false;
      }

      // Поиск по тексту
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          employee.employee.toLowerCase().includes(searchLower) ||
          employee.ident.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (employee.email &&
            employee.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
          employee.department_name
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        );
      }

      return true;
    });

    return filtered;
  });

  // Пагинация
  let totalPages = $derived(Math.ceil(filteredEmployees.length / itemsPerPage));

  // Данные для текущей страницы
  let paginatedEmployees = $derived.by(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredEmployees.slice(startIndex, endIndex);
  });

  // Сброс страницы при изменении фильтров
  $effect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      currentPage = 1;
    }
  });

  // Функции
  function openEmployeeDetail(employee) {
    selectedEmployee = employee;
    showDetailModal = true;
  }

  function closeModal() {
    showDetailModal = false;
    selectedEmployee = null;
  }

  function formatDate(dateStr) {
    if (!dateStr) return '';
    try {
      const [day, month, year] = dateStr.split('.');
      return `${day}.${month}.${year}`;
    } catch {
      return dateStr;
    }
  }

  function getStatusBadge(employee) {
    return employee.datedismis ? 'Уволен' : 'Активен';
  }

  // Обновление данных
  function refreshData() {
    fetchEmployees();
  }

  // Функции пагинации

  function nextPage() {
    if (currentPage < totalPages) {
      currentPage++;
    }
  }

  function prevPage() {
    if (currentPage > 1) {
      currentPage--;
    }
  }
</script>

<!-- Заголовок страницы -->
<div class="mb-6">
  <h1 class="text-2xl font-bold text-gray-900">Сотрудники</h1>
</div>

<!-- Панель поиска, фильтров и пагинации -->
<div class="bg-white rounded-lg shadow-sm p-4 mb-6">
  <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
    <!-- Поиск -->
    <div class="relative">
      <div
        class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
      >
        <Search class="h-4 w-4 text-gray-400" />
      </div>
      <input
        type="text"
        bind:value={searchTerm}
        placeholder="Поиск по имени, email, ID, подразделению, должности..."
        class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>

    <!-- Фильтр по подразделению -->
    <div>
      <select
        bind:value={selectedDepartment}
        class="block w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">Все подразделения ({mockDepartments.length})</option>
        {#each mockDepartments as dept}
          <option value={dept.department_guid}>{dept.department}</option>
        {/each}
      </select>
    </div>

    <!-- Статус активности -->
    <div class="flex items-center">
      <input
        type="checkbox"
        id="activeOnly"
        bind:checked={activeOnly}
        class="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
      />
      <label for="activeOnly" class="ml-2 text-sm text-gray-700">
        Только активные
      </label>
    </div>

    <!-- Кнопка обновить -->
    <div class="flex justify-end">
      <button
        type="button"
        class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        onclick={refreshData}
        disabled={isLoading}
      >
        <RefreshCcw class="h-4 w-4 mr-2 {isLoading ? 'animate-spin' : ''}" />
        {isLoading ? 'Загрузка...' : 'Обновить'}
      </button>
    </div>
  </div>

  <!-- Информация о количестве и пагинация -->
  <div
    class="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-gray-200"
  >
    <!-- Информация о количестве -->
    <div class="text-sm text-gray-600 mb-3 sm:mb-0">
      Найдено: {filteredEmployees.length} из {totalEmployees} сотрудников • Страница
      {currentPage} из {totalPages} • Показано
      {paginatedEmployees.length}
    </div>

    <!-- Пагинация -->
    {#if filteredEmployees.length > 0 && totalPages > 1}
      <div class="flex items-center space-x-2">
        <button
          onclick={prevPage}
          disabled={currentPage === 1}
          class="inline-flex items-center px-2 py-1 border border-gray-300 rounded text-sm text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft class="h-4 w-4" />
          Назад
        </button>

        <span class="text-sm text-gray-700 mr-2">
          {currentPage} / {totalPages}
        </span>

        <button
          onclick={nextPage}
          disabled={currentPage === totalPages}
          class="inline-flex items-center px-2 py-1 border border-gray-300 rounded text-sm text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Вперед
          <ChevronRight class="h-4 w-4" />
        </button>
      </div>
    {/if}
  </div>
</div>

<!-- Сетка карточек сотрудников -->
{#if isLoading}
  <div class="flex flex-col items-center justify-center py-12">
    <div class="mb-4">
      <RefreshCcw class="animate-spin h-8 w-8 text-blue-600" />
    </div>
    <p class="text-gray-600 text-sm">Загрузка сотрудников...</p>
  </div>
{:else}
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {#each paginatedEmployees as employee}
      <EmployeeCard {employee} onDetailClick={openEmployeeDetail} />
    {/each}
  </div>

  <!-- Если нет результатов -->
  {#if filteredEmployees.length === 0 && !isLoading}
    <div class="text-center py-12">
      <div class="text-gray-500 mb-2">Сотрудники не найдены</div>
      <div class="text-sm text-gray-400">
        Попробуйте изменить фильтры поиска
      </div>
    </div>
  {/if}
{/if}

<!-- Модальное окно с деталями сотрудника -->
{#if showDetailModal && selectedEmployee}
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <div
      class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
    >
      <!-- Фон -->
      <div class="fixed inset-0 transition-opacity">
        <div
          class="absolute inset-0 bg-gray-500 opacity-75"
          onclick={closeModal}
        ></div>
      </div>

      <!-- Центрирование -->
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen"
        >&#8203;</span
      >

      <!-- Модальное окно -->
      <div
        class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
      >
        <!-- Заголовок -->
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg leading-6 font-medium text-gray-900">
              {selectedEmployee.employee}
            </h3>
            <button
              onclick={closeModal}
              class="text-gray-400 hover:text-gray-500"
            >
              <X class="h-6 w-6" />
            </button>
          </div>

          <!-- Контент -->
          <div class="space-y-4">
            <!-- Аватар и основная информация -->
            <div class="flex items-center space-x-4">
              <div class="flex-shrink-0 h-16 w-16">
                <div
                  class="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center"
                >
                  <span class="text-xl font-medium text-blue-700">
                    {selectedEmployee.employee
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .substring(0, 2)}
                  </span>
                </div>
              </div>
              <div>
                <h4 class="text-lg font-medium text-gray-900">
                  {selectedEmployee.employee}
                </h4>
                <p class="text-sm text-gray-500">
                  ID: {selectedEmployee.ident}
                </p>
                <p class="text-sm">
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {selectedEmployee.datedismis
                      ? 'bg-red-100 text-red-800'
                      : 'bg-green-100 text-green-800'}"
                  >
                    {getStatusBadge(selectedEmployee)}
                  </span>
                </p>
              </div>
            </div>

            <!-- Детальная информация -->
            <div class="grid grid-cols-1 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-500"
                  >ID сотрудника</label
                >
                <p class="mt-1 text-sm text-gray-900 font-mono">
                  {selectedEmployee.ident}
                </p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-500"
                  >Баланс АммоКоинов</label
                >
                <p class="mt-1 text-sm text-gray-900 font-mono">
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800"
                  >
                    {selectedEmployee.balance.toLocaleString()} АК
                  </span>
                </p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-500"
                  >Подразделение</label
                >
                <p class="mt-1 text-sm text-gray-900">
                  {selectedEmployee.department_name}
                </p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-500"
                  >Должность</label
                >
                <p class="mt-1 text-sm text-gray-900">
                  {selectedEmployee.sex === 'Мужской'
                    ? 'Старший мастер по ремонту и обслуживанию оборудования'
                    : 'Специалист по договорной работе'}
                </p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-500"
                  >Email</label
                >
                <p class="mt-1 text-sm text-gray-900">
                  {selectedEmployee.email || 'Не указан'}
                </p>
                <p
                  class="mt-1 text-sm text-blue-600 cursor-pointer hover:underline"
                >
                  {selectedEmployee.email
                    ? `${selectedEmployee.email.split('@')[0]}@ammoni.ru`
                    : ''}
                </p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-500"
                  >Пол</label
                >
                <p class="mt-1 text-sm text-gray-900">{selectedEmployee.sex}</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-500"
                  >Дата приема</label
                >
                <p class="mt-1 text-sm text-gray-900">
                  {formatDate(selectedEmployee.dateemploy)}
                </p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-500"
                  >Статус</label
                >
                <p class="mt-1 text-sm">
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {selectedEmployee.datedismis
                      ? 'bg-red-100 text-red-800'
                      : 'bg-green-100 text-green-800'}"
                  >
                    {getStatusBadge(selectedEmployee)}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Кнопки -->
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            onclick={() => openEmployeeDetail(selectedEmployee)}
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Начислить
          </button>
          <button
            onclick={closeModal}
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:w-auto sm:text-sm"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}
