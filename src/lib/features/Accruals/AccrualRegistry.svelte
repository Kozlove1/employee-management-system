<script lang="ts">
	import {
		ActionButton,
		EmptyState,
		ErrorMessage,
		IconRow,
		PaginationButton,
		RefreshButton,
		Skeleton
	} from '$lib/components/UI'
	import SearchFiltersPanel from '$lib/components/UI/SearchFiltersPanel.svelte'
	import { authStore } from '$lib/features/Auth'
	import { employeeStore } from '$lib/features/Employees/store/employeeStore.svelte'
	import { accrualTypesStore } from '$lib/features/TypesOfAccruals/store/accrualTypesStore.svelte'
	import { AccrualListItem, StatisticsCards } from './components'
	import AccrualForm from './Form/AccrualForm.svelte'
	import { accrualFormStore } from './store/accrualFormStore.svelte'
	import { accrualStore } from './store/accrualStore.svelte'
	import type { AccrualFormData, AccrualWithDetails } from './types'

	// Reactive state from stores
	const isLoading = $derived(accrualStore.getIsLoading())
	const error = $derived(accrualStore.getError())
	const filteredAccruals = $derived(accrualStore.filteredAccruals)
	const searchTerm = $derived(accrualStore.getSearchTerm())
	const selectedEmployee = $derived(accrualStore.getSelectedEmployee())
	const selectedType = $derived(accrualStore.getSelectedType())
	const selectedDepartment = $derived(accrualStore.getSelectedDepartment())
	const sortOrder = $derived(accrualStore.getSortOrder())
	const stats = $derived(accrualStore.getStats())
	const isStatsLoading = $derived(accrualStore.getIsStatsLoading())
	const currentPage = $derived(accrualStore.getCurrentPage())
	const totalPages = $derived(accrualStore.totalPages)
	const totalCount = $derived(accrualStore.getTotalCount())
	const accrualsCount = $derived(accrualStore.getAccruals().length)

	// Statistics data
	const statisticsValues = $derived({
		totalEmployees: employeeStore.getActiveEmployeesCount(),
		monthlyAccruals: stats?.monthly_accruals ?? 0,
		totalAccrualTypes: accrualTypesStore.getTotalCount(),
		totalAmount: stats?.total_amount ?? 0
	})

	// Filter options
	const employeeOptions = $derived(employeeStore.employeeOptions)
	const typeOptions = $derived(accrualTypesStore.typeOptions)

	let initialized = $state(false)
	$effect(() => {
		if (authStore.isAuthenticated && !initialized) {
			initialized = true
			accrualStore.initialize()
		}
	})

	// Form handlers
	async function handleFormSubmit(data: AccrualFormData) {
		const currentAccrual = accrualFormStore.getCurrentAccrual()
		if (currentAccrual) {
			await accrualStore.updateAccrual(currentAccrual.accrual_guid, data)
		} else {
			await accrualStore.createAccrual(data)
		}
	}

	function handleEditAccrual(accrual: AccrualWithDetails) {
		accrualFormStore.openForEdit(accrual)
	}

	async function handleDeleteAccrual(accrualGuid: string) {
		await accrualStore.deleteAccrual(accrualGuid)
	}
</script>

<div class="space-y-6">
	{#if error}
		<ErrorMessage
			message={error}
			onRetry={() => accrualStore.refresh()}
			onDismiss={() => accrualStore.clearError()}
		/>
	{/if}

	<!-- Statistics Cards -->
	{#if isStatsLoading}
		<div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
			<Skeleton type="stat-card" count={4} />
		</div>
	{:else}
		<StatisticsCards {statisticsValues} />
	{/if}

	<!-- Header and Filters -->
	<div class="rounded-lg border border-gray-200 bg-white shadow-sm">
		<div class="flex items-center justify-between border-b border-gray-200 px-6 py-4">
			<IconRow
				title="Начисления АммоКоинов"
				icon={'coins'}
				titleSize="2xl"
				titleColor="text-neutral-900"
				iconSize="xl"
				iconColor="blue"
			/>
			<ActionButton
				onClick={() => accrualFormStore.openForCreate()}
				disabled={isLoading}
				text="Добавить начисление"
			/>
		</div>

		<div class="p-6">
			<SearchFiltersPanel
				searchValue={searchTerm}
				searchPlaceholder="Поиск по комментарию"
				disabled={isLoading}
				resetDisabled={isLoading}
				onSearch={(value) => accrualStore.setSearchTerm(value)}
				onReset={() => accrualStore.resetFilters()}
				showEmployeeFilter={true}
				employeeValue={selectedEmployee}
				{employeeOptions}
				onEmployeeChange={(value) => accrualStore.setSelectedEmployee(value)}
				showDepartmentFilter={true}
				departmentValue={selectedDepartment}
				onDepartmentChange={(value) => accrualStore.setSelectedDepartment(value)}
				showTypeFilter={true}
				typeValue={selectedType}
				{typeOptions}
				onTypeChange={(value) => accrualStore.setSelectedType(value)}
				showSortFilter={true}
				sortValue={sortOrder}
				onSortChange={(value) => accrualStore.setSortOrder(value as 'newest' | 'oldest')}
				customFilters={true}
			>
				<RefreshButton onClick={() => accrualStore.refresh()} {isLoading} variant="info" />
			</SearchFiltersPanel>

			<!-- Pagination Info -->
			<div class="mt-4">
				<div class="flex flex-col items-center justify-between sm:flex-row">
					<div class="mb-2 flex flex-row gap-2 text-sm text-neutral-500 sm:mb-0">
						<div>Найдено {totalCount} начислений</div>
						<div class="text-neutral-500">•</div>
						<div>Показано {filteredAccruals.length} на странице {currentPage} из {totalPages}</div>
					</div>

					{#if totalPages > 1}
						<PaginationButton
							{currentPage}
							{totalPages}
							onPrevPage={() => accrualStore.prevPage()}
							onNextPage={() => accrualStore.nextPage()}
						/>
					{/if}
				</div>
			</div>
		</div>
	</div>

	<!-- Accruals List -->
	<div class="space-y-3">
		{#if isLoading && accrualsCount === 0}
			<Skeleton type="list-item" count={5} />
		{:else if filteredAccruals.length === 0}
			<EmptyState
				showButton={true}
				buttonText="Добавить начисление"
				buttonAction={() => accrualFormStore.openForCreate()}
				title="Нет начислений"
				description="Начните с добавления первого начисления"
				disabled={isLoading}
			/>
		{:else}
			{#each filteredAccruals as accrual}
				<AccrualListItem {accrual} onEdit={handleEditAccrual} onDelete={handleDeleteAccrual} />
			{/each}
		{/if}
	</div>

	<!-- Bottom Pagination -->
	{#if totalPages > 1}
		<div class="flex justify-center">
			<PaginationButton
				{currentPage}
				{totalPages}
				onPrevPage={() => accrualStore.prevPage()}
				onNextPage={() => accrualStore.nextPage()}
			/>
		</div>
	{/if}
</div>

<!-- Accrual Form Modal -->
<AccrualForm onSubmit={handleFormSubmit} />
