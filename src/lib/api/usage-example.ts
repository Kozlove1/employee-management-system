// Пример использования нового axios-based API

import {
    accrualsApi,
    accrualTypesApi,
    authService,
    employeesApi,
    statisticsApi
} from '$lib/api'

// 1. Инициализация API (автоматически при импорте)
// initializeApi() // Вызывается автоматически

// 2. Работа с авторизацией
export async function loginExample() {
	// Установка токена после успешной авторизации
	authService.setToken({
		accessToken: 'your-jwt-token',
		refreshToken: 'your-refresh-token',
		expiresAt: new Date(Date.now() + 3600000) // 1 час
	})

	// Установка пользователя
	authService.setUser({
		id: 'user-123',
		email: 'user@example.com',
		name: 'John Doe',
		roles: ['admin', 'user']
	})

	// Проверка авторизации
	if (authService.isAuthenticated()) {
		console.log('User is authenticated')
	}
}

// 3. Работа с сотрудниками
export async function employeesExample() {
	try {
		// Получение всех сотрудников с фильтрацией
		const response = await employeesApi.getAll({
			page: 1,
			limit: 20,
			search: 'Иван',
			department_guid: 'dept-123',
			active_only: true
		})

		if (response.status === 'success') {
			console.log('Employees:', response.data.employees)
		}

		// Получение конкретного сотрудника
		const employee = await employeesApi.getById('emp-123')
		console.log('Employee details:', employee.data.employee)

		// Создание нового сотрудника
		const newEmployee = await employeesApi.create({
			employee: 'Новый сотрудник',
			ident: '12345',
			email: 'new@example.com',
			sex: 'Мужской',
			department_guid: 'dept-123',
			position_name: 'Разработчик',
			dateemploy: '2024-01-01'
		})

		console.log('Created employee:', newEmployee.data.employee)

	} catch (error) {
		console.error('Error working with employees:', error)
	}
}

// 4. Работа с начислениями
export async function accrualsExample() {
	try {
		// Получение начислений с фильтрацией
		const accruals = await accrualsApi.getAll({
			page: 1,
			limit: 50,
			employee_guid: 'emp-123',
			date_from: '2024-01-01',
			date_to: '2024-12-31'
		})

		console.log('Accruals:', accruals.data.accruals)

		// Создание нового начисления
		const newAccrual = await accrualsApi.create({
			employee_guid: 'emp-123',
			type_guid: 'type-456',
			amount: 1000,
			date: '2024-01-15',
			comment: 'Премия за отличную работу'
		})

		console.log('Created accrual:', newAccrual.data.accrual)

	} catch (error) {
		console.error('Error working with accruals:', error)
	}
}

// 5. Работа с типами начислений
export async function accrualTypesExample() {
	try {
		// Получение всех типов начислений
		const types = await accrualTypesApi.getAll({
			has_fixed_amount: true,
			sort: 'type_name',
			order: 'asc'
		})

		console.log('Accrual types:', types.data.accrualTypes)

		// Создание нового типа
		const newType = await accrualTypesApi.create({
			type_name: 'Новый тип начисления',
			ammo_coins_amount: 500
		})

		console.log('Created type:', newType.data.accrualType)

	} catch (error) {
		console.error('Error working with accrual types:', error)
	}
}

// 6. Работа со статистикой
export async function statisticsExample() {
	try {
		// Получение общей статистики
		const summary = await statisticsApi.getSummary({
			date_period: 'month'
		})

		console.log('Statistics summary:', summary.data.summary)

		// Получение статистики по сотрудникам
		const employeeStats = await statisticsApi.getEmployeeStats({
			department_guid: 'dept-123'
		})

		console.log('Employee stats:', employeeStats.data.employeeStats)

		// Получение объединенной статистики
		const combinedStats = await statisticsApi.getCombinedStats()
		console.log('Combined stats:', combinedStats.data)

	} catch (error) {
		console.error('Error working with statistics:', error)
	}
}

// 7. Обработка ошибок
export async function errorHandlingExample() {
	try {
		await employeesApi.getById('non-existent-id')
	} catch (error) {
		if (error instanceof Error) {
			console.error('API Error:', error.message)
			
			// Проверка типа ошибки
			if (error.message.includes('401')) {
				console.log('Unauthorized - need to login')
				authService.logout()
			} else if (error.message.includes('404')) {
				console.log('Resource not found')
			} else if (error.message.includes('500')) {
				console.log('Server error - try again later')
			}
		}
	}
}

// 8. Использование в Svelte компоненте
export function useEmployeesInComponent() {
	// В Svelte компоненте:
	/*
	<script lang="ts">
		import { employeesApi } from '$lib/api'
		import { onMount } from 'svelte'
		
		let employees = $state([])
		let isLoading = $state(false)
		let error = $state(null)
		
		onMount(async () => {
			isLoading = true
			try {
				const response = await employeesApi.getAll()
				if (response.status === 'success') {
					employees = response.data.employees
				}
			} catch (err) {
				error = err.message
			} finally {
				isLoading = false
			}
		})
	</script>
	
	{#if isLoading}
		<div>Loading...</div>
	{:else if error}
		<div class="error">{error}</div>
	{:else}
		{#each employees as employee}
			<div>{employee.employee}</div>
		{/each}
	{/if}
	*/
}
