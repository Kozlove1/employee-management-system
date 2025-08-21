<script>
  import '../app.css';
  import { appState } from '$lib/stores/appStore.svelte';
  import SimpleNavbar from '$lib/components/Layout/SimpleNavbar.svelte';
</script>

<div class="min-h-screen bg-neutral-50">
  <SimpleNavbar />

  <main class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
    {#if appState.currentView === 'accruals'}
      <div class="text-center py-12">
        <h2 class="text-3xl font-bold text-neutral-900 mb-4">
          🏆 Начисления АммоКоинов
        </h2>
        <p class="text-neutral-600 mb-8">
          Система управления бонусными начислениями сотрудникам
        </p>
        <div
          class="bg-primary-50 p-8 rounded-lg shadow-sm max-w-2xl mx-auto border border-neutral-200"
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
    {:else if appState.currentView === 'employees'}
      <!-- Импортируем компонент реестра сотрудников -->
      {#await import('$lib/components/Employees/EmployeeRegistry.svelte')}
        <div class="flex justify-center items-center py-12">
          <div class="text-center">
            <div
              class="animate-spin rounded-full h-8 w-8 border-b-2 border-info-500 mx-auto mb-2"
            ></div>
            <p class="text-neutral-600">Загрузка...</p>
          </div>
        </div>
      {:then module}
        {@const EmployeeRegistry = module.default}
        <EmployeeRegistry />
      {:catch error}
        <div class="text-center py-12">
          <div
            class="bg-danger-50 border border-danger-200 rounded-lg p-4 max-w-md mx-auto"
          >
            <p class="text-danger-800">Ошибка загрузки: {error.message}</p>
          </div>
        </div>
      {/await}
    {:else if appState.currentView === 'departments'}
      <div class="text-center py-12">
        <h2 class="text-3xl font-bold text-neutral-900 mb-4">
          🏢 Подразделения
        </h2>
        <p class="text-neutral-600 mb-8">Организационная структура компании</p>
        <div
          class="bg-primary-50 p-8 rounded-lg shadow-sm max-w-2xl mx-auto border border-neutral-200"
        >
          <h3 class="text-xl font-semibold mb-4 text-neutral-900">
            Возможности:
          </h3>
          <ul class="text-left space-y-2 text-neutral-700">
            <li>✅ Просмотр всех подразделений</li>
            <li>✅ Информация о руководителях</li>
            <li>✅ Количество сотрудников в каждом подразделении</li>
            <li>✅ Статус активности подразделений</li>
          </ul>
        </div>
      </div>
    {:else if appState.currentView === 'positions'}
      <div class="text-center py-12">
        <h2 class="text-3xl font-bold text-neutral-900 mb-4">💼 Должности</h2>
        <p class="text-neutral-600 mb-8">
          Справочник должностей по подразделениям
        </p>
        <div
          class="bg-primary-50 p-8 rounded-lg shadow-sm max-w-2xl mx-auto border border-neutral-200"
        >
          <h3 class="text-xl font-semibold mb-4 text-neutral-900">
            Особенности:
          </h3>
          <ul class="text-left space-y-2 text-neutral-700">
            <li>✅ Справочник должностей по подразделениям</li>
            <li>✅ Связи между должностями и подразделениями</li>
            <li>✅ Количество сотрудников на каждой должности</li>
            <li>✅ Удобная группировка по отделам</li>
          </ul>
        </div>
      </div>
    {:else if appState.currentView === 'statistics'}
      <div class="text-center py-12">
        <h2 class="text-3xl font-bold text-neutral-900 mb-4">📊 Статистика</h2>
        <p class="text-neutral-600 mb-8">
          Аналитика по начислениям и балансам АммоКоинов
        </p>

        <!-- Общие метрики -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div
            class="bg-primary-50 p-6 rounded-lg shadow-sm border border-neutral-200"
          >
            <div class="text-3xl font-bold text-info-500">1,601</div>
            <div class="text-sm text-neutral-600">Всего сотрудников</div>
          </div>
          <div
            class="bg-primary-50 p-6 rounded-lg shadow-sm border border-neutral-200"
          >
            <div class="text-3xl font-bold text-info-500">3</div>
            <div class="text-sm text-neutral-600">Подразделений</div>
          </div>
          <div
            class="bg-primary-50 p-6 rounded-lg shadow-sm border border-neutral-200"
          >
            <div class="text-3xl font-bold text-warning-500">156,750</div>
            <div class="text-sm text-neutral-600">Общий баланс АК</div>
          </div>
          <div
            class="bg-primary-50 p-6 rounded-lg shadow-sm border border-neutral-200"
          >
            <div class="text-3xl font-bold text-success-500">4,250</div>
            <div class="text-sm text-neutral-600">Средний баланс АК</div>
          </div>
        </div>

        <!-- Топ сотрудников -->
        <div
          class="bg-primary-50 p-8 rounded-lg shadow-sm max-w-4xl mx-auto border border-neutral-200"
        >
          <h3 class="text-xl font-semibold mb-6 text-neutral-900">
            🏆 Топ-10 сотрудников по балансу АммоКоинов
          </h3>
          <div class="space-y-4">
            <div
              class="flex justify-between items-center p-4 bg-warning-50 rounded-lg border border-warning-200"
            >
              <div class="flex items-center">
                <span class="text-2xl mr-3">🥇</span>
                <div>
                  <div class="font-medium text-neutral-900">
                    Колногорова Олеся Александровна
                  </div>
                  <div class="text-sm text-neutral-500">0000-00283</div>
                </div>
              </div>
              <div class="text-xl font-bold text-warning-500">7,000 АК</div>
            </div>
            <div
              class="flex justify-between items-center p-4 bg-neutral-100 rounded-lg border border-neutral-200"
            >
              <div class="flex items-center">
                <span class="text-2xl mr-3">🥈</span>
                <div>
                  <div class="font-medium text-neutral-900">
                    Макаров Дмитрий Юрьевич
                  </div>
                  <div class="text-sm text-neutral-500">0000-00158</div>
                </div>
              </div>
              <div class="text-xl font-bold text-neutral-600">5,000 АК</div>
            </div>
            <div
              class="flex justify-between items-center p-4 bg-success-50 rounded-lg border border-success-200"
            >
              <div class="flex items-center">
                <span class="text-2xl mr-3">🥉</span>
                <div>
                  <div class="font-medium text-neutral-900">
                    Разбойкин Юрий Павлович
                  </div>
                  <div class="text-sm text-neutral-500">0000-00140</div>
                </div>
              </div>
              <div class="text-xl font-bold text-success-500">4,000 АК</div>
            </div>
          </div>
        </div>
      </div>
    {/if}
  </main>
</div>
