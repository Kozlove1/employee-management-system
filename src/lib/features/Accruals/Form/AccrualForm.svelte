<script lang="ts">
	import type { AccrualFormData, AccrualWithDetails } from '../types'

	import { accrualTypesStore } from '$lib/features/TypesOfAccruals/store/accrualTypesStore.svelte'
	import { accrualFormStore } from '../store/accrualFormStore.svelte'

	import Modal from '$lib/components/UI/Modal.svelte'
	import {
		AccrualTypeSelect,
		AmountInput,
		CommentTextarea,
		DateTimeInput,
		EmployeeSelect
	} from '$lib/features/Accruals/Form/components'
	import { mockEmployees } from '$lib/features/Employees/mocks/employeesMockData'

	type Props = {
		onSubmit: (data: AccrualFormData) => Promise<void> | void
		onCancel?: () => void
	}

	let { onSubmit, onCancel }: Props = $props()

	let isOpen = $derived(accrualFormStore.getIsOpen())
	let formData = $derived(accrualFormStore.getFormData())
	let isFormValid = $derived(accrualFormStore.isFormValid)
	let isSubmitting = $derived(accrualFormStore.getIsSubmitting())
	let selectedType = $derived(accrualFormStore.selectedType)
	let modalTitle = $derived(accrualFormStore.getModalTitle())
	let modalSubtitle = $derived(accrualFormStore.getModalSubtitle())
	let errors = $derived(accrualFormStore.getErrors())

	$effect(() => {
		if (selectedType) {
			accrualFormStore.updateAmountFromType()
		}
	})

	async function handleSubmit(event: Event) {
		event.preventDefault()
		await accrualFormStore.submitForm(onSubmit)
	}

	function handleCancel() {
		accrualFormStore.close()
		if (onCancel) {
			onCancel()
		}
	}

	function updateEmployee(value: string) {
		accrualFormStore.updateField('employee_guid', value)
	}

	function updateType(value: string) {
		accrualFormStore.updateField('type_guid', value)
	}

	function updateAmount(value: number) {
		accrualFormStore.updateField('amount', value)
	}

	function updateDate(value: string) {
		accrualFormStore.updateField('date', value)
	}

	function updateComment(value: string) {
		accrualFormStore.updateField('comment', value)
	}

	export function openForCreate() {
		accrualFormStore.openForCreate()
	}

	export function openForEdit(accrual: AccrualWithDetails) {
		accrualFormStore.openForEdit(accrual)
	}

	export function close() {
		accrualFormStore.close()
	}
</script>

<Modal bind:isOpen title={modalTitle} subtitle={modalSubtitle} onClose={handleCancel} maxWidth="md">
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
				accrualTypes={accrualTypesStore.types}
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

			<CommentTextarea value={formData.comment || ''} onValueChange={updateComment} />
		</form>
	{/snippet}

	{#snippet footer()}
		<div class="flex justify-end space-x-3">
			<button
				type="button"
				class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
				onclick={handleCancel}
				disabled={isSubmitting}
			>
				Отмена
			</button>
			<button
				type="button"
				class="rounded-lg border border-transparent bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
				disabled={!isFormValid || isSubmitting}
				onclick={handleSubmit}
			>
				{#if isSubmitting}
					<span class="flex items-center">
						<div class="-ml-1 mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
						Сохранение...
					</span>
				{:else}
					{accrualFormStore.getCurrentAccrual() ? 'Сохранить' : 'Начислить АммоКоины'}
				{/if}
			</button>
		</div>
	{/snippet}
</Modal>
