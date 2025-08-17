export interface Organization {
  org_guid: string;
}

export interface Department {
  org_guid: string;
  department: string;
  department_guid: string;
  department_code: string;
  parentdep_guid?: string;
  datecreate: string;
  datedisband: string;
  headofdep_guid?: string;
}

export interface Position {
  position_guid: string;
  position_name: string;
  department_guid: string;
}

export interface Employee {
  org_guid: string;
  post_guid: string;
  ident: string;
  employee: string;
  employee_guid: string;
  dateemploy: string;
  datedismis: string;
  email: string;
  sex: string;
  person_guid: string;
  department_guid: string;
}

export interface Accrual {
  org_guid: string;
  post_guid: string;
  post: string;
  department_guid: string;
  datecreate: string;
  datedisband: string;
}

export interface AccrualType {
  type_guid: string;
  type_name: string;
  amount: number;
}

// UI типы для отображения
export interface EmployeeWithDetails extends Employee {
  department_name: string;
  position_name: string;
  balance: number;
}

export interface AccrualWithDetails extends Accrual {
  employee_name?: string;
  type_name?: string;
  amount?: number;
  comment?: string;
}

export interface DepartmentWithDetails extends Department {
  employee_count?: number;
  head_name?: string;
}

// Типы для форм
export interface AccrualFormData {
  employee_guid: string;
  type_guid: string;
  amount: number;
  date?: string;
  comment?: string;
}

export interface EmployeeFormData {
  employee: string;
  ident: string;
  email: string;
  sex: 'Мужской' | 'Женский';
  department_guid: string;
  position_name: string;
  dateemploy: string;
}

// Типы для статистики
export interface EmployeeStats {
  employee_guid: string;
  employee_name: string;
  ident: string;
  total_balance: number;
  department_name: string;
}

export interface DepartmentStats {
  department_guid: string;
  department_name: string;
  total_employees: number;
  total_accruals: number;
  average_balance: number;
}

// Утилитарные типы
export type SortDirection = 'asc' | 'desc';
export type ViewMode = 'employees' | 'accruals' | 'departments' | 'positions' | 'statistics';

export interface FilterOptions {
  search?: string;
  department_guid?: string;
  active_only?: boolean;
  date_from?: string;
  date_to?: string;
}

