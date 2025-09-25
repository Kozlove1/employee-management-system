import { accrualTypesStore } from '$lib/features/TypesOfAccruals/store/accrualTypesStore.svelte'
import type { AccrualType } from '$lib/types/shared'

export interface TypeOfAccrualFormData {
	type_name: string
	ammo_coins_amount?: number
}

interface FormErrors {
	type_name?: string
	ammo_coins_amount?: string
}

class TypeOfAccrualFormStore {
	private isOpen = $state<boolean>(false)
	private formData = $state<TypeOfAccrualFormData>({
		type_name: '',
		ammo_coins_amount: undefined
	})
	private currentType = $state<AccrualType | null>(null)
	private isSubmitting = $state<boolean>(false)
	private errors = $state<FormErrors>({})

	private resetForm(): void {
		this.formData = {
			type_name: '',
			ammo_coins_amount: undefined
		}
	}

	private clearErrors(): void {
		this.errors = {}
	}

	private validateForm(): void {
		const newErrors: FormErrors = {}

		if (!this.formData.type_name.trim()) {
			newErrors.type_name = 'Введите название типа начисления'
		}

		if (this.formData.ammo_coins_amount !== undefined && this.formData.ammo_coins_amount <= 0) {
			newErrors.ammo_coins_amount = 'Количество АК должно быть больше нуля'
		}

		this.errors = newErrors
	}

	public getIsOpen(): boolean {
		return this.isOpen
	}

	public getFormData(): TypeOfAccrualFormData {
		return this.formData
	}

	public getCurrentType(): AccrualType | null {
		return this.currentType
	}

	public getIsSubmitting(): boolean {
		return this.isSubmitting
	}

	public getErrors(): FormErrors {
		return this.errors
	}

	isFormValid = $derived.by((): boolean => {
		return (
			this.formData.type_name.trim() !== '' &&
			(this.formData.ammo_coins_amount === undefined || this.formData.ammo_coins_amount > 0)
		)
	})

	public getModalTitle(): string {
		return this.currentType ? 'Редактировать тип начисления' : 'Новый тип начисления'
	}

	public getModalSubtitle(): string {
		return 'Заполните форму для создания нового типа начисления'
	}

	public openForCreate(): void {
		this.currentType = null
		this.resetForm()
		this.isOpen = true
		this.clearErrors()
	}

	public openForEdit(type: AccrualType): void {
		this.currentType = type
		this.formData = {
			type_name: type.type_name,
			ammo_coins_amount: type.ammo_coins_amount
		}
		this.isOpen = true
		this.clearErrors()
	}

	public close(): void {
		this.isOpen = false
		this.currentType = null
		this.resetForm()
		this.clearErrors()
	}

	public updateField<K extends keyof TypeOfAccrualFormData>(
		field: K,
		value: TypeOfAccrualFormData[K]
	): void {
		this.formData[field] = value
		if (this.errors[field]) {
			delete this.errors[field]
		}
	}

	public async submitForm(onSubmit: (data: TypeOfAccrualFormData) => Promise<void> | void): Promise<void> {
		if (!this.isFormValid) {
			this.validateForm()
			return
		}

		this.isSubmitting = true
		this.clearErrors()

		try {
			await onSubmit(this.formData)
			// Уведомляем глобальный стор об изменении данных
			accrualTypesStore.refresh()
			this.close()
		} catch (error) {
			console.error('Form submission error:', error)
			this.errors = {
				...this.errors,
				general: error instanceof Error ? error.message : 'Произошла ошибка при сохранении'
			} as any
		} finally {
			this.isSubmitting = false
		}
	}
}

export const typeOfAccrualFormStore = new TypeOfAccrualFormStore()
