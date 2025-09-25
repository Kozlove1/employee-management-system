<script lang="ts">
	import { getAppContainerStyle } from '$lib/utils'
	import { mockDepartments } from './mocks/employeesMockData'

	import { accrualStore } from '$lib/features/Accruals/store/accrualStore.svelte'
	import { employeeStore } from './store/employeeStore.svelte'

	import type { AccrualFormData } from '../Accruals/types'

	import {
		EmptyState,
		ErrorMessage,
		FilterSelect,
		IconRow,
		PaginationButton,
		RefreshButton,
		SearchInput,
		Skeleton
	} from '$lib/components/UI'
	import AccrualForm from '$lib/features/Accruals/Form/AccrualForm.svelte'
	import { EmployeeCard } from './components'

	let isLoading = $derived(employeeStore.getIsLoading())

	let error = $derived(employeeStore.getError())
	let apiEmployees = $derived(employeeStore.getApiEmployees())
	let filteredEmployees = $derived(employeeStore.filteredEmployees)
	let paginatedEmployees = $derived(employeeStore.paginatedEmployees)
	let currentPage = $derived(employeeStore.getCurrentPage())
	let totalPages = $derived(employeeStore.totalPages)
	let searchTerm = $derived(employeeStore.getSearchTerm())
	let selectedDepartment = $derived(employeeStore.getSelectedDepartment())
	let activeOnly = $derived(employeeStore.getActiveOnly())

	$effect(() => {
		if (apiEmployees.length === 0 && !isLoading && !error) {
			employeeStore.fetchEmployees()
		}
	})

	function handleAccrualAdded() {
		employeeStore.refreshData()
	}

	async function handleAccrualSubmit(data: AccrualFormData) {
		try {
			await accrualStore.createAccrual(data)
			handleAccrualAdded()
		} catch (error) {
			console.error('Ошибка при создании начисления:', error)
			throw error
		}
	}
</script>

<div class={getAppContainerStyle('min-h-screen bg-neutral-50')}>
	<header class="py-6">
		<IconRow
			title="Сотрудники"
			icon={'user'}
			titleSize="3xl"
			titleColor="text-neutral-900"
			iconSize="2xl"
			iconColor="blue"
		/>
		<p class="mt-2 text-sm text-neutral-600">Управление сотрудниками и их балансами АммоКоинов</p>
	</header>

	{#if error}
		<div class="mb-6">
			<ErrorMessage
				message={error}
				onRetry={() => employeeStore.retry()}
				onDismiss={() => employeeStore.clearError()}
			/>
		</div>
	{/if}

	<!-- Panel search and filters -->
	<div class="mb-6 rounded-lg border border-neutral-200 bg-primary-50 p-6 shadow-sm">
		<div class="flex flex-col items-center gap-4 lg:flex-row">
			{#if isLoading}
				<Skeleton type="search-panel" />
			{:else}
				<div class="min-w-0 flex-1">
					<SearchInput
						value={searchTerm}
						placeholder="Поиск по имени или ID..."
						bgColor="bg-primary-50"
						borderColor="border-neutral-300"
						rounded="rounded-md"
						onChange={(value: string) => employeeStore.setSearchTerm(value)}
					/>
				</div>

				<!-- Filter by departments -->
				<div class="w-48 flex-shrink-0">
					<FilterSelect
						value={selectedDepartment}
						options={[
							{ value: '', label: 'Все подразделения' },
							...mockDepartments.map((dept) => ({
								value: dept.department_guid,
								label: dept.department
							}))
						]}
						bgColor="bg-primary-50"
						onChange={(value: string) => employeeStore.setDepartmentFilter(value)}
					/>
				</div>

				<!-- Filter only active - fixed width -->
				<div class="flex flex-shrink-0 items-center">
					<input
						id="active-only"
						type="checkbox"
						checked={activeOnly}
						onchange={(e) =>
							employeeStore.setActiveOnlyFilter((e.target as HTMLInputElement).checked)}
						class="checkbox"
					/>
					<label for="active-only" class="ml-2 block whitespace-nowrap text-sm text-neutral-900">
						Только активные
					</label>
				</div>
			{/if}
			<RefreshButton onClick={() => employeeStore.refreshData()} {isLoading} variant="info" />
		</div>

		<!-- Pagination and statistics -->
		<div class="mt-4">
			{#if isLoading}
				<Skeleton type="pagination-stats" />
			{:else}
				<div class="flex flex-col items-center justify-between sm:flex-row">
					<div class="mb-2 flex flex-row gap-2 text-sm text-neutral-500 sm:mb-0">
						<div>
							Найдено {filteredEmployees.length} из {apiEmployees.length} сотрудников
						</div>
						<div class="text-neutral-500">•</div>
						<div>
							Показано {paginatedEmployees.length}
						</div>
					</div>

					<PaginationButton
						{currentPage}
						{totalPages}
						onPrevPage={() => employeeStore.prevPage()}
						onNextPage={() => employeeStore.nextPage()}
					/>
				</div>
			{/if}
		</div>
	</div>

	<!-- List of employees -->
	{#if isLoading}
		<Skeleton type="employee-grid" count={12} />
	{:else if paginatedEmployees.length === 0}
		<!-- Empty state -->
		<div class="col-span-full">
			<EmptyState
				showButton={true}
				buttonText="Сбросить фильтры"
				buttonAction={() => employeeStore.clearFilters()}
				title="Нет сотрудников"
				description="Начните с добавления первого сотрудника"
			/>
		</div>
	{:else}
		<!-- Employee cards -->
		<div class="grid grid-cols-1 gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
			{#each paginatedEmployees as employee (employee.employee_guid)}
				<EmployeeCard {employee} onAccrualAdded={handleAccrualAdded} />
			{/each}
		</div>
	{/if}

	<!-- Pagination at the bottom -->
	<div class="mt-8">
		<PaginationButton
			{currentPage}
			{totalPages}
			onPrevPage={() => employeeStore.prevPage()}
			onNextPage={() => employeeStore.nextPage()}
		/>
	</div>
</div>

<!-- Global accrual form -->
<AccrualForm onSubmit={handleAccrualSubmit} />
