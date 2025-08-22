<script lang="ts">
  import {
    Users,
    Building2,
    Coins,
    TrendingUp,
    Award,
    BarChart3,
  } from '@lucide/svelte';
  import {
    getTopEmployeesByBalance,
    mockEmployees,
    mockDepartments,
    getDepartmentName,
  } from '$lib/data/mockData';
  import type { DepartmentStats, EmployeeStats } from '$lib/types';

  // Генерируем статистику
  let topEmployees = $state<EmployeeStats[]>(
    getTopEmployeesByBalance(10).map((emp) => ({
      employee_guid: emp.employee_guid,
      employee_name: emp.employee,
      ident: emp.ident,
      total_balance: emp.balance || 0,
      department_name: emp.department_name || '',
    }))
  );

  // Статистика по подразделениям
  let departmentStats = $state<DepartmentStats[]>(
    mockDepartments
      .map((dept) => {
        const deptEmployees = mockEmployees.filter(
          (emp) => emp.department_guid === dept.department_guid
        );
        const deptTop = getTopEmployeesByBalance().filter(
          (emp) => emp.department_guid === dept.department_guid
        );
        const totalBalance = deptTop.reduce(
          (sum, emp) => sum + (emp.balance || 0),
          0
        );

        return {
          department_guid: dept.department_guid,
          department_name: dept.department,
          total_employees: deptEmployees.length,
          total_accruals: Math.floor(Math.random() * 50) + 10, // Случайное число для демонстрации
          average_balance:
            deptEmployees.length > 0
              ? Math.round(totalBalance / deptEmployees.length)
              : 0,
        };
      })
      .sort((a, b) => b.average_balance - a.average_balance)
  );

  // Общая статистика
  let totalEmployeesCount = $derived(mockEmployees.length);
  let totalActiveEmployees = $derived(
    mockEmployees.filter((emp) => !emp.datedismis).length
  );
  let totalDepartments = $derived(mockDepartments.length);
  let totalBalance = $derived(() =>
    topEmployees.reduce((sum, emp) => sum + emp.total_balance, 0)
  );
  let averageBalance = $derived(() =>
    totalEmployeesCount > 0
      ? Math.round(totalBalance() / totalEmployeesCount)
      : 0
  );

  // Показать только топ-3 для краткого обзора
  let top3Employees = $derived(topEmployees.slice(0, 3));
  let top3Departments = $derived(departmentStats.slice(0, 3));
</script>

