<script lang="ts">
  import type { EmployeeWithDetails } from '$lib/types';

  type Props = {
    employee: EmployeeWithDetails;
  };

  let { employee }: Props = $props();

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

  function getInitials(fullName) {
    return fullName
      .split(' ')
      .map((name) => name[0])
      .join('')
      .substring(0, 2);
  }
</script>

<div class="space-y-6">
  <!-- Header with avatar and basic info -->
  <div class="flex items-start space-x-4">
    <div class="flex-shrink-0">
      <div
        class="h-16 w-16 rounded-full bg-info-100 flex items-center justify-center"
      >
        <span class="text-xl font-medium text-info-700">
          {getInitials(employee.employee)}
        </span>
      </div>
    </div>

    <div class="flex-1 min-w-0">
      <h2 class="text-xl font-semibold text-neutral-900 break-words">
        {employee.employee}
      </h2>
      <p class="text-sm text-neutral-500 mt-1">
        ID: {employee.ident}
      </p>
      <div class="mt-2">
        <span
          class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium {employee.datedismis
            ? 'bg-danger-100 text-danger-800'
            : 'bg-success-100 text-success-800'}"
        >
          {getStatusBadge(employee)}
        </span>
      </div>
    </div>
  </div>

  <!-- Details grid -->
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <!-- Personal Info -->
    <div>
      <h3 class="text-lg font-medium text-neutral-900 mb-4">
        Личная информация
      </h3>
      <div class="space-y-3">
        <div>
          <label class="block text-sm font-medium text-neutral-500">Пол</label>
          <p class="mt-1 text-sm text-neutral-900">{employee.sex}</p>
        </div>

        {#if employee.email}
          <div>
            <label class="block text-sm font-medium text-neutral-500"
              >Email</label
            >
            <p class="mt-1 text-sm text-neutral-900">{employee.email}</p>
          </div>
        {/if}
      </div>
    </div>

    <!-- Work Info -->
    <div>
      <h3 class="text-lg font-medium text-neutral-900 mb-4">
        Рабочая информация
      </h3>
      <div class="space-y-3">
        <div>
          <label class="block text-sm font-medium text-neutral-500"
            >Подразделение</label
          >
          <p class="mt-1 text-sm text-neutral-900">
            {employee.department_name}
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium text-neutral-500"
            >Должность</label
          >
          <p class="mt-1 text-sm text-neutral-900">{employee.position_name}</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-neutral-500"
            >Дата приема</label
          >
          <p class="mt-1 text-sm text-neutral-900">
            {formatDate(employee.dateemploy)}
          </p>
        </div>

        {#if employee.datedismis}
          <div>
            <label class="block text-sm font-medium text-neutral-500"
              >Дата увольнения</label
            >
            <p class="mt-1 text-sm text-neutral-900">
              {formatDate(employee.datedismis)}
            </p>
          </div>
        {/if}
      </div>
    </div>
  </div>

  <!-- Balance Section -->
  <div class="border-t border-neutral-200 pt-6">
    <h3 class="text-lg font-medium text-neutral-900 mb-4">Баланс АммоКоинов</h3>
    <div class="bg-neutral-100 rounded-lg p-4">
      <div class="flex items-center justify-between">
        <span class="text-sm text-neutral-600">Текущий баланс</span>
        <span class="text-2xl font-bold text-success-600"
          >{employee.balance} АК</span
        >
      </div>
    </div>
  </div>

  <!-- IDs Section -->
  <div class="border-t border-neutral-200 pt-6">
    <h3 class="text-lg font-medium text-neutral-900 mb-4">
      Системная информация
    </h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-neutral-500"
          >ID сотрудника</label
        >
        <p class="mt-1 text-sm text-neutral-900 font-mono">{employee.ident}</p>
      </div>

      <div>
        <label class="block text-sm font-medium text-neutral-500"
          >GUID сотрудника</label
        >
        <p class="mt-1 text-xs text-neutral-900 font-mono break-all">
          {employee.employee_guid}
        </p>
      </div>

      <div>
        <label class="block text-sm font-medium text-neutral-500"
          >GUID подразделения</label
        >
        <p class="mt-1 text-xs text-neutral-900 font-mono break-all">
          {employee.department_guid}
        </p>
      </div>

      <div>
        <label class="block text-sm font-medium text-neutral-500"
          >GUID должности</label
        >
        <p class="mt-1 text-xs text-neutral-900 font-mono break-all">
          {employee.post_guid}
        </p>
      </div>
    </div>
  </div>
</div>
