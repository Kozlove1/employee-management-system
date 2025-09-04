<script lang="ts">
  import type { AccrualType } from '$lib/types';
  import { SquarePen, Trash2 } from '@lucide/svelte';

  interface Props {
    typeOfAccrual: AccrualType;
    onEdit: (typeOfAccrual: AccrualType) => void;
    onDelete: (guid: string) => void;
  }

  let { typeOfAccrual, onEdit, onDelete } = $props();

  function getAmountDisplay(): string {
    if (typeOfAccrual.ammo_coins_amount !== undefined) {
      return `${typeOfAccrual.ammo_coins_amount} АК (фиксированная)`;
    } else {
      return `0 АК (переменная)`;
    }
  }

  function getAmountType(): 'fixed' | 'variable' {
    return typeOfAccrual.ammo_coins_amount !== undefined ? 'fixed' : 'variable';
  }
</script>

<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
  <div class="flex items-center justify-between">
    <div class="flex items-center space-x-4">
      <div class="flex-shrink-0">
        <div
          class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center"
        >
          <span class="text-sm font-medium text-gray-600">
            {typeOfAccrual.type_name?.charAt(0) || '?'}
          </span>
        </div>
      </div>
      <div class="flex-1">
        <h3 class="text-sm font-medium text-gray-900">
          {typeOfAccrual.type_name}
        </h3>
        <p class="text-sm text-gray-500">{getAmountDisplay()}</p>
        <div class="flex items-center mt-1">
          <span
            class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium {getAmountType() ===
            'fixed'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-green-100 text-green-800'}"
          >
            {getAmountType() === 'fixed'
              ? 'Фиксированная сумма'
              : 'Переменная сумма'}
          </span>
        </div>
      </div>
    </div>

    <div class="flex items-center space-x-3">
      <span
        class="hidden md:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-900 text-white"
      >
        ID: {typeOfAccrual.type_guid}
      </span>
      <div class="flex space-x-2">
        <button
          onclick={() => onEdit(typeOfAccrual)}
          class="text-gray-400 hover:text-gray-600"
          title="Редактировать"
          aria-label="Редактировать тип начисления"
        >
          <SquarePen class="h-4 w-4" />
        </button>
        <button
          onclick={() => onDelete(typeOfAccrual.type_guid)}
          class="text-gray-400 hover:text-red-600"
          title="Удалить"
          aria-label="Удалить тип начисления"
        >
          <Trash2 class="h-4 w-4" />
        </button>
      </div>
    </div>
  </div>
</div>
