<script lang="ts">
	import {
		ActionButton,
		EmptyState,
		FilterSelect,
		IconRow,
		SearchInput,
		Skeleton
	} from '$lib/components/UI'
	import { mockEmployees } from '$lib/features/Employees/mocks/employeesMockData'
	import { accrualTypesStore } from '$lib/features/TypesOfAccruals/store/accrualTypesStore.svelte'
	import { AccrualListItem, StatisticsCards } from './components'
	import AccrualForm from './Form/AccrualForm.svelte'
	import { accrualFormStore } from './store/accrualFormStore.svelte'
	import { accrualStore } from './store/accrualStore.svelte'
	import type { AccrualFormData, AccrualWithDetails } from './types'

	// Reactive variables using $derived with store getters
	let isLoading = $derived(accrualStore.getIsLoading())
	let error = $derived(accrualStore.getError())
	let accruals = $derived(accrualStore.getAccruals())
	let filteredAccruals = $derived(accrualStore.filteredAccruals)
	let searchTerm = $derived(accrualStore.getSearchTerm())
	let selectedEmployee = $derived(accrualStore.getSelectedEmployee())
	let selectedType = $derived(accrualStore.getSelectedType())
	let sortOrder = $derived(accrualStore.getSortOrder())
	let uniqueEmployees = $derived(accrualStore.uniqueEmployees)
	let uniqueTypes = $derived(accrualStore.uniqueTypes)
	let stats = $derived(accrualStore.stats)

	let totalEmployees = $derived(() => mockEmployees.length)
	let totalAccrualTypes = $derived(() => accrualTypesStore.types.length)

	let statisticsValues = $derived(() => {
		return {
			totalEmployees: totalEmployees(),
			monthlyAccruals: stats.monthlyCount,
			totalAccrualTypes: totalAccrualTypes(),
			totalAmount: stats.monthlyAmount
		}
	})

	// Initialize store on component mount
	$effect(() => {
		accrualStore.initialize()
	})

	async function handleAddAccrual(data: AccrualFormData) {
		await accrualStore.createAccrual(data)
	}

	function handleEditAccrual(accrualToEdit: AccrualWithDetails) {
		accrualFormStore.openForEdit(accrualToEdit)
	}

	async function handleUpdateAccrual(data: AccrualFormData) {
		const currentAccrual = accrualFormStore.getCurrentAccrual()

		if (!currentAccrual) {
			console.error('Failed to update accrual: not found')
			return
		}

		await accrualStore.updateAccrual(currentAccrual.post_guid, data)
	}

	async function handleDeleteAccrual(accrualGuid: string) {
		try {
			await accrualStore.deleteAccrual(accrualGuid)
		} catch (error) {
			// Ошибка уже обработана в store
			console.error('Failed to delete accrual:', error)
		}
	}

	function resetFilters() {
		accrualStore.resetFilters()
	}

	function handleSearchChange(value: string) {
		accrualStore.setSearchTerm(value)
	}

	function handleEmployeeChange(value: string) {
		accrualStore.setSelectedEmployee(value)
	}

	function handleTypeChange(value: string) {
		accrualStore.setSelectedType(value)
	}

	function handleSortOrderChange(value: string) {
		accrualStore.setSortOrder(value as 'newest' | 'oldest')
	}

	async function handleFormSubmit(data: AccrualFormData) {
		const currentAccrual = accrualFormStore.getCurrentAccrual()

		if (currentAccrual) {
			await handleUpdateAccrual(data)
		} else {
			await handleAddAccrual(data)
		}
	}
</script>

<div class="space-y-6">
	<!-- Карточки статистики -->
	{#if isLoading}
		<div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
			<Skeleton type="stat-card" count={4} />
		</div>
	{:else}
		<StatisticsCards statisticsValues={statisticsValues()} {isLoading} />
	{/if}

	<!-- Заголовок и поиск -->
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
				onClick={() => {
					accrualFormStore.openForCreate()
				}}
				disabled={isLoading}
				text="Добавить начисление"
			/>
		</div>

		<div class="p-6">
			{#if isLoading}
				<Skeleton type="search-filters" />
			{:else}
				<div class="grid grid-cols-1 gap-4 lg:grid-cols-5">
					<!-- Поисковая строка -->
					<div class="lg:col-span-2">
						<SearchInput
							value={searchTerm}
							placeholder="Поиск по сотруднику, типу, комментарию"
							bgColor="bg-white"
							borderColor="border-gray-300"
							rounded="rounded-lg"
							onChange={handleSearchChange}
						/>
					</div>

					<!-- Селектор сотрудников -->
					<FilterSelect
						value={selectedEmployee}
						options={[
							{
								value: '',
								label: `Все сотрудники (${uniqueEmployees.length})`
							},
							...uniqueEmployees.map((employee) => ({
								value: employee.employee_guid,
								label: employee.employee_name
							}))
						]}
						onChange={handleEmployeeChange}
					/>

					<!-- Селектор типов -->
					<FilterSelect
						value={selectedType}
						options={[
							{ value: '', label: `Все типы (${uniqueTypes.length})` },
							...uniqueTypes.map((type) => ({ value: type.type_guid, label: type.type_name }))
						]}
						onChange={handleTypeChange}
					/>

					<!-- Селектор сортировки -->
					<FilterSelect
						value={sortOrder}
						options={[
							{ value: 'newest', label: 'От новых к старым' },
							{ value: 'oldest', label: 'От старым к новым' }
						]}
						onChange={handleSortOrderChange}
					/>
				</div>

				<!-- Статистика по фильтрам -->
				<div class="mt-4 text-sm text-gray-600">
					Всего: <span class="font-semibold">{filteredAccruals.length} начислений</span>
				</div>
			{/if}
		</div>
	</div>

	<!-- Список начислений -->
	<div class="space-y-3">
		{#if isLoading}
			<Skeleton type="list-item" count={5} />
		{:else}
			{#each filteredAccruals as accrual}
				<AccrualListItem {accrual} onEdit={handleEditAccrual} onDelete={handleDeleteAccrual} />
			{/each}

			{#if filteredAccruals.length === 0}
				<EmptyState
					showButton={true}
					buttonText="Добавить начисление"
					buttonAction={() => accrualFormStore.openForCreate()}
					title="Нет начислений"
					description="Начните с добавления первого начисления"
					disabled={isLoading}
				/>
			{/if}
		{/if}
	</div>
</div>

<!-- Модальная форма -->
<AccrualForm onSubmit={handleFormSubmit} />
