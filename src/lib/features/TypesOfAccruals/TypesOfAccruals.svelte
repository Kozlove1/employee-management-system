<script lang="ts">
	import {
		ActionButton,
		EmptyState,
		ErrorMessage,
		FilterSelect,
		IconRow,
		SearchInput,
		Skeleton,
		StatCard
	} from '$lib/components/UI'
	import type { AccrualType } from '$lib/types/shared'
	import { accrualTypesApi } from './api/accrualTypesApi'
	import { TypeOfAccrualListItem } from './components'
	import TypeOfAccrualForm from './Form/TypeOfAccrualForm.svelte'
	import { accrualTypesStore } from './store/accrualTypesStore.svelte'
	import { typeOfAccrualFormStore } from './store/typeOfAccrualFormStore.svelte'
	import type { TypeOfAccrualFormData } from './types'
	import { authStore } from '$lib/features/Auth/store/authStore.svelte'

	let searchTerm = $state('')
	let hasFixedAmount = $state('')
	let sortOrder = $state('newest')

	const isLoading = $derived(accrualTypesStore.getIsLoading())
	const error = $derived(accrualTypesStore.getError())
	const types = $derived(accrualTypesStore.types)

	let initialized = $state(false)

	$effect(() => {
		if (!initialized) {
			initialized = true
			accrualTypesStore.initialize()
		}
	})

	const filteredTypes = $derived.by(() => {
		let filtered: AccrualType[] = [...types]

		if (searchTerm) {
			const searchLower = searchTerm.toLowerCase()
			filtered = filtered.filter((type) => type.type_name.toLowerCase().includes(searchLower))
		}

		if (hasFixedAmount === 'fixed') {
			filtered = filtered.filter((type) => (type.ammo_coins_amount ?? 0) > 0)
		} else if (hasFixedAmount === 'variable') {
			filtered = filtered.filter((type) => (type.ammo_coins_amount ?? 0) === 0)
		}

		if (sortOrder === 'newest') {
			console.log('filtered', filtered[1])
			filtered.sort((a, b) => {
				const dateA = a.date_create ? new Date(a.date_create).getTime() : 0
				const dateB = b.date_create ? new Date(b.date_create).getTime() : 0
				return dateB - dateA
			})
		} else if (sortOrder === 'oldest') {
			filtered.sort((a, b) => {
				const dateA = a.date_create ? new Date(a.date_create).getTime() : 0
				const dateB = b.date_create ? new Date(b.date_create).getTime() : 0
				return dateA - dateB
			})
		} else if (sortOrder === 'name_asc') {
			filtered.sort((a, b) => a.type_name.localeCompare(b.type_name))
		} else if (sortOrder === 'name_desc') {
			filtered.sort((a, b) => b.type_name.localeCompare(a.type_name))
		}

		return filtered
	})

	const stats = $derived.by(() => {
		return {
			total: types.length,
			withFixedAmount: types.filter((t) => (t.ammo_coins_amount ?? 0) > 0).length,
			withVariableAmount: types.filter((t) => (t.ammo_coins_amount ?? 0) === 0).length
		}
	})

	async function handleAddType(data: TypeOfAccrualFormData) {
		try {
			// Получаем org_guid из текущего пользователя
			const user = authStore.getUser()
			if (!user?.org_guid) {
				throw new Error('Не удалось получить идентификатор организации')
			}

			// Переменный тип: ammo_coins_amount = 0
			// Фиксированный тип: ammo_coins_amount > 0
			const payload = {
				type_name: data.type_name,
				ammo_coins_amount: data.ammo_coins_amount === undefined ? 0 : data.ammo_coins_amount,
				org_guid: user.org_guid,
				date_create: new Date().toISOString(),
				date_delete: '',
				id: crypto.randomUUID()
			}

			console.log('[TypesOfAccruals] Creating type with payload:', payload)

			await accrualTypesApi.create(payload)
			// refresh() вызывается в typeOfAccrualFormStore.submitForm()
		} catch (error) {
			console.error('Error creating accrual type:', error)
			throw error
		}
	}

	function handleEditType(typeToEdit: AccrualType) {
		typeOfAccrualFormStore.openForEdit(typeToEdit)
	}

	async function handleUpdateType(data: TypeOfAccrualFormData) {
		const currentType = typeOfAccrualFormStore.getCurrentType()

		if (!currentType) return

		try {
			// Переменный тип: ammo_coins_amount = 0
			// Фиксированный тип: ammo_coins_amount > 0
			const payload: any = {
				type_guid: currentType.type_guid,
				type_name: data.type_name,
				ammo_coins_amount: data.ammo_coins_amount === undefined ? 0 : data.ammo_coins_amount
			}

			await accrualTypesApi.update(payload)
			// refresh() вызывается в typeOfAccrualFormStore.submitForm()
		} catch (error) {
			console.error('Error updating accrual type:', error)
			throw error
		}
	}

	async function handleDeleteType(typeGuid: string) {
		try {
			await accrualTypesApi.deleteType(typeGuid)
			accrualTypesStore.refresh()
		} catch (error) {
			console.error('Error deleting type:', error)
		}
	}

	function handleFixedAmountChange(value: string) {
		hasFixedAmount = value
	}

	function handleSortOrderChange(value: string) {
		sortOrder = value
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
				onClick={() => {
					typeOfAccrualFormStore.openForCreate()
				}}
				disabled={isLoading}
				text="Добавить тип"
			/>
		</div>

		<div class="p-6">
			<div class="grid grid-cols-1 gap-4 lg:grid-cols-4">
				<!-- Поисковая строка -->
				<div class="lg:col-span-2">
					<SearchInput
						value={searchTerm}
						placeholder="Поиск по названию"
						bgColor="bg-white"
						borderColor="border-gray-300"
						rounded="rounded-lg"
						onChange={(value: string) => (searchTerm = value)}
					/>
				</div>

				<FilterSelect
					value={hasFixedAmount}
					options={[
						{ value: '', label: 'Все типы' },
						{ value: 'fixed', label: 'Фиксированная сумма' },
						{ value: 'variable', label: 'Переменная сумма' }
					]}
					onChange={handleFixedAmountChange}
				/>

				<FilterSelect
					value={sortOrder}
					options={[
						{ value: 'newest', label: 'От новых к старым' },
						{ value: 'oldest', label: 'От старых к новым' },
						{ value: 'name_asc', label: 'По названию А-Я' },
						{ value: 'name_desc', label: 'По названию Я-А' }
					]}
					onChange={handleSortOrderChange}
				/>
			</div>

			<div class="mt-4 text-sm text-gray-600">
				Всего: <span class="font-semibold">{filteredTypes.length} типов</span>
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
</div>

<TypeOfAccrualForm onSubmit={handleFormSubmit} />
