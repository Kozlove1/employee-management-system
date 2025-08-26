<script lang="ts">
  import IconRow from '$lib/components/UI/IconRow.svelte';
  import type { EmployeeStats } from '$lib/types';

  interface Props {
    employee: EmployeeStats;
    index: number;
  }

  let { employee, index }: Props = $props();

  const positionStyles = (() => {
    switch (index) {
      case 0:
        return 'bg-yellow-100 text-yellow-800';
      case 1:
        return 'bg-gray-100 text-gray-800';
      case 2:
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-50 text-gray-600';
    }
  })();

  const formattedBalance = employee.total_balance.toLocaleString();

  const employeeInfo = `${employee.ident} • ${employee.department_name}`;
</script>

<div class="px-6 py-4 hover:bg-gray-50 flex items-center justify-between">
  <div class="flex items-center space-x-4">
    <!-- Position -->
    <div class="flex-shrink-0">
      <div
        class="h-8 w-8 rounded-full flex items-center justify-center {positionStyles}"
      >
        <span class="text-sm font-bold">
          {index + 1}
        </span>
      </div>
    </div>

    <!-- Employee info -->
    <div class="flex-1 min-w-0">
      <p class="text-sm font-medium text-gray-900 truncate">
        {employee.employee_name}
      </p>
      <p class="text-sm text-gray-500 truncate">
        ID: {employeeInfo}
      </p>
    </div>
  </div>

  <!-- Balance -->
  <div class="flex-shrink-0 text-right">
    <p class="text-sm font-bold text-gray-900 flex items-center">
      <IconRow
        icon="coins"
        iconSize="l"
        iconColor="yellow"
        title={`${formattedBalance} АК`}
        titleColor="text-neutral-900"
      />
    </p>
  </div>
</div>
