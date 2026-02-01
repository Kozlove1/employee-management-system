<script lang="ts">
	import DepartmentFilterSelect from '$lib/features/Employees/components/DepartmentFilterSelect.svelte'
	import type { Snippet } from 'svelte'
	import FilterSelect from './FilterSelect.svelte'
	import SearchInput from './SearchInput.svelte'

	interface FilterOption {
		value: string
		label: string
	}

	type Props = {
		// Search
		searchValue?: string
		searchPlaceholder?: string
		onSearch?: (value: string) => void

		// Employee filter
		showEmployeeFilter?: boolean
		employeeValue?: string
		employeeOptions?: FilterOption[]
		onEmployeeChange?: (value: string) => void

		// Department filter
		showDepartmentFilter?: boolean
		departmentValue?: string
		onDepartmentChange?: (value: string) => void

		// Type filter
		showTypeFilter?: boolean
		typeValue?: string
		typeOptions?: FilterOption[]
		onTypeChange?: (value: string) => void

		// Custom type filter (for accrual types screen)
		showCustomTypeFilter?: boolean
		customTypeValue?: string
		customTypeOptions?: FilterOption[]
		onCustomTypeChange?: (value: string) => void

		// Sort filter
		showSortFilter?: boolean
		sortValue?: string
		sortOptions?: FilterOption[]
		onSortChange?: (value: string) => void

		// Active only checkbox
		showActiveOnly?: boolean
		activeOnlyValue?: boolean
		onActiveOnlyChange?: (value: boolean) => void

		// Items per page
		showItemsPerPage?: boolean
		itemsPerPageValue?: number
		itemsPerPageOptions?: FilterOption[]
		onItemsPerPageChange?: (value: number) => void

		// Reset
		resetLabel?: string
		resetDisabled?: boolean
		onReset?: () => void

		// Disabled state for all filters
		disabled?: boolean

		// Custom content for additional filters
		customFilters?: boolean
		children?: Snippet
	}

	const {
		// Search
		searchValue = '',
		searchPlaceholder = 'Поиск...',
		onSearch,

		// Employee filter
		showEmployeeFilter = false,
		employeeValue = '',
		employeeOptions = [],
		onEmployeeChange,

		// Department filter
		showDepartmentFilter = false,
		departmentValue = '',
		onDepartmentChange,

		// Type filter
		showTypeFilter = false,
		typeValue = '',
		typeOptions = [],
		onTypeChange,

		// Custom type filter
		showCustomTypeFilter = false,
		customTypeValue = '',
		customTypeOptions = [],
		onCustomTypeChange,

		// Sort filter
		showSortFilter = false,
		sortValue = 'newest',
		sortOptions = [
			{ value: 'newest', label: 'От новых к старым' },
			{ value: 'oldest', label: 'От старых к новым' }
		],
		onSortChange,

		// Active only checkbox
		showActiveOnly = false,
		activeOnlyValue = false,
		onActiveOnlyChange,

		// Items per page
		showItemsPerPage = false,
		itemsPerPageValue = 50,
		itemsPerPageOptions = [
			{ value: '25', label: '25 на странице' },
			{ value: '50', label: '50 на странице' },
			{ value: '100', label: '100 на странице' }
		],
		onItemsPerPageChange,

		// Reset
		resetLabel = 'Сбросить фильтры',
		resetDisabled = false,
		onReset,

		// Disabled state
		disabled = false,

		// Custom content
		customFilters = false,
		children
	}: Props = $props()

	function handleReset() {
		// Вызываем только глобальный reset handler, который сбросит все фильтры одним запросом
		// Не вызываем отдельные обработчики, чтобы избежать множественных запросов
		onReset?.()
	}

	const hasActiveFilters = $derived(
		searchValue ||
			employeeValue ||
			departmentValue ||
			typeValue ||
			customTypeValue ||
			(showActiveOnly && activeOnlyValue) ||
			(sortValue && sortValue !== 'newest')
	)
</script>

<div class="space-y-4">
	<!-- Search and Reset Row -->
	<div class="flex flex-col gap-3 lg:flex-row lg:items-end lg:gap-6">
		<div class="min-w-0 flex-1">
			<SearchInput
				value={searchValue}
				placeholder={searchPlaceholder}
				bgColor="bg-white"
				borderColor="border-neutral-300"
				rounded="rounded-lg"
				disabled={false}
				onChange={(value: string) => onSearch?.(value)}
			/>
		</div>
		<button
			type="button"
			onclick={handleReset}
			class="inline-flex items-center justify-center rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition hover:border-gray-400 hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
			disabled={resetDisabled || !hasActiveFilters}
		>
			{resetLabel}
		</button>
	</div>

	<!-- Active Only Checkbox Row -->
	{#if showActiveOnly}
		<div class="flex items-center gap-2">
			<input
				id="active-only"
				type="checkbox"
				checked={activeOnlyValue}
				{disabled}
				onchange={(event) => onActiveOnlyChange?.((event.target as HTMLInputElement).checked)}
				class="checkbox disabled:cursor-not-allowed disabled:opacity-50"
			/>
			<label for="active-only" class="text-sm text-neutral-900"> Только активные </label>
		</div>
	{/if}

	<!-- Filters Row -->
	{#if showEmployeeFilter || showDepartmentFilter || showTypeFilter || showCustomTypeFilter || showSortFilter || showItemsPerPage || customFilters}
		<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
			<div class="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{#if showEmployeeFilter}
					<FilterSelect
						value={employeeValue}
						options={employeeOptions}
						dropdownWidth="min-w-80"
						{disabled}
						onChange={(value) => onEmployeeChange?.(value)}
					/>
				{/if}

				{#if showDepartmentFilter}
					<DepartmentFilterSelect
						value={departmentValue}
						{disabled}
						onChange={(value) => onDepartmentChange?.(value)}
						fullWidth={true}
					/>
				{/if}

				{#if showTypeFilter}
					<FilterSelect
						value={typeValue}
						options={typeOptions}
						{disabled}
						onChange={(value) => onTypeChange?.(value)}
					/>
				{/if}

				{#if showCustomTypeFilter}
					<FilterSelect
						value={customTypeValue}
						options={customTypeOptions}
						{disabled}
						onChange={(value) => onCustomTypeChange?.(value)}
					/>
				{/if}

				{#if showSortFilter}
					<FilterSelect
						value={sortValue}
						options={sortOptions}
						allowClear={false}
						{disabled}
						onChange={(value) => onSortChange?.(value)}
					/>
				{/if}

				{#if showItemsPerPage}
					<FilterSelect
						value={String(itemsPerPageValue)}
						options={itemsPerPageOptions}
						bgColor="bg-primary-50"
						allowClear={false}
						{disabled}
						onChange={(value: string) => onItemsPerPageChange?.(Number(value))}
					/>
				{/if}
			</div>

			{#if customFilters && children}
				<div class="flex-shrink-0">
					{@render children()}
				</div>
			{/if}
		</div>
	{/if}
</div>
