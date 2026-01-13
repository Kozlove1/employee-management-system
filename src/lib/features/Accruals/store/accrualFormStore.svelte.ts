import { employeeStore } from "$lib/features/Employees/store/employeeStore.svelte";
import { accrualTypesStore } from "$lib/features/TypesOfAccruals/store/accrualTypesStore.svelte";
import type { AccrualType } from "$lib/types/shared";
import { getLocalDateTime } from "$lib/utils/dateUtils";
import type { AccrualFormData, AccrualWithDetails } from "../types";

interface FormErrors {
	org_guid?: string;
	employee_guid?: string;
	type_guid?: string;
	amount?: string;
	date?: string;
	comment?: string;
}

class AccrualFormStore {
	private isOpen = $state<boolean>(false);
	private formData = $state<AccrualFormData>({
		employee_guid: "",
		type_guid: "",
		amount: 0,
		date: getLocalDateTime(),
		comment: "",
		org_guid: "",
		department_guid: "",
		post_guid: "",
		date_create: "",
		date_delete: "",
	});
	private currentAccrual = $state<AccrualWithDetails | null>(null);
	private isSubmitting = $state<boolean>(false);
	private errors = $state<FormErrors>({});

	getIsOpen(): boolean {
		return this.isOpen;
	}

	getFormData(): AccrualFormData {
		return this.formData;
	}

	getCurrentAccrual(): AccrualWithDetails | null {
		return this.currentAccrual;
	}

	getIsSubmitting(): boolean {
		return this.isSubmitting;
	}

	getErrors(): FormErrors {
		return this.errors;
	}

	selectedType = $derived.by((): AccrualType | null => {
		return accrualTypesStore.getTypeById(this.formData.type_guid);
	});

	isFormValid = $derived.by((): boolean => {
		// type_guid обязателен
		if (!this.formData.type_guid || this.formData.type_guid === "") {
			return false;
		}

		const selectedType = this.selectedType;

		// Если тип не найден, форма невалидна
		if (!selectedType) {
			return false;
		}

		// Для фиксированного типа (ammo_coins_amount > 0) сумма автоматическая
		// Для переменного типа (ammo_coins_amount === 0) сумма должна быть > 0
		const hasValidAmount =
			selectedType.ammo_coins_amount && selectedType.ammo_coins_amount > 0
				? true // Фиксированный тип - сумма проставится автоматически
				: this.formData.amount > 0; // Переменный тип - пользователь должен ввести сумму > 0

		const isValid =
			this.formData.employee_guid !== "" &&
			this.formData.type_guid !== "" &&
			hasValidAmount &&
			this.formData.date !== "";
		return isValid;
	});

	hasChanges = $derived.by((): boolean => {
		// Если это создание нового начисления, изменения всегда есть
		if (!this.currentAccrual) {
			return true;
		}

		// Сравниваем редактируемые поля с исходными значениями
		const original = this.currentAccrual;
		return (
			this.formData.employee_guid !== original.employee_guid ||
			this.formData.type_guid !== original.type_guid ||
			this.formData.amount !== original.amount ||
			this.formData.date !== original.date ||
			this.formData.comment !== original.comment
		);
	});

	getModalTitle(): string {
		return this.currentAccrual
			? "Редактировать начисление"
			: "Новое начисление АммоКоинов";
	}

	getModalSubtitle(): string {
		return "Заполните форму для начисления АммоКоинов сотруднику";
	}

	updateAmountFromType(): void {
		if (this.selectedType?.ammo_coins_amount) {
			// Фиксированный тип (ammo_coins_amount > 0) - автоматически проставляем с‰умму
			if (this.selectedType.ammo_coins_amount > 0) {
				this.formData.amount = this.selectedType.ammo_coins_amount;
			}
			// Переменный тип (ammo_coins_amount === 0) - сбрасываем сумму, если это новое начисление
			else if (!this.currentAccrual) {
				this.formData.amount = 0;
			}
		}
	}

	openForCreate(prefilledData?: Partial<AccrualFormData>): void {
		this.currentAccrual = null;
		this.resetForm();
		if (prefilledData) {
			this.formData = { ...this.formData, ...prefilledData };
		}
		this.isOpen = true;
		this.clearErrors();
	}

