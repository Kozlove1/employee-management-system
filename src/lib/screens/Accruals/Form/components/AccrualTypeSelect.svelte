<script lang="ts">
  import type { AccrualType } from '$lib/types';
  import FormField from './FormField.svelte';

  type Props = {
    value: string;
    accrualTypes: AccrualType[];
    required?: boolean;
    disabled?: boolean;
    placeholder?: string;
    error?: string;
    onValueChange?: (value: string) => void;
  };

  let {
    value,
    accrualTypes,
    required = false,
    disabled = false,
    placeholder = 'Выберите тип начисления',
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

<FormField label="Тип начисления" {required} {error} id="accrual-type-select">
  {#snippet children()}
    <select
      id="accrual-type-select"
      {value}
      {disabled}
      {required}
      onchange={handleChange}
      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed {error
        ? 'border-red-300'
        : ''}"
    >
      <option value="">{placeholder}</option>
      {#each accrualTypes as type}
        <option value={type.type_guid}>
          {type.type_name}
          {#if type.ammo_coins_amount !== undefined}
            ({type.ammo_coins_amount} АК)
          {/if}
        </option>
      {/each}
    </select>
  {/snippet}
</FormField>
