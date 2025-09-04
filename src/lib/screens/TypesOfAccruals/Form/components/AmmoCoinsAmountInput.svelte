<script lang="ts">
  import FormField from './FormField.svelte';

  interface Props {
    value?: number;
    onValueChange: (value: number | undefined) => void;
    required?: boolean;
    error?: string;
  }

  let { value, onValueChange, required = false, error }: Props = $props();

  let hasFixedAmount = $state(value !== undefined);

  function handleCheckboxChange(event: Event) {
    const target = event.target as HTMLInputElement;
    hasFixedAmount = target.checked;

    if (!hasFixedAmount) {
      onValueChange(undefined);
    } else {
      onValueChange(value || 0);
    }
  }

  function handleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    const numValue = parseFloat(target.value) || 0;
    onValueChange(numValue);
  }

  // Синхронизируем состояние checkbox с value
  $effect(() => {
    hasFixedAmount = value !== undefined;
  });
</script>

<FormField label="Фиксированное количество АК" {required} {error}>
  <div class="space-y-3">
    <div class="flex items-center">
      <input
        id="ammo-coins-checkbox"
        type="checkbox"
        checked={hasFixedAmount}
        onchange={handleCheckboxChange}
        class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
      />
      <label for="ammo-coins-checkbox" class="ml-2 text-sm text-gray-700">
        Установить фиксированное количество АммоКоинов
      </label>
    </div>

    {#if hasFixedAmount}
      <input
        type="number"
        value={value || ''}
        oninput={handleInput}
        placeholder="Введите количество АК"
        min="0"
        step="1"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
        class:border-red-300={error}
        class:focus:ring-red-500={error}
        class:focus:border-red-500={error}
      />
      <p class="text-xs text-gray-500">
        Если указано, то при создании начисления сумма будет автоматически
        установлена в это значение
      </p>
    {:else}
      <p class="text-xs text-gray-500">
        Если не указано, то при создании начисления сумму можно будет ввести
        вручную
      </p>
    {/if}
  </div>
</FormField>
