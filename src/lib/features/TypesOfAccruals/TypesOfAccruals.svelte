<script lang="ts">
	import {
		ActionButton,
		EmptyState,
		ErrorMessage,
		IconRow,
		PaginationButton,
		RefreshButton,
		SearchFiltersPanel,
		Skeleton,
		StatCard
	} from '$lib/components/UI'
	import { authStore } from '$lib/features/Auth/store/authStore.svelte'
	import type { AccrualType } from '$lib/types/shared'
	import { accrualTypesApi } from './api/accrualTypesApi'
	import { TypeOfAccrualListItem } from './components'
	import TypeOfAccrualForm from './Form/TypeOfAccrualForm.svelte'
	import { accrualTypesStore } from './store/accrualTypesStore.svelte'
	import { typeOfAccrualFormStore } from './store/typeOfAccrualFormStore.svelte'
	import type { TypeOfAccrualFormData } from './types'

	const isLoading = $derived(accrualTypesStore.getIsLoading())
	const error = $derived(accrualTypesStore.getError())
	const types = $derived(accrualTypesStore.types)
	const totalCount = $derived(accrualTypesStore.getTotalCount())
	const currentPage = $derived(accrualTypesStore.getCurrentPage())
	const totalPages = $derived(accrualTypesStore.totalPages)
	const itemsPerPage = $derived(accrualTypesStore.getItemsPerPage())
	const searchTerm = $derived(accrualTypesStore.getSearchTerm())
	const sortOrder = $derived(accrualTypesStore.getSortOrder() === 'desc' ? 'newest' : 'oldest')

	$effect(() => {
		if (types.length === 0 && !isLoading && !error) {
			accrualTypesStore.initialize()
		}
	})

	const filteredTypes = $derived.by(() => {
		const hasFixed = accrualTypesStore.getHasFixedAmount()
		if (hasFixed === 'fixed') {
			return types.filter((type) => (type.ammo_coins_amount ?? 0) > 0)
		}
		return types
	})

	const stats = $derived.by(() => {
		return {
			total: types.length,
			withFixedAmount: types.filter((t) => (t.ammo_coins_amount ?? 0) > 0).length,
			withVariableAmount: types.filter((t) => (t.ammo_coins_amount ?? 0) === 0).length
		}
	})

	async function handleAddType(data: TypeOfAccrualFormData) {
		const user = authStore.getUser()
		if (!user?.org_guid) {
			throw new Error('Не удалось получить идентификатор организации')
		}

		const payload = {
			type_name: data.type_name,
			ammo_coins_amount: data.ammo_coins_amount ?? 0,
			org_guid: user.org_guid,
			date_create: new Date().toISOString()
		}

		await accrualTypesApi.create(payload)
	}

	function handleEditType(typeToEdit: AccrualType) {
		typeOfAccrualFormStore.openForEdit(typeToEdit)
	}

	async function handleUpdateType(data: TypeOfAccrualFormData) {
		const currentType = typeOfAccrualFormStore.getCurrentType()
		if (!currentType) return

		const payload = {
			type_name: data.type_name,
			ammo_coins_amount: data.ammo_coins_amount ?? 0
		}

		await accrualTypesApi.update(currentType.type_guid, payload)
	}

	async function handleDeleteType(typeGuid: string) {
		await accrualTypesApi.deleteType(typeGuid)
		accrualTypesStore.refresh()
	}

	async function handleFormSubmit(data: TypeOfAccrualFormData) {
		const currentType = typeOfAccrualFormStore.getCurrentType()
		if (currentType) {
			await handleUpdateType(data)
		} else {
			await handleAddType(data)
		}
	}
</script>

