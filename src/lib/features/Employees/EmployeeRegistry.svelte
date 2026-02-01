<script lang="ts">
import {
	EmptyState,
	ErrorMessage,
	IconRow,
	PaginationButton,
	RefreshButton,
	Skeleton
} from '$lib/components/UI'
import AccrualForm from '$lib/features/Accruals/Form/AccrualForm.svelte'
import SearchFiltersPanel from '$lib/components/UI/SearchFiltersPanel.svelte'

	import { accrualStore } from '$lib/features/Accruals/store/accrualStore.svelte'
	import { departmentsStore } from '$lib/stores/departmentsStore.svelte'
	import { getAppContainerStyle } from '$lib/utils'
	import type { AccrualFormData } from '../Accruals/types'
	import { EmployeeCard } from './components'
	import { employeeStore } from './store/employeeStore.svelte'

	const isLoading = $derived(employeeStore.getIsLoading())
	const error = $derived(employeeStore.getError())
	const paginatedEmployees = $derived(employeeStore.paginatedEmployees)
	const currentPage = $derived(employeeStore.getCurrentPage())
	const totalPages = $derived(employeeStore.totalPages)
	const totalCount = $derived(employeeStore.getTotalCount())
	const isExactCount = $derived(employeeStore.getIsExactCount())
	const searchTerm = $derived(employeeStore.getSearchTerm())
	const selectedDepartment = $derived(employeeStore.getSelectedDepartment())
	const activeOnly = $derived(employeeStore.getActiveOnly())
	const itemsPerPage = $derived(employeeStore.getItemsPerPage())

	let initialized = $state(false)

	$effect(() => {
		if (!initialized) {
			initialized = true
			departmentsStore.initialize()
			employeeStore.fetchEmployees()
		}
	})

	async function handleAccrualAdded() {
		// Обновляем данные сотрудников и начислений
		await Promise.all([
			employeeStore.refreshData(),
			accrualStore.fetchAccruals()
		])
	}

	async function handleAccrualSubmit(data: AccrualFormData) {
		try {
			// Создаем начисление без автоматического обновления (обновим вручную)
			await accrualStore.createAccrual(data, { refreshAccruals: false })
			await handleAccrualAdded()
		} catch (error) {
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
		<SearchFiltersPanel
			searchValue={searchTerm}
			searchPlaceholder="Поиск по имени или ID..."
			disabled={isLoading}
			resetDisabled={isLoading}
			onSearch={(value) => employeeStore.setSearchTerm(value)}
			onReset={() => employeeStore.clearFilters()}
			showDepartmentFilter={true}
			departmentValue={selectedDepartment}
			onDepartmentChange={(value: string) => employeeStore.setDepartmentFilter(value)}
			showActiveOnly={true}
			activeOnlyValue={activeOnly}
			onActiveOnlyChange={(value: boolean) => employeeStore.setActiveOnlyFilter(value)}
			showItemsPerPage={true}
			itemsPerPageValue={itemsPerPage}
			onItemsPerPageChange={(value: number) => employeeStore.setItemsPerPage(value)}
			customFilters={true}
		>
			<RefreshButton onClick={() => employeeStore.refreshData()} {isLoading} variant="info" />
		</SearchFiltersPanel>

		<!-- Pagination and statistics -->
		<div class="mt-4">
			<div class="flex flex-col items-center justify-between sm:flex-row">
				<div class="mb-2 flex flex-row gap-2 text-sm text-neutral-500 sm:mb-0">
					<div>
						Найдено {isExactCount ? totalCount : `${totalCount}+`} сотрудников
					</div>
					<div class="text-neutral-500">•</div>
					<div>
						Показано {paginatedEmployees.length} на странице {currentPage} из {totalPages}
					</div>
				</div>

				<PaginationButton
					{currentPage}
					{totalPages}
					onPrevPage={() => employeeStore.prevPage()}
					onNextPage={() => employeeStore.nextPage()}
				/>
			</div>
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
			{#each paginatedEmployees as employee (employee.employee_guid || employee.ident || `${employee.employee}-${employee.department_guid}`)}
				<EmployeeCard {employee} />
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
