<script lang="ts">
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
      class="h-10 w-10 mb-5 px-3 flex items-center justify-center rounded-full bg-info-100"
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
      <!-- Status and award button -->
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
          class="btn inline-flex items-center px-1 my-0 border-2 border-success-100 font-normal rounded-lg whitespace-nowrap text-success-700"
        >
          <IconRow
            icon="award"
            iconSize="m"
            title="Начислить"
            titleColor="text-success-700"
            titleSize="s"
            gapSize="s"
          />
        </button>
      </div>
    </div>
  </div>

  <!-- ID -->
  <div class="mb-3">
    <p class="title-xs text-neutral-500">ID: {employee.ident}</p>
  </div>

  <!-- Balance -->
  <IconRow
    icon="coins"
    title="Баланс: {employee.balance} АК"
    titleColor="text-neutral-900"
    backgroundColor={'bg-neutral-100'}
  />

  <!-- Department -->
  <IconRow icon="building" title={employee.department_name} />

  <!-- Position and other details -->
  <div class="mb-3">
    <IconRow icon="briefcase" title={employee.position_name} />
    {#if employee.email}
      <IconRow icon="mail" title={employee.email} />
    {/if}
    <IconRow
      icon="calendar"
      title="Принят: {formatDate(employee.dateemploy)}"
    />
    <IconRow icon="venus-and-mars" title="Пол: {employee.sex}" />
  </div>
</div>
