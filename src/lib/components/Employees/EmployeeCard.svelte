<script lang="ts">
  import IconRow from './IconRow.svelte';
  import {
    Award,
    Coins,
    Building2,
    Briefcase,
    Calendar,
    Mail,
  } from '@lucide/svelte';

  import type { EmployeeWithDetails } from '$lib/types';

  type Props = {
    employee: EmployeeWithDetails;
    onDetailClick: (employee: EmployeeWithDetails) => void;
  };

  let { employee, onDetailClick }: Props = $props();

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

<div
  class="rounded-lg p-4 hover:shadow-md transition-shadow bg-white border-gray-200"
>
  <!-- Верхняя строка с аватаром и кнопками -->
  <div class="flex items-start mb-1 gap-2">
    <div
      class="h-10 w-10 mb-5 flex items-center justify-center rounded-full bg-blue-100"
    >
      <span class="title-sm font-medium title-blue-700">
        {getInitials(employee.employee)}
      </span>
    </div>
    <div class="flex-1 max-w-40">
      <h3 class="title-sm font-medium title-gray-900 line-clamp-3 break-words">
        {employee.employee}
      </h3>
    </div>
    <div class="flex-shrink-0 ml-auto">
      <!-- Статус и кнопка начислить -->
      <div class="flex flex-col md:flex-row items-end md:items-center gap-2">
        <span
          class="inline-flex items-center px-2 py-1 rounded-full font-medium whitespace-nowrap text-xs {employee.datedismis
            ? 'bg-red-100 text-red-700'
            : 'bg-green-100 text-green-700'}"
        >
          {getStatusBadge(employee)}
        </span>
        <button
          onclick={() => onDetailClick(employee)}
          class="inline-flex items-center px-2 py-1 border-2 border-green-100 font-normal rounded whitespace-nowrap text-green-700 text-xs"
        >
          <Award size={14} color={'#15803d'} />
          Начислить
        </button>
      </div>
    </div>
  </div>

  <!-- ID под блоком с аватаром и именем -->
  <div class="mb-3">
    <p class="title-xs title-gray-500">ID: {employee.ident}</p>
  </div>

  <!-- Баланс -->
  <IconRow
    icon={Coins}
    title="Баланс: {employee.balance} АК"
    backgroundColor={'bg-gray-100'}
  />

  <!-- Подразделение -->
  <IconRow icon={Building2} title={employee.department_name} />

  <!-- Должность и другие детали -->
  <div class="mb-3">
    <IconRow icon={Briefcase} title={employee.position_name} />
    {#if employee.email}
      <IconRow icon={Mail} title={employee.email} />
    {/if}
    <IconRow
      icon={Calendar}
      title="Принят: {formatDate(employee.dateemploy)}"
    />
    <div class="mb-3">
      <div class="title-xs title-gray-500">
        Пол: {employee.sex}
      </div>
    </div>
  </div>

  <!-- Кнопки действий -->
  <div class="flex justify-end items-center pt-3 border-t border-gray-100">
    <button
      onclick={() => onDetailClick(employee)}
      class="title-blue-600 hover:title-blue-800 title-xs"
    >
      Подробнее
    </button>
  </div>
</div>
