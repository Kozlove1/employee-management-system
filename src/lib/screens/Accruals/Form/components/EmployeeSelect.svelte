<script lang="ts">
  import type { Employee } from '$lib/types';
  import FormField from './FormField.svelte';

  type Props = {
    value: string;
    employees: Employee[];
    required?: boolean;
    disabled?: boolean;
    placeholder?: string;
    error?: string;
    onValueChange?: (value: string) => void;
  };

  let {
    value,
    employees,
    required = false,
    disabled = false,
    placeholder = 'Выберите сотрудника',
    error,
    onValueChange,
  }: Props = $props();

  function handleChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    if (onValueChange) {
      onValueChange(target.value);
    }
  }
</script>

<FormField label="Сотрудник" {required} {error} id="employee-select">
  {#snippet children()}
    <select
      id="employee-select"
      {value}
      {disabled}
      {required}
      onchange={handleChange}
      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed {error
        ? 'border-red-300'
        : ''}"
    >
      <option value="">{placeholder}</option>
      {#each employees as employee}
        <option value={employee.employee_guid}>
          {employee.employee}
        </option>
      {/each}
    </select>
  {/snippet}
</FormField>