<div class="space-y-6">
  <!-- Заголовок -->
  <div>
    <h1 class="text-2xl font-bold text-neutral-900">Статистика</h1>
    <p class="mt-1 text-sm text-neutral-500">
      Аналитика по начислениям и балансам АммоКоинов
    </p>
  </div>

  <!-- Общие метрики -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <div class="card p-6">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <Icon name="users" class="h-8 w-8 text-primary-600" />
        </div>
        <div class="ml-5 w-0 flex-1">
          <dl>
            <dt class="text-sm font-medium text-gray-500 truncate">
              Всего сотрудников
            </dt>
            <dd class="text-2xl font-bold text-gray-900">
              {totalEmployeesCount.toLocaleString()}
            </dd>
          </dl>
        </div>
      </div>
      <div class="mt-4">
        <div class="text-sm text-gray-600">
          Активных: <span class="font-medium text-green-600"
            >{totalActiveEmployees}</span
          >
        </div>
      </div>
    </div>

    <div class="card p-6">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <Icon name="building2" class="h-8 w-8 text-blue-600" />
        </div>
        <div class="ml-5 w-0 flex-1">
          <dl>
            <dt class="text-sm font-medium text-gray-500 truncate">
              Подразделений
            </dt>
            <dd class="text-2xl font-bold text-gray-900">
              {totalDepartments}
            </dd>
          </dl>
        </div>
      </div>
      <div class="mt-4">
        <div class="text-sm text-gray-600">Все активные</div>
      </div>
    </div>

    <div class="card p-6">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <Icon name="award" class="h-8 w-8 text-yellow-600" />
        </div>
        <div class="ml-5 w-0 flex-1">
          <dl>
            <dt class="text-sm font-medium text-gray-500 truncate">
              Общий баланс
            </dt>
            <dd class="text-2xl font-bold text-gray-900">
              {totalBalance.toLocaleString()} АК
            </dd>
          </dl>
        </div>
      </div>
      <div class="mt-4">
        <div class="text-sm text-gray-600">На всех счетах</div>
      </div>
    </div>

    <div class="card p-6">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <Icon name="trendingUp" class="h-8 w-8 text-green-600" />
        </div>
        <div class="ml-5 w-0 flex-1">
          <dl>
            <dt class="text-sm font-medium text-gray-500 truncate">
              Средний баланс
            </dt>
            <dd class="text-2xl font-bold text-gray-900">
              {averageBalance.toLocaleString()} АК
            </dd>
          </dl>
        </div>
      </div>
      <div class="mt-4">
        <div class="text-sm text-gray-600">На сотрудника</div>
      </div>
    </div>
  </div>

  <!-- Топ сотрудников и подразделений -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <!-- Топ-10 сотрудников по балансу АммоКоинов -->
    <div class="card">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-900 flex items-center">
          <Icon name="crown" class="h-5 w-5 text-yellow-500 mr-2" />
          Топ-10 сотрудников по балансу АммоКоинов
        </h3>
      </div>
      <div class="divide-y divide-gray-200">
        {#each topEmployees as employee, index}
          <div class="px-6 py-4 hover:bg-gray-50">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <div class="flex-shrink-0">
                  <div
                    class="h-8 w-8 rounded-full flex items-center justify-center {index ===
                    0
                      ? 'bg-yellow-100 text-yellow-800'
                      : index === 1
                        ? 'bg-gray-100 text-gray-800'
                        : index === 2
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-gray-50 text-gray-600'}"
                  >
                    <span class="text-sm font-bold">
                      {index + 1}
                    </span>
                  </div>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900">
                    {employee.employee_name}
                  </p>
                  <p class="text-sm text-gray-500">
                    {employee.ident} • {employee.department_name}
                  </p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-sm font-bold text-gray-900 flex items-center">
                  <Icon name="award" class="h-4 w-4 text-yellow-500 mr-1" />
                  {employee.total_balance.toLocaleString()} АК
                </p>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>

    <!-- Статистика по подразделениям -->
    <div class="card">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-900 flex items-center">
          <Icon name="building2" class="h-5 w-5 text-blue-500 mr-2" />
          Статистика по подразделениям
        </h3>
      </div>
      <div class="divide-y divide-gray-200">
        {#each departmentStats as dept, index}
          <div class="px-6 py-4 hover:bg-gray-50">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <div class="flex-shrink-0">
                  <div
                    class="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center"
                  >
                    <span class="text-sm font-bold text-blue-600">
                      {index + 1}
                    </span>
                  </div>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900">
                    {dept.department_name}
                  </p>
                  <p class="text-sm text-gray-500">
                    {dept.total_employees} сотрудников
                  </p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-sm font-bold text-gray-900">
                  ⌀ {dept.average_balance.toLocaleString()} АК
                </p>
                <p class="text-sm text-gray-500">
                  {dept.total_accruals} начислений
                </p>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>

  <!-- Детальная таблица топ сотрудников -->
  <div class="card">
    <div class="px-6 py-4 border-b border-gray-200">
      <h3 class="text-lg font-medium text-gray-900">
        Детальная таблица лидеров
      </h3>
      <p class="mt-1 text-sm text-gray-500">
        Полная информация о сотрудниках с наибольшими балансами
      </p>
    </div>

    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Позиция
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Сотрудник
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              ID
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Подразделение
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Баланс АК
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          {#each topEmployees as employee, index}
            <tr class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div
                    class="h-6 w-6 rounded-full flex items-center justify-center {index ===
                    0
                      ? 'bg-yellow-100 text-yellow-800'
                      : index === 1
                        ? 'bg-gray-100 text-gray-800'
                        : index === 2
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-gray-50 text-gray-600'}"
                  >
                    <span class="text-xs font-bold">
                      {index + 1}
                    </span>
                  </div>
                  {#if index < 3}
                    <Icon
                      name="crown"
                      class="h-4 w-4 ml-2 {index === 0
                        ? 'text-yellow-500'
                        : index === 1
                          ? 'text-gray-400'
                          : 'text-orange-400'}"
                    />
                  {/if}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">
                  {employee.employee_name}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm text-gray-900 font-mono">
                  {employee.ident}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  {employee.department_name}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center text-sm font-bold text-gray-900">
                  <Icon name="award" class="h-4 w-4 text-yellow-500 mr-1" />
                  {employee.total_balance.toLocaleString()} АК
                </div>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</div>
