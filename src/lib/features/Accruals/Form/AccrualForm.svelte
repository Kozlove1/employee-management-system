<script lang="ts">
	import Modal from '$lib/components/UI/Modal.svelte'
	import {
		AccrualTypeSelect,
		AmountInput,
		CommentTextarea,
		DateTimeInput,
		EmployeeSelect
	} from '$lib/features/Accruals/Form/components'
	import { employeeStore } from '$lib/features/Employees/store/employeeStore.svelte'
	import { accrualTypesStore } from '$lib/features/TypesOfAccruals/store/accrualTypesStore.svelte'
	import { accrualFormStore } from '../store/accrualFormStore.svelte'
	import type { AccrualFormData } from '../types'

	type Props = {
		onSubmit: (data: AccrualFormData) => Promise<void> | void
		onCancel?: () => void
	}

	const { onSubmit, onCancel }: Props = $props()

	const isOpen = $derived(accrualFormStore.getIsOpen())
	const formData = $derived(accrualFormStore.getFormData())
	const isFormValid = $derived(accrualFormStore.isFormValid)
	const hasChanges = $derived(accrualFormStore.hasChanges)
	const isSubmitting = $derived(accrualFormStore.getIsSubmitting())
	const selectedType = $derived(accrualFormStore.selectedType)
	const modalTitle = $derived(accrualFormStore.getModalTitle())
	const modalSubtitle = $derived(accrualFormStore.getModalSubtitle())
	const errors = $derived(accrualFormStore.getErrors())

	// Get only active employees, sorted by name
	const employees = $derived(
		employeeStore
			.getApiEmployees()
			.filter((emp) => !emp.date_delete)
			.sort((a, b) => a.employee.localeCompare(b.employee))
	)

	let hasLoadedData = $state(false)

	$effect(() => {
		if (selectedType) {
			accrualFormStore.updateAmountFromType()
		}
	})

	$effect(() => {
		if (isOpen && !hasLoadedData) {
			hasLoadedData = true

			// Load employees if empty
			if (employees.length === 0 && !employeeStore.getIsLoading()) {
				employeeStore.fetchEmployees()
			}
			// Always refresh accrual types when form opens to get newly created types
			if (!accrualTypesStore.getIsLoading()) {
				accrualTypesStore.fetchTypes()
			}
		} else if (!isOpen && hasLoadedData) {
			// Reset flag when form closes
			hasLoadedData = false
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
		accrualFormStore.updateEmployee(value)
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
</script>

<Modal {isOpen} title={modalTitle} subtitle={modalSubtitle} onClose={handleCancel} maxWidth="md">
	{#snippet children()}
		<form class="space-y-4">
			<EmployeeSelect
				value={formData.employee_guid}
				onValueChange={updateEmployee}
				{employees}
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
				disabled={!isFormValid || !hasChanges || isSubmitting}
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
