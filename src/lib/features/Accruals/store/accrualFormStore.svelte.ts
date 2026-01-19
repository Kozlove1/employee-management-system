import { employeeStore } from "$lib/features/Employees/store/employeeStore.svelte";
import { accrualTypesStore } from "$lib/features/TypesOfAccruals/store/accrualTypesStore.svelte";
import type { AccrualType } from "$lib/types/shared";
import type { EmployeeWithDetails } from "$lib/types/shared";
import { getLocalDateTime } from "$lib/utils/dateUtils";
import type { AccrualFormData, AccrualWithDetails } from "../types";

interface FormErrors {
	org_guid?: string;
	employee_guid?: string;
	type_guid?: string;
	amount?: string;
	date?: string;
	comment?: string;
	general?: string;
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
		if (!this.formData.type_guid) {
			return false;
		}

		const selectedType = this.selectedType;
		if (!selectedType) {
			return false;
		}

		const hasValidAmount =
			selectedType.ammo_coins_amount && selectedType.ammo_coins_amount > 0
				? true
				: this.formData.amount > 0;

		return (
			this.formData.employee_guid !== "" &&
			this.formData.type_guid !== "" &&
			hasValidAmount &&
			this.formData.date !== ""
		);
	});

	hasChanges = $derived.by((): boolean => {
		if (!this.currentAccrual) {
			return true;
		}

		const original = this.currentAccrual;
		const normalizeDate = (date: string | undefined | null): string => {
			if (!date) return "";
			try {
				return new Date(date).toISOString();
			} catch {
				return date;
			}
		};

		return (
			this.formData.employee_guid !== (original.employee_guid || "") ||
			this.formData.type_guid !== (original.type_guid || "") ||
			(this.formData.amount ?? 0) !== (original.amount ?? 0) ||
			normalizeDate(this.formData.date) !== normalizeDate(original.date) ||
			(this.formData.comment ?? "") !== (original.comment ?? "")
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
			if (this.selectedType.ammo_coins_amount > 0) {
				this.formData.amount = this.selectedType.ammo_coins_amount;
			} else if (!this.currentAccrual) {
				this.formData.amount = 0;
			}
		}
	}

	private findEmployee(employeeGuid: string): EmployeeWithDetails | undefined {
		const lookupEmployees = employeeStore.getLookupEmployees();
		const apiEmployees = employeeStore.getApiEmployees();
		return (
			lookupEmployees.find((emp) => emp.employee_guid === employeeGuid) ||
			apiEmployees.find((emp) => emp.employee_guid === employeeGuid)
		);
	}

	private fillEmployeeFields(employee: EmployeeWithDetails): void {
		if (employee.org_guid) {
			this.formData.org_guid = employee.org_guid;
		}
		if (employee.department_guid) {
			this.formData.department_guid = employee.department_guid;
		}
		if (employee.post_guid) {
			this.formData.post_guid = employee.post_guid;
		}
		if (employee.date_create) {
			this.formData.date_create = employee.date_create;
		}
		if (employee.date_delete) {
			this.formData.date_delete = employee.date_delete;
		}
	}

	openForCreate(prefilledData?: Partial<AccrualFormData>): void {
		this.currentAccrual = null;
		this.resetForm();
		
		if (prefilledData) {
			this.formData = { ...this.formData, ...prefilledData };
			
			if (prefilledData.employee_guid) {
				const employee = this.findEmployee(prefilledData.employee_guid);
				if (employee) {
					if (!this.formData.org_guid) this.formData.org_guid = employee.org_guid || "";
					if (!this.formData.department_guid) this.formData.department_guid = employee.department_guid || "";
					if (!this.formData.post_guid) this.formData.post_guid = employee.post_guid || "";
					if (!this.formData.date_create) this.formData.date_create = employee.date_create || "";
					if (!this.formData.date_delete) this.formData.date_delete = employee.date_delete || "";
				}
			}
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
			org_guid: accrual.org_guid || "",
			department_guid: accrual.department_guid || "",
			post_guid: accrual.post_guid || "",
			date_create: accrual.date_create || "",
			date_delete: accrual.date_delete || "",
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
			const employee = this.findEmployee(employeeGuid);
			if (employee) {
				this.fillEmployeeFields(employee);
			}
		} else {
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
			this.errors = {
				...this.errors,
				general:
					error instanceof Error
						? error.message
						: "Произошла ошибка при сохранении",
			};
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

		if (!this.formData.employee_guid) {
			newErrors.employee_guid = "Выберите сотрудника";
		}

		if (!this.formData.type_guid) {
			newErrors.type_guid = "Выберите тип начисления";
		}

		const selectedType = this.selectedType;
		const isVariableType = selectedType && selectedType.ammo_coins_amount === 0;

		if (isVariableType && this.formData.amount <= 0) {
			newErrors.amount =
				"Для переменного типа начисления сумма должна быть больше нуля";
		}

		if (!this.formData.date) {
			newErrors.date = "Выберите дату";
		}

		this.errors = newErrors;
	}
}

export const accrualFormStore = new AccrualFormStore();
