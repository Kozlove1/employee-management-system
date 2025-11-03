import type { EmployeeStats } from '$lib/types/shared'
import type { AccrualTypeStats } from '../types'

export const statisticsEmployees: EmployeeStats[] = [
	{
		employee_guid: '6b68a3b2-a041-11ef-9dad-00155de8647c',
		employee_name: 'Колногорова Олеся Александровна',
		ident: '0000-00283',
		total_balance: 7500,
		department_name: 'Цех теплогазоснабжения'
	},
	{
		employee_guid: 'c604d015-a041-11ef-9dad-00155de8647c',
		employee_name: 'Абрахманов Ильшат Ришатович',
		ident: '0000-00468',
		total_balance: 6800,
		department_name: 'Цех теплогазоснабжения'
	},
	{
		employee_guid: 'd705e016-a041-11ef-9dad-00155de8647c',
		employee_name: 'Абдулганеев Ильназар Альфредович',
		ident: '0000-01860',
		total_balance: 6200,
		department_name: 'Участок внутриплощадочного водоснабжения'
	},
	{
		employee_guid: 'e806f017-a041-11ef-9dad-00155de8647c',
		employee_name: 'Абдуллина Надежа Маскутовна',
		ident: '0000-01656',
		total_balance: 5900,
		department_name: 'Цех химводоподготовки'
	},
	{
		employee_guid: 'f907a018-a041-11ef-9dad-00155de8647c',
		employee_name: 'Абдуллин Алмаз Ришатович',
		ident: '0000-02347',
		total_balance: 5400,
		department_name: 'Цех химводоподготовки'
	},
	{
		employee_guid: '0a08b119-a041-11ef-9dad-00155de8647c',
		employee_name: 'Макаров Дмитрий Юрьевич',
		ident: '0000-03125',
		total_balance: 4800,
		department_name: 'Цех теплогазоснабжения'
	},
	{
		employee_guid: '1b19c21a-a041-11ef-9dad-00155de8647c',
		employee_name: 'Разбойкин Юрий Павлович',
		ident: '0000-04189',
		total_balance: 4200,
		department_name: 'Участок внутриплощадочного водоснабжения'
	},
	{
		employee_guid: '2c2ad31b-a041-11ef-9dad-00155de8647c',
		employee_name: 'Смирнова Анна Владимировна',
		ident: '0000-05234',
		total_balance: 3800,
		department_name: 'Цех химводоподготовки'
	},
	{
		employee_guid: '3d3be41c-a041-11ef-9dad-00155de8647c',
		employee_name: 'Петров Игорь Сергеевич',
		ident: '0000-06178',
		total_balance: 3200,
		department_name: 'Цех теплогазоснабжения'
	},
	{
		employee_guid: '4e4cf51d-a041-11ef-9dad-00155de8647c',
		employee_name: 'Козлова Елена Михайловна',
		ident: '0000-07192',
		total_balance: 2800,
		department_name: 'Участок внутриплощадочного водоснабжения'
	}
]

export function getTopEmployeesByBalance(limit: number = 10): EmployeeStats[] {
	const employeesWithRandomBalance = statisticsEmployees.map((emp) => ({
		...emp,
		total_balance: Math.floor(Math.random() * 8000) + 2000
	}))

	return employeesWithRandomBalance
		.sort((a, b) => b.total_balance - a.total_balance)
		.slice(0, limit)
}

export const accrualTypesStatistics: AccrualTypeStats[] = [
	{
		type_guid: '1a2b3c4d-5e6f-7g8h-9i0j-k1l2m3n4o5p6',
		type_name: 'Участие в гонке героев',
		category: 'Спортивное',
		total_count: 5,
		unique_employees: 5,
		total_amount: 8000,
		average_amount: 1600,
		has_fixed_amount: true
	},
	{
		type_guid: '2b3c4d5e-6f7g-8h9i-0j1k-l2m3n4o5p6q7',
		type_name: 'Тестовая награда 3',
		category: 'Тестовая награда 3',
		total_count: 3,
		unique_employees: 3,
		total_amount: 4120,
		average_amount: 1373,
		has_fixed_amount: false
	},
	{
		type_guid: '3c4d5e6f-7g8h-9i0j-1k2l-m3n4o5p6q7r8',
		type_name: 'Тестовая награда 2',
		category: 'Тестовая награда 2',
		total_count: 2,
		unique_employees: 2,
		total_amount: 600,
		average_amount: 300,
		has_fixed_amount: true
	},
	{
		type_guid: '4d5e6f7g-8h9i-0j1k-2l3m-n4o5p6q7r8s9',
		type_name: 'Тестовая награда',
		category: 'тест',
		total_count: 2,
		unique_employees: 2,
		total_amount: 130,
		average_amount: 65,
		has_fixed_amount: false
	},
	{
		type_guid: '5e6f7g8h-9i0j-1k2l-3m4n-o5p6q7r8s9t0',
		type_name: 'Прохождение испытательного срока',
		category: 'Прохождение испытательного срока',
		total_count: 2,
		unique_employees: 2,
		total_amount: 1000,
		average_amount: 500,
		has_fixed_amount: true
	},
	{
		type_guid: '6f7g8h9i-0j1k-2l3m-4n5o-p6q7r8s9t0u1',
		type_name: 'Предложение по рационализации',
		category: 'Предложение по рационализации',
		total_count: 2,
		unique_employees: 2,
		total_amount: 7800,
		average_amount: 3900,
		has_fixed_amount: false
	},
	{
		type_guid: '7g8h9i0j-1k2l-3m4n-5o6p-q7r8s9t0u1v2',
		type_name: 'Достижение KPI',
		category: 'Производственное',
		total_count: 8,
		unique_employees: 6,
		total_amount: 12000,
		average_amount: 1500,
		has_fixed_amount: false
	},
	{
		type_guid: '8h9i0j1k-2l3m-4n5o-6p7q-r8s9t0u1v2w3',
		type_name: 'Участие в корпоративе',
		category: 'Корпоративное',
		total_count: 15,
		unique_employees: 12,
		total_amount: 4500,
		average_amount: 300,
		has_fixed_amount: true
	},
	{
		type_guid: '9i0j1k2l-3m4n-5o6p-7q8r-s9t0u1v2w3x4',
		type_name: 'Обучение и развитие',
		category: 'Развитие',
		total_count: 4,
		unique_employees: 4,
		total_amount: 2000,
		average_amount: 500,
		has_fixed_amount: true
	},
	{
		type_guid: '0j1k2l3m-4n5o-6p7q-8r9s-t0u1v2w3x4y5',
		type_name: 'Инновационная идея',
		category: 'Инновации',
		total_count: 1,
		unique_employees: 1,
		total_amount: 5000,
		average_amount: 5000,
		has_fixed_amount: false
	}
]

export function getTopAccrualTypesByCount(limit: number = 10): AccrualTypeStats[] {
	return accrualTypesStatistics
		.sort((a, b) => b.total_count - a.total_count)
		.slice(0, limit)
}

export function getStatisticsSummary() {
	const totalBalance = statisticsEmployees.reduce((sum, emp) => sum + emp.total_balance, 0)
	const averageBalance = Math.round(totalBalance / statisticsEmployees.length)

	return {
		total_employees: statisticsEmployees.length,
		total_balance: totalBalance,
		average_balance: averageBalance
	}
}
