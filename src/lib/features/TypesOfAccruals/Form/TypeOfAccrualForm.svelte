<script lang="ts">
	import Modal from '$lib/components/UI/Modal.svelte'
	import type { TypeOfAccrualFormData } from '../store/typeOfAccrualFormStore.svelte'
	import { typeOfAccrualFormStore } from '../store/typeOfAccrualFormStore.svelte'
	import type { AccrualType } from '../types'
	import { AmmoCoinsAmountInput, TypeNameInput } from './components'

	type Props = {
		onSubmit: (data: TypeOfAccrualFormData) => Promise<void> | void
		onCancel?: () => void
	}

	let { onSubmit, onCancel }: Props = $props()

	let isOpen = $derived(typeOfAccrualFormStore.getIsOpen())
	let formData = $derived(typeOfAccrualFormStore.getFormData())
	let isFormValid = $derived(typeOfAccrualFormStore.isFormValid)
	let isSubmitting = $derived(typeOfAccrualFormStore.getIsSubmitting())
	let modalTitle = $derived(typeOfAccrualFormStore.getModalTitle())
	let modalSubtitle = $derived(typeOfAccrualFormStore.getModalSubtitle())
	let errors = $derived(typeOfAccrualFormStore.getErrors())

	async function handleSubmit(event: Event) {
		event.preventDefault()
		await typeOfAccrualFormStore.submitForm(onSubmit)
	}

	function handleCancel() {
		typeOfAccrualFormStore.close()
		if (onCancel) {
			onCancel()
		}
	}

	function updateTypeName(value: string) {
		typeOfAccrualFormStore.updateField('type_name', value)
	}

	function updateAmmoCoinsAmount(value: number | undefined) {
		typeOfAccrualFormStore.updateField('ammo_coins_amount', value)
	}

	export function openForCreate() {
		typeOfAccrualFormStore.openForCreate()
	}

	export function openForEdit(type: AccrualType) {
		typeOfAccrualFormStore.openForEdit(type)
	}

	export function close() {
		typeOfAccrualFormStore.close()
	}
</script>

<Modal bind:isOpen title={modalTitle} subtitle={modalSubtitle} onClose={handleCancel} maxWidth="md">
	{#snippet children()}
		<form class="space-y-4">
			<TypeNameInput
				value={formData.type_name}
				onValueChange={updateTypeName}
				required={true}
				error={errors.type_name}
			/>

			<AmmoCoinsAmountInput
				value={formData.ammo_coins_amount}
				onValueChange={updateAmmoCoinsAmount}
				error={errors.ammo_coins_amount}
			/>
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
						<svg
							class="-ml-1 mr-2 h-4 w-4 animate-spin text-white"
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
					{typeOfAccrualFormStore.getCurrentType() ? 'Сохранить' : 'Создать тип'}
				{/if}
			</button>
		</div>
	{/snippet}
</Modal>
