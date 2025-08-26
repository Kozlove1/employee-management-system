<script lang="ts">
  import { mockEmployees, mockAccrualTypes } from '$lib/data/mockData';
  import type { AccrualFormData, AccrualWithDetails } from '$lib/types';

  type Props = {
    isOpen: boolean;
    editingAccrual?: AccrualWithDetails | null;
    onSubmit: (data: AccrualFormData) => void;
    onCancel: () => void;
  };

  let {
    isOpen = $bindable(),
    editingAccrual = $bindable<AccrualWithDetails | null>(null),
    onSubmit,
    onCancel,
  }: Props = $props();

  let formData = $state({
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
    if (selectedType && !editingAccrual) {
      formData.amount = selectedType.amount;
    }
  });

  // Заполняем форму при редактировании
  $effect(() => {
    if (editingAccrual && isOpen) {
      const employee = mockEmployees.find(
        (e) => e.employee === editingAccrual.employee_name
      );
      const type = mockAccrualTypes.find(
        (t) => t.type_name === editingAccrual.type_name
      );

      formData = {
        employee_guid: employee?.employee_guid || '',
        type_guid: type?.type_guid || '',
        amount: editingAccrual.amount || 0,
        date:
          editingAccrual.datecreate || new Date().toISOString().split('T')[0],
        comment: editingAccrual.comment || '',
      };
    } else if (!editingAccrual && isOpen) {
      // Сброс формы для создания нового начисления
      formData = {
        employee_guid: '',
        type_guid: '',
        amount: 0,
        date: new Date().toISOString().split('T')[0],
        comment: '',
      };
    }
  });

  function handleSubmit(event) {
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

  function formatDateTime(dateString) {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }) +
      ' ' +
      date.toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
      })
    );
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
        <div>
          <h3 class="text-lg font-medium text-gray-900">
            {editingAccrual
              ? 'Редактировать начисление'
              : 'Новое начисление АммоКоинов'}
          </h3>
          <p class="text-sm text-gray-500 mt-1">
            Заполните форму для начисления АммоКоинов сотруднику
          </p>
        </div>
        <button
          class="text-gray-400 hover:text-gray-500"
          onclick={handleCancel}
        >
          <svg
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
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
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              type="datetime-local"
              bind:value={formData.date}
              class="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div
              class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
            >
              <svg
                class="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
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
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Введите комментарий"
          ></textarea>
        </div>

        <div class="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onclick={handleCancel}
          >
            Отмена
          </button>
          <button
            type="submit"
            class="px-4 py-2 text-sm font-medium text-white bg-gray-900 border border-transparent rounded-lg hover:bg-gray-800 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!formData.employee_guid ||
              !formData.type_guid ||
              formData.amount <= 0}
          >
            {editingAccrual ? 'Сохранить' : 'Начислить АммоКоины'}
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}