<div class="space-y-6">
	{#if error}
		<ErrorMessage
			message={error}
			onRetry={() => accrualTypesStore.refresh()}
			onDismiss={() => accrualTypesStore.clearError()}
		/>
	{/if}

	{#if isLoading}
		<div class="grid grid-cols-2 gap-4 lg:grid-cols-3">
			<Skeleton type="stat-card" />
			<Skeleton type="stat-card" />
			<Skeleton type="stat-card" />
		</div>
	{:else}
		<div class="grid grid-cols-2 gap-4 lg:grid-cols-3">
			<StatCard
				title="Всего типов"
				value={String(stats.total)}
				subtitle="Типов начислений"
				icon="award"
				color="blue"
			/>
			<StatCard
				title="С фиксированной суммой"
				value={String(stats.withFixedAmount)}
				subtitle="АК автоматически"
				icon="coins"
				color="green"
			/>
			<StatCard
				title="С переменной суммой"
				value={String(stats.withVariableAmount)}
				subtitle="Сумма вручную"
				icon="chart"
				color="gray"
			/>
		</div>
	{/if}

	<div class="rounded-lg border border-gray-200 bg-white shadow-sm">
		<div class="flex items-center justify-between border-b border-gray-200 px-6 py-4">
			<IconRow
				title="Типы начислений"
				icon={'award'}
				titleSize="2xl"
				titleColor="text-neutral-900"
				iconSize="xl"
				iconColor="blue"
			/>
			<ActionButton
				onClick={() => typeOfAccrualFormStore.openForCreate()}
				disabled={isLoading}
				text="Добавить тип"
			/>
		</div>

		<div class="p-6">
			<SearchFiltersPanel
				searchValue={searchTerm}
				searchPlaceholder="Поиск по названию"
				disabled={isLoading}
				resetDisabled={isLoading}
				onSearch={(value) => {
					accrualTypesStore.setSearchTerm(value)
					accrualTypesStore.fetchTypes()
				}}
				onReset={() => {
					accrualTypesStore.setSearchTerm('')
					accrualTypesStore.setHasFixedAmount('')
					accrualTypesStore.setSort('date_create', 'desc')
					accrualTypesStore.fetchTypes()
				}}
				showCustomTypeFilter={true}
				customTypeValue={accrualTypesStore.getHasFixedAmount()}
				customTypeOptions={[
					{ value: '', label: 'Все типы' },
					{ value: 'fixed', label: 'Фиксированная сумма' },
					{ value: 'variable', label: 'Переменная сумма' }
				]}
				onCustomTypeChange={(value) => {
					accrualTypesStore.setHasFixedAmount(value)
					accrualTypesStore.fetchTypes()
				}}
				showSortFilter={true}
				sortValue={sortOrder}
				sortOptions={[
					{ value: 'newest', label: 'От новых к старым' },
					{ value: 'oldest', label: 'От старых к новым' }
				]}
				onSortChange={(value) => {
					const order = value === 'newest' ? 'desc' : 'asc'
					accrualTypesStore.setSort('date_create', order)
					accrualTypesStore.fetchTypes()
				}}
				showItemsPerPage={true}
				itemsPerPageValue={itemsPerPage}
				itemsPerPageOptions={[
					{ value: '25', label: '25 на странице' },
					{ value: '50', label: '50 на странице' },
					{ value: '100', label: '100 на странице' }
				]}
				onItemsPerPageChange={(value) => accrualTypesStore.setItemsPerPage(value)}
				customFilters={true}
			>
				<RefreshButton onClick={() => accrualTypesStore.refresh()} {isLoading} variant="info" />
			</SearchFiltersPanel>
			
			<div class="mt-4">
				<div class="flex flex-col items-center justify-between sm:flex-row">
					<div class="mb-2 flex flex-row gap-2 text-sm text-neutral-500 sm:mb-0">
						<div>Найдено {totalCount} типов</div>
						<div class="text-neutral-500">•</div>
						<div>Показано {filteredTypes.length} на странице {currentPage} из {totalPages}</div>
					</div>

					{#if totalPages > 1}
						<PaginationButton
							{currentPage}
							{totalPages}
							onPrevPage={() => accrualTypesStore.prevPage()}
							onNextPage={() => accrualTypesStore.nextPage()}
						/>
					{/if}
				</div>
			</div>
		</div>
	</div>

	{#if isLoading}
		<div class="space-y-3">
			<Skeleton type="list-item" />
			<Skeleton type="list-item" />
			<Skeleton type="list-item" />
		</div>
	{:else}
		<div class="space-y-3">
			{#each filteredTypes as typeOfAccrual}
				<TypeOfAccrualListItem
					{typeOfAccrual}
					onEdit={handleEditType}
					onDelete={handleDeleteType}
				/>
			{/each}

			{#if filteredTypes.length === 0}
				<EmptyState
					showButton={true}
					buttonText="Добавить тип"
					buttonAction={() => typeOfAccrualFormStore.openForCreate()}
					title="Нет типов начислений"
					description="Начните с добавления первого типа начисления"
					disabled={isLoading}
				/>
			{/if}
		</div>
	{/if}

	{#if totalPages > 1}
		<div class="mt-8">
			<PaginationButton
				{currentPage}
				{totalPages}
				onPrevPage={() => accrualTypesStore.prevPage()}
				onNextPage={() => accrualTypesStore.nextPage()}
			/>
		</div>
	{/if}
</div>

<TypeOfAccrualForm onSubmit={handleFormSubmit} />
