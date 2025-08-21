<script lang="ts">
  import {
    Award,
    Coins,
    Building2,
    Briefcase,
    Calendar,
    Mail,
  } from '@lucide/svelte';

  import { formatDate, getInitials } from '$lib/utils';

  import IconRow from '$lib/components/UI/IconRow.svelte';

  import type { EmployeeWithDetails } from '$lib/types';

  type Props = {
    employee: EmployeeWithDetails;
    onDetailClick: (employee: EmployeeWithDetails) => void;
  };

  let { employee, onDetailClick }: Props = $props();

  function getStatusBadge(employee) {
    return employee.datedismis ? 'Уволен' : 'Активен';
  }
</script>

<div
  class="rounded-lg p-4 border border-neutral-200 hover:shadow-md transition-shadow bg-primary-50"
>
  <!-- Верхняя строка с аватаром и кнопками -->
  <div class="flex items-start mb-1 gap-2">
    <div
      class="h-10 w-10 mb-5 flex items-center justify-center rounded-full bg-info-100"
    >
      <span class="title-sm font-medium text-info-700">
        {getInitials(employee.employee)}
      </span>
    </div>
    <div class="flex-1 max-w-40">
      <h3
        class="title-sm font-medium text-neutral-900 line-clamp-3 break-words"
      >
        {employee.employee}
      </h3>
    </div>
    <div class="flex-shrink-0 ml-auto">
      <!-- Статус и кнопка начислить -->
      <div class="flex flex-col md:flex-row items-end md:items-center gap-2">
        <span
          class="inline-flex items-center px-2 py-1 rounded-full font-medium whitespace-nowrap text-xs {employee.datedismis
            ? 'bg-danger-100 text-danger-700'
            : 'bg-success-100 text-success-700'}"
        >
          {getStatusBadge(employee)}
        </span>
        <button
          onclick={() => onDetailClick(employee)}
          class="inline-flex items-center px-2 py-1 border-2 border-success-100 font-normal rounded whitespace-nowrap text-success-700 text-xs"
        >
          <Award size={14} color={'#14814A'} />
          Начислить
        </button>
      </div>
    </div>
  </div>

  <!-- ID под блоком с аватаром и именем -->
  <div class="mb-3">
    <p class="title-xs text-neutral-500">ID: {employee.ident}</p>
  </div>

  <!-- Баланс -->
  <IconRow
    icon={Coins}
    title="Баланс: {employee.balance} АК"
    backgroundColor={'bg-neutral-100'}
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
      <div class="title-xs text-neutral-500">
        Пол: {employee.sex}
      </div>
    </div>
  </div>

  <!-- Кнопки действий -->
  <div class="flex justify-end items-center pt-3 border-t border-neutral-100">
    <button
      onclick={() => onDetailClick(employee)}
      class="text-info-600 hover:text-info-800 text-xs"
    >
      Подробнее
    </button>
  </div>
</div>
