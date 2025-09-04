<script lang="ts">
  import Modal from '$lib/components/UI/Modal.svelte';
  import { mockAccrualTypes, mockEmployees } from '$lib/data/mockData';
  import {
    AccrualTypeSelect,
    AmountInput,
    CommentTextarea,
    DateTimeInput,
    EmployeeSelect,
  } from '$lib/screens/Accruals/Form/components';
  import type { AccrualFormData, AccrualWithDetails } from '$lib/types';
  import { accrualFormStore } from './store/accrualFormStore.svelte';

  type Props = {
    onSubmit: (data: AccrualFormData) => Promise<void> | void;
    onCancel?: () => void;
  };

  let { onSubmit, onCancel }: Props = $props();

  let isOpen = $derived(accrualFormStore.getIsOpen());
  let formData = $derived(accrualFormStore.getFormData());
  let isFormValid = $derived(accrualFormStore.isFormValid);
  let isSubmitting = $derived(accrualFormStore.getIsSubmitting());
  let selectedType = $derived(accrualFormStore.selectedType);
  let modalTitle = $derived(accrualFormStore.getModalTitle());
  let modalSubtitle = $derived(accrualFormStore.getModalSubtitle());
  let errors = $derived(accrualFormStore.getErrors());

  $effect(() => {
    if (selectedType) {
      accrualFormStore.updateAmountFromType();
    }
  });

  async function handleSubmit(event: Event) {
    event.preventDefault();
    await accrualFormStore.submitForm(onSubmit);
  }

  function handleCancel() {
    accrualFormStore.close();
    if (onCancel) {
      onCancel();
    }
  }

  function updateEmployee(value: string) {
    accrualFormStore.updateField('employee_guid', value);
  }

  function updateType(value: string) {
    accrualFormStore.updateField('type_guid', value);
  }

  function updateAmount(value: number) {
    accrualFormStore.updateField('amount', value);
  }

  function updateDate(value: string) {
    accrualFormStore.updateField('date', value);
  }

  function updateComment(value: string) {
    accrualFormStore.updateField('comment', value);
  }

  export function openForCreate() {
    accrualFormStore.openForCreate();
  }

  export function openForEdit(accrual: AccrualWithDetails) {
    accrualFormStore.openForEdit(accrual);
  }

  export function close() {
    accrualFormStore.close();
  }
</script>

<Modal
  bind:isOpen
  title={modalTitle}
  subtitle={modalSubtitle}
  onClose={handleCancel}
  maxWidth="md"
>
  {#snippet children()}
    <form class="space-y-4">
      <EmployeeSelect
        value={formData.employee_guid}
        onValueChange={updateEmployee}
        employees={mockEmployees}
        required={true}
        error={errors.employee_guid}
      />

      <AccrualTypeSelect
        value={formData.type_guid}
        onValueChange={updateType}
        accrualTypes={mockAccrualTypes}
        required={true}
        error={errors.type_guid}
      />

      <AmountInput
        value={formData.amount}
        onValueChange={updateAmount}
        {selectedType}
        required={true}
        error={errors.amount}
      />

      <DateTimeInput
        value={formData.date}
        onValueChange={updateDate}
        required={true}
        error={errors.date}
      />

      <CommentTextarea value={formData.comment} onValueChange={updateComment} />
    </form>
  {/snippet}

  {#snippet footer()}
    <div class="flex justify-end space-x-3">
      <button
        type="button"
        class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
        onclick={handleCancel}
        disabled={isSubmitting}
      >
        Отмена
      </button>
      <button
        type="button"
        class="px-4 py-2 text-sm font-medium text-white bg-gray-900 border border-transparent rounded-lg hover:bg-gray-800 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        disabled={!isFormValid || isSubmitting}
        onclick={handleSubmit}
      >
        {#if isSubmitting}
          <span class="flex items-center">
            <svg
              class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Сохранение...
          </span>
        {:else}
          {accrualFormStore.getCurrentAccrual()
            ? 'Сохранить'
            : 'Начислить АммоКоины'}
        {/if}
      </button>
    </div>
  {/snippet}
</Modal>
