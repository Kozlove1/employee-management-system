import type { EmployeeStats } from '$lib/types';

export const statisticsEmployees: EmployeeStats[] = [
  {
    employee_guid: "6b68a3b2-a041-11ef-9dad-00155de8647c",
    employee_name: "Колногорова Олеся Александровна",
    ident: "0000-00283",
    total_balance: 7500,
    department_name: "Цех теплогазоснабжения"
  },
  {
    employee_guid: "c604d015-a041-11ef-9dad-00155de8647c",
    employee_name: "Абрахманов Ильшат Ришатович",
    ident: "0000-00468",
    total_balance: 6800,
    department_name: "Цех теплогазоснабжения"
  },
  {
    employee_guid: "d705e016-a041-11ef-9dad-00155de8647c",
    employee_name: "Абдулганеев Ильназар Альфредович",
    ident: "0000-01860",
    total_balance: 6200,
    department_name: "Участок внутриплощадочного водоснабжения"
  },
  {
    employee_guid: "e806f017-a041-11ef-9dad-00155de8647c",
    employee_name: "Абдуллина Надежа Маскутовна",
    ident: "0000-01656",
    total_balance: 5900,
    department_name: "Цех химводоподготовки"
  },
  {
    employee_guid: "f907a018-a041-11ef-9dad-00155de8647c",
    employee_name: "Абдуллин Алмаз Ришатович",
    ident: "0000-02347",
    total_balance: 5400,
    department_name: "Цех химводоподготовки"
  },
  {
    employee_guid: "0a08b119-a041-11ef-9dad-00155de8647c",
    employee_name: "Макаров Дмитрий Юрьевич",
    ident: "0000-03125",
    total_balance: 4800,
    department_name: "Цех теплогазоснабжения"
  },
  {
    employee_guid: "1b19c21a-a041-11ef-9dad-00155de8647c",
    employee_name: "Разбойкин Юрий Павлович",
    ident: "0000-04189",
    total_balance: 4200,
    department_name: "Участок внутриплощадочного водоснабжения"
  },
  {
    employee_guid: "2c2ad31b-a041-11ef-9dad-00155de8647c",
    employee_name: "Смирнова Анна Владимировна",
    ident: "0000-05234",
    total_balance: 3800,
    department_name: "Цех химводоподготовки"
  },
  {
    employee_guid: "3d3be41c-a041-11ef-9dad-00155de8647c",
    employee_name: "Петров Игорь Сергеевич",
    ident: "0000-06178",
    total_balance: 3200,
    department_name: "Цех теплогазоснабжения"
  },
  {
    employee_guid: "4e4cf51d-a041-11ef-9dad-00155de8647c",
    employee_name: "Козлова Елена Михайловна",
    ident: "0000-07192",
    total_balance: 2800,
    department_name: "Участок внутриплощадочного водоснабжения"
  }
];

export function getTopEmployeesByBalance(limit: number = 10): EmployeeStats[] {
  const employeesWithRandomBalance = statisticsEmployees.map(emp => ({
    ...emp,
    total_balance: Math.floor(Math.random() * 8000) + 2000
  }));
  
  return employeesWithRandomBalance
    .sort((a, b) => b.total_balance - a.total_balance)
    .slice(0, limit);
}

export function getStatisticsSummary() {
  const totalBalance = statisticsEmployees.reduce((sum, emp) => sum + emp.total_balance, 0);
  const averageBalance = Math.round(totalBalance / statisticsEmployees.length);
  
  return {
    totalEmployees: statisticsEmployees.length,
    totalBalance,
    averageBalance
  };
}
