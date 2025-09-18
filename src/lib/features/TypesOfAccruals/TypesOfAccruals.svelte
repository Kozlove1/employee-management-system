<script lang="ts">
	import {
		TypesOfAccrualsDataManager,
		type CreateTypeOfAccrualData,
		type UpdateTypeOfAccrualData
	} from './mocks/typesOfAccrualsData'

	import type { AccrualType } from '$lib/types/shared'
	import type { TypeOfAccrualFormData } from './types'

	import { typeOfAccrualFormStore } from './store/typeOfAccrualFormStore.svelte'

	import {
		ActionButton,
		EmptyState,
		FilterSelect,
		IconRow,
		SearchInput,
		StatCard
	} from '$lib/components/UI'
	import TypeOfAccrualForm from './Form/TypeOfAccrualForm.svelte'
	import { TypeOfAccrualListItem } from './components'

	let searchTerm = $state('')
	let hasFixedAmount = $state('')
	let sortOrder = $state('newest')

	let dataVersion = $state(0) // Триггер для обновления
	let isLoading = $state(false)

	let types = $derived(() => {
		dataVersion // Зависимость для принудительного обновления
		return TypesOfAccrualsDataManager.getAll()
	})

	$effect(() => {
		dataVersion = 1 // Принудительно обновляем данные
	})

	let filteredTypes = $derived(() => {
		const allTypes = types()

		const result = TypesOfAccrualsDataManager.search({
			searchTerm: searchTerm || undefined,
			hasFixedAmount:
				hasFixedAmount === 'fixed' ? true : hasFixedAmount === 'variable' ? false : undefined,
			sortOrder: sortOrder as 'newest' | 'oldest' | 'name_asc' | 'name_desc'
		})

		return result
	})

	let stats = $derived(() => {
		dataVersion // Зависимость для принудительного обновления
		return TypesOfAccrualsDataManager.getStats()
	})

	function handleAddType(data: TypeOfAccrualFormData) {
		console.log('handleAddType', data)
		const createData: CreateTypeOfAccrualData = {
			type_name: data.type_name,
			ammo_coins_amount: data.ammo_coins_amount
		}

		TypesOfAccrualsDataManager.create(createData)
		dataVersion++
	}

	function handleEditType(typeToEdit: AccrualType) {
		typeOfAccrualFormStore.openForEdit(typeToEdit)
	}

	function handleUpdateType(data: TypeOfAccrualFormData) {
		const currentType = typeOfAccrualFormStore.getCurrentType()

		if (!currentType) return

		const updateData: UpdateTypeOfAccrualData = {
			type_guid: currentType.type_guid,
			type_name: data.type_name,
			ammo_coins_amount: data.ammo_coins_amount
		}

		const result = TypesOfAccrualsDataManager.update(updateData)

		if (result) {
			dataVersion++
		}
	}

	function handleDeleteType(typeGuid: string) {
		const success = TypesOfAccrualsDataManager.delete(typeGuid)

		if (success) {
			dataVersion++
		} else {
			console.error('Failed to delete type: not found')
		}
	}

	function handleFixedAmountChange(value: string) {
		hasFixedAmount = value
	}

	function handleSortOrderChange(value: string) {
		sortOrder = value
	}

	function handleFormSubmit(data: TypeOfAccrualFormData) {
		const currentType = typeOfAccrualFormStore.getCurrentType()

		if (currentType) {
			handleUpdateType(data)
		} else {
			handleAddType(data)
		}
	}
</script>

<div class="space-y-6">
	<div class="grid grid-cols-2 gap-4 lg:grid-cols-3">
		<StatCard
			title="Всего типов"
			value={String(stats().total)}
			subtitle="Типов начислений"
			icon="award"
			color="blue"
		/>
		<StatCard
			title="С фиксированной суммой"
			value={String(stats().withFixedAmount)}
			subtitle="АК автоматически"
			icon="coins"
			color="green"
		/>
		<StatCard
			title="С переменной суммой"
			value={String(stats().withVariableAmount)}
			subtitle="Сумма вручную"
			icon="chart"
			color="gray"
		/>
	</div>

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
						placeholder="Поиск по названию или ID типа"
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
				Всего: <span class="font-semibold">{filteredTypes().length} типов</span>
			</div>
		</div>
	</div>

	<div class="space-y-3">
		{#each filteredTypes() as typeOfAccrual}
			<TypeOfAccrualListItem {typeOfAccrual} onEdit={handleEditType} onDelete={handleDeleteType} />
		{/each}

		{#if filteredTypes().length === 0}
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
</div>

<TypeOfAccrualForm onSubmit={handleFormSubmit} />