	openForEdit(accrual: AccrualWithDetails): void {
		this.currentAccrual = accrual;
		this.formData = {
			employee_guid: accrual.employee_guid || "",
			type_guid: accrual.type_guid || "",
			amount: accrual.amount || 0,
			date: accrual.date || getLocalDateTime(),
			comment: accrual.comment || "",
			org_guid: accrual.org_guid,
			department_guid: accrual.department_guid,
			post_guid: accrual.post_guid,
			date_create: accrual.date_create,
			date_delete: accrual.date_delete,
		};
		this.isOpen = true;
		this.clearErrors();
	}

	close(): void {
		this.isOpen = false;
		this.currentAccrual = null;
		this.resetForm();
		this.clearErrors();
	}

	updateField<K extends keyof AccrualFormData>(
		field: K,
		value: AccrualFormData[K],
	): void {
		this.formData[field] = value;
		if (field in this.errors && this.errors[field as keyof FormErrors]) {
			delete this.errors[field as keyof FormErrors];
		}
	}

	updateEmployee(employeeGuid: string): void {
		this.updateField("employee_guid", employeeGuid);

		if (employeeGuid) {
			// Получаем данные сотрудника из employeeStore
			const employees = employeeStore.getApiEmployees();
			const selectedEmployee = employees.find(
				(emp) => emp.employee_guid === employeeGuid,
			);

			if (selectedEmployee) {
				// Автоматически заполняем связанные поля из данных сотрудника
				if (selectedEmployee.org_guid) {
					this.updateField("org_guid", selectedEmployee.org_guid);
				}
				if (selectedEmployee.department_guid) {
					this.updateField("department_guid", selectedEmployee.department_guid);
				}
				if (selectedEmployee.post_guid) {
					this.updateField("post_guid", selectedEmployee.post_guid);
				}
				if (selectedEmployee.date_create) {
					this.updateField("date_create", selectedEmployee.date_create);
				}
				if (selectedEmployee.date_delete) {
					this.updateField("date_delete", selectedEmployee.date_delete);
				}
			}
		} else {
			// Очищаем поля при сбросе выбора
			this.updateField("org_guid", "");
			this.updateField("department_guid", "");
			this.updateField("post_guid", "");
			this.updateField("date_create", "");
			this.updateField("date_delete", "");
		}
	}

	async submitForm(
		onSubmit: (data: AccrualFormData) => Promise<void> | void,
	): Promise<void> {
		if (!this.isFormValid) {
			this.validateForm();
			return;
		}

		this.isSubmitting = true;
		this.clearErrors();

		try {
			await onSubmit(this.formData);
			this.close();
		} catch (error) {
			console.error("Form submission error:", error);
			this.errors = {
				...this.errors,
				general:
					error instanceof Error
						? error.message
						: "Произошла ошибка при сохранении",
			} as any;
		} finally {
			this.isSubmitting = false;
		}
	}

	private resetForm(): void {
		this.formData = {
			employee_guid: "",
			type_guid: "",
			amount: 0,
			date: getLocalDateTime(),
			comment: "",
			org_guid: "",
			department_guid: "",
			post_guid: "",
			date_create: "",
			date_delete: "",
		};
	}

	private clearErrors(): void {
		this.errors = {};
	}

	private validateForm(): void {
		const newErrors: FormErrors = {};

		if (!this.formData.employee_guid || this.formData.employee_guid === "") {
			newErrors.employee_guid = "Выберите сотрудника";
		}

		if (!this.formData.type_guid || this.formData.type_guid === "") {
			newErrors.type_guid = "Выберите тип начисления";
		}

		// Проверяем сумму для переменного типа
		const selectedType = this.selectedType;
		const isVariableType = selectedType && selectedType.ammo_coins_amount === 0;

		if (isVariableType && this.formData.amount <= 0) {
			newErrors.amount =
				"Для переменного типа начисления сумма должна быть больше нуля";
		}

		if (!this.formData.date || this.formData.date === "") {
			newErrors.date = "Выберите дату";
		}

		this.errors = newErrors;
	}
}

export const accrualFormStore = new AccrualFormStore();
