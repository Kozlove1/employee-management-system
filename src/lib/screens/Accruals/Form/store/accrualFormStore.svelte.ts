import { mockAccrualTypes } from '$lib/data/mockData';
import type { AccrualFormData, AccrualType, AccrualWithDetails } from '$lib/types';
import { getLocalDateTime } from '$lib/utils/dateUtils';

interface FormErrors {
  employee_guid?: string;
  type_guid?: string;
  amount?: string;
  date?: string;
  comment?: string;
}

class AccrualFormStore {
  // Private reactive state
  private isOpen = $state<boolean>(false);
  private formData = $state<AccrualFormData>({
    employee_guid: '',
    type_guid: '',
    amount: 0,
    date: getLocalDateTime(),
    comment: '',
  });
  private currentAccrual = $state<AccrualWithDetails | null>(null);
  private isSubmitting = $state<boolean>(false);
  private errors = $state<FormErrors>({});

  // Public getters
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

  // Computed values
  selectedType = $derived.by((): AccrualType | null => {
    return mockAccrualTypes.find(type => type.type_guid === this.formData.type_guid) || null;
  });

  isFormValid = $derived.by((): boolean => {
    return (
      this.formData.employee_guid !== '' &&
      this.formData.type_guid !== '' &&
      this.formData.amount > 0 &&
      this.formData.date !== ''
    );
  });

  getModalTitle(): string {
    return this.currentAccrual ? 'Редактировать начисление' : 'Новое начисление АммоКоинов';
  }

  getModalSubtitle(): string {
    return 'Заполните форму для начисления АммоКоинов сотруднику';
  }

  // Auto-update amount when type changes (called from component)
  updateAmountFromType(): void {
    console.log('updateAmountFromType called, selectedType:', this.selectedType);
    console.log('currentAccrual exists:', !!this.currentAccrual);
    
    if (this.selectedType) {
      if (this.selectedType.ammo_coins_amount !== undefined) {
        // Всегда обновляем сумму если у типа есть фиксированное количество АК
        console.log('Updating amount to:', this.selectedType.ammo_coins_amount);
        this.formData.amount = this.selectedType.ammo_coins_amount;
      } else if (!this.currentAccrual) {
        // Сбрасываем сумму в 0 только при создании нового начисления
        console.log('Resetting amount to 0 for new accrual');
        this.formData.amount = 0;
      } else {
        console.log('Keeping current amount for editing:', this.formData.amount);
      }
      // При редактировании, если у типа нет фиксированной суммы, оставляем текущую сумму
    }
  }

  // Public methods
  openForCreate(): void {
    this.currentAccrual = null;
    this.resetForm();
    this.isOpen = true;
    this.clearErrors();
  }

  openForEdit(accrual: AccrualWithDetails): void {
    this.currentAccrual = accrual;
    this.formData = {
      employee_guid: accrual.employee_guid || '',
      type_guid: accrual.type_guid || '',
      amount: accrual.amount || 0,
      date: accrual.datecreate || getLocalDateTime(),
      comment: accrual.comment || '',
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

  updateField<K extends keyof AccrualFormData>(field: K, value: AccrualFormData[K]): void {
    this.formData[field] = value;
    // Clear error for this field when user starts typing
    if (this.errors[field]) {
      delete this.errors[field];
    }
  }

  async submitForm(onSubmit: (data: AccrualFormData) => Promise<void> | void): Promise<void> {
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
      console.error('Form submission error:', error);
      // Handle submission errors if needed
      this.errors = { 
        ...this.errors, 
        general: error instanceof Error ? error.message : 'Произошла ошибка при сохранении' 
      } as any;
    } finally {
      this.isSubmitting = false;
    }
  }

  private resetForm(): void {
    this.formData = {
      employee_guid: '',
      type_guid: '',
      amount: 0,
      date: getLocalDateTime(),
      comment: '',
    };
  }

  private clearErrors(): void {
    this.errors = {};
  }

  private validateForm(): void {
    const newErrors: FormErrors = {};

    if (!this.formData.employee_guid) {
      newErrors.employee_guid = 'Выберите сотрудника';
    }

    if (!this.formData.type_guid) {
      newErrors.type_guid = 'Выберите тип начисления';
    }

    if (this.formData.amount <= 0) {
      newErrors.amount = 'Сумма должна быть больше нуля';
    }

    if (!this.formData.date) {
      newErrors.date = 'Выберите дату';
    }

    this.errors = newErrors;
  }
}

export const accrualFormStore = new AccrualFormStore();