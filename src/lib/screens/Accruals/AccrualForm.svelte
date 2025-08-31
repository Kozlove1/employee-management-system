<script lang="ts">
  import IconRow from '$lib/components/UI/IconRow.svelte';
  import { mockAccrualTypes, mockEmployees } from '$lib/data/mockData';

  import type { AccrualFormData } from '$lib/types';

  let {
    isOpen = $bindable(),
    onSubmit,
    onCancel,
  } = $props<{
    isOpen: boolean;
    onSubmit: (data: AccrualFormData) => void;
    onCancel: () => void;
  }>();

  let formData = $state<AccrualFormData>({
    employee_guid: '',
    type_guid: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    comment: '',
  });

  let selectedType = $derived(
    mockAccrualTypes.find((type) => type.type_guid === formData.type_guid)
  );

  $effect(() => {
    if (selectedType) {
      formData.amount = selectedType.amount;
    }
  });

  function handleSubmit(event: Event) {
    event.preventDefault();
    if (formData.employee_guid && formData.type_guid && formData.amount > 0) {
      onSubmit(formData);
      // Сброс формы
      formData = {
        employee_guid: '',
        type_guid: '',
        amount: 0,
        date: new Date().toISOString().split('T')[0],
        comment: '',
      };
      isOpen = false;
    }
  }

  function handleCancel() {
    onCancel();
    isOpen = false;
  }
</script>

{#if isOpen}
  <div
    class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50"
  >
    <div
      class="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
    >
      <div
        class="px-6 py-4 border-b border-gray-200 flex items-center justify-between"
      >
        <h3 class="text-lg font-medium text-gray-900">
          Редактировать начисление
        </h3>
        <button
          class="text-gray-400 hover:text-gray-500"
          onclick={handleCancel}
        >
          <IconRow icon="x" iconSize="l" />
        </button>
      </div>

      <form onsubmit={handleSubmit} class="px-6 py-4 space-y-4">
        <div>
          <label
            for="employee"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            Сотрудник
          </label>
          <select
            id="employee"
            bind:value={formData.employee_guid}
            class="select"
            required
          >
            <option value="">Выберите сотрудника</option>
            {#each mockEmployees as employee}
              <option value={employee.employee_guid}>
                {employee.employee}
              </option>
            {/each}
          </select>
        </div>

        <div>
          <label
            for="type"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            Тип начисления
          </label>
          <select
            id="type"
            bind:value={formData.type_guid}
            class="select"
            required
          >
            <option value="">Выберите тип начисления</option>
            {#each mockAccrualTypes as type}
              <option value={type.type_guid}>
                {type.type_name}
              </option>
            {/each}
          </select>
        </div>

        <div>
          <label
            for="amount"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            Сумма (АммоКоины)
          </label>
          <input
            id="amount"
            type="number"
            bind:value={formData.amount}
            min="0"
            step="1"
            class="input"
            required
          />
        </div>

        <div>
          <label
            for="date"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            Дата (необязательно)
          </label>
          <div class="relative">
            <input
              id="date"
              type="date"
              bind:value={formData.date}
              class="input pr-10"
            />
            <div
              class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
            >
              <IconRow icon="calendar" iconSize="m" />
            </div>
          </div>
        </div>

        <div>
          <label
            for="comment"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            Комментарий (необязательно)
          </label>
          <textarea
            id="comment"
            bind:value={formData.comment}
            rows="3"
            class="input"
            placeholder="Введите комментарий"
          ></textarea>
        </div>

        <div class="flex justify-end space-x-3 pt-4">
          <button type="button" class="btn-secondary" onclick={handleCancel}>
            Отмена
          </button>
          <button
            type="submit"
            class="btn-primary"
            disabled={!formData.employee_guid ||
              !formData.type_guid ||
              formData.amount <= 0}
          >
            Сохранить
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}
