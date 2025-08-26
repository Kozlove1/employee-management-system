export interface StatCardData {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: 'blue' | 'yellow' | 'green' | 'gray';
  valueKey: string;
  format?: 'number' | 'currency' | 'text';
  currency?: string;
}

export const statisticsCards: StatCardData[] = [
  {
    id: 'total-employees',
    title: 'Всего сотрудников',
    subtitle: 'Активные сотрудники',
    icon: 'users',
    color: 'blue',
    valueKey: 'totalEmployees',
    format: 'number'
  },
  {
    id: 'monthly-accruals',
    title: 'Начислений за месяц',
    subtitle: 'Начислено в этом месяце',
    icon: 'calendar',
    color: 'yellow',
    valueKey: 'monthlyAccruals',
    format: 'number'
  },
  {
    id: 'accrual-types',
    title: 'Типы начислений',
    subtitle: 'Доступных типов',
    icon: 'tags',
    color: 'green',
    valueKey: 'totalAccrualTypes',
    format: 'number'
  },
  {
    id: 'total-amount',
    title: 'Общая сумма',
    subtitle: 'Начислено в этом месяце',
    icon: 'wallet',
    color: 'gray',
    valueKey: 'totalAmount',
    format: 'currency',
    currency: 'AK'
  }
];

// Функция для форматирования значений
export function formatStatValue(value: any, format?: string, currency?: string): string {
  if (format === 'currency' && currency) {
    return `${value} ${currency}`;
  }
  if (format === 'number' && typeof value === 'number') {
    return value.toLocaleString();
  }
  return String(value);
}
