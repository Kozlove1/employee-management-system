<script lang="ts">
  import type { AccrualType } from '$lib/types';
  import FormField from './FormField.svelte';

  type Props = {
    value: number;
    selectedType?: AccrualType | null;
    required?: boolean;
    disabled?: boolean;
    min?: number;
    step?: number;
    error?: string;
    onValueChange?: (value: number) => void;
  };

  let {
    value,
    selectedType = null,
    required = false,
    disabled = false,
    min = 0,
    step = 1,
    error,
    onValueChange,
  }: Props = $props();

  // Проверяем, имеет ли выбранный тип фиксированное количество АК
  let hasFixedAmmoCoins = $derived(
    selectedType?.ammo_coins_amount !== undefined
  );

  let hint = $derived(
    hasFixedAmmoCoins ? '(автоматически проставлено)' : undefined
  );

  let additionalInfo = $derived(
    hasFixedAmmoCoins && selectedType
      ? `Этот тип начисления имеет фиксированное количество АК: ${selectedType.ammo_coins_amount}`
      : undefined
  );

  function handleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    const numValue = Number(target.value);
    if (onValueChange) {
      onValueChange(numValue);
    }
  }
</script>

<FormField
  label="Сумма (АммоКоины)"
  {required}
  {hint}
  {error}
  id="amount-input"
>
  {#snippet children()}
    <input
      id="amount-input"
      type="number"
      {value}
      {min}
      {step}
      {required}
      disabled={disabled || hasFixedAmmoCoins}
      oninput={handleInput}
      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors {hasFixedAmmoCoins
        ? 'bg-blue-100 border-blue-400 text-blue-800 font-medium shadow-sm shadow-blue-200'
        : ''} disabled:bg-gray-50 disabled:cursor-not-allowed {error
        ? 'border-red-300'
        : ''}"
    />

    {#if additionalInfo}
      <p class="text-xs text-blue-700 mt-1 font-medium">
        {additionalInfo}
      </p>
    {/if}
  {/snippet}
</FormField>
