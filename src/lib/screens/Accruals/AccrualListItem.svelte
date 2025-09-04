<script lang="ts">
  interface Accrual {
    post_guid: string;
    employee_name?: string;
    type_name?: string;
    amount?: number;
    datecreate: string;
  }

  interface Props {
    accrual: Accrual;
    onEdit: (accrual: Accrual) => void;
    onDelete: (guid: string) => void;
  }

  let { accrual, onEdit, onDelete } = $props();

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }) +
      ' г. в ' +
      date.toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
      })
    );
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
            {accrual.employee_name?.charAt(0) || '?'}
          </span>
        </div>
      </div>
      <div class="flex-1">
        <h3 class="text-sm font-medium text-gray-900">
          {accrual.employee_name}
        </h3>
        <p class="text-sm text-gray-500">{accrual.type_name}</p>
        <div class="flex items-center mt-1 text-xs text-gray-400">
          <svg
            class="h-3 w-3 mr-1"
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
          {formatDate(accrual.datecreate)}
        </div>
      </div>
    </div>

    <div class="flex items-center space-x-3">
      <span
        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-900 text-white"
      >
        {accrual.amount || 0} AK
      </span>
      <div class="flex space-x-2">
        <button
          onclick={() => onEdit(accrual)}
          class="text-gray-400 hover:text-gray-600"
          title="Редактировать"
          aria-label="Редактировать начисление"
        >
          <svg
            class="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        </button>
        <button
          onclick={() => onDelete(accrual.post_guid)}
          class="text-gray-400 hover:text-red-600"
          title="Удалить"
          aria-label="Удалить начисление"
        >
          <svg
            class="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</div>
