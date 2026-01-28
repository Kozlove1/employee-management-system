<script lang="ts">
	import IconRow from '$lib/components/UI/IconRow.svelte'
	import { SquarePen, Trash2 } from '@lucide/svelte'
	import type { AccrualWithDetails } from '../types'

	interface Props {
		accrual: AccrualWithDetails
		onEdit: (accrual: AccrualWithDetails) => void
		onDelete: (guid: string) => void
	}

	const { accrual, onEdit, onDelete }: Props = $props()

	function formatDate(dateString: string): string {
		const date = new Date(dateString)
		return (
			date.toLocaleDateString('ru-RU', {
				day: 'numeric',
				month: 'long',
				year: 'numeric'
			}) +
			' в ' +
			date.toLocaleTimeString('ru-RU', {
				hour: '2-digit',
				minute: '2-digit'
			})
		)
	}
</script>

<div class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
	<div class="flex items-center justify-between">
		<div class="flex items-start space-x-4">
			<div class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500">
				<span class="text-sm font-medium text-white">
					{#if accrual.employee_name}
						{accrual.employee_name
							.split(' ')
							.map((word) => word.charAt(0))
							.slice(0, 2)
							.join('')}
					{:else}
						?
					{/if}
				</span>
			</div>
			<div class="flex-1">
				<h3 class="text-sm font-medium text-gray-900">
					{accrual.employee_name || 'Сотрудник не указан'}
				</h3>
				<div class="mt-0.5 space-y-0.5">
					<IconRow
						icon="building"
						title={accrual.department_name || 'Подразделение не указано'}
						titleSize="s"
						titleColor="text-gray-500"
						iconSize="s"
						backgroundColor=""
					/>
					<IconRow
						icon="briefcase"
						title={accrual.position_name || accrual.post || 'Должность не указана'}
						titleSize="s"
						titleColor="text-gray-500"
						iconSize="s"
						backgroundColor=""
					/>
				</div>
				<div
					class="mt-1 inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700"
				>
					{accrual.type_name || 'Тип не указан'}
				</div>
				<div class="mt-1 space-y-0.5">
					<IconRow
						icon="calendar"
						title={accrual.date ? formatDate(accrual.date) : 'Дата не указана'}
						titleSize="s"
						titleColor="text-gray-500"
						iconSize="s"
						backgroundColor=""
					/>
				</div>
				{#if accrual.comment}
					<div class="mt-2">
						<IconRow
							icon="comment"
							title={accrual.comment}
							titleSize="s"
							titleColor="text-gray-800"
							iconSize="s"
							backgroundColor=""
						/>
					</div>
				{/if}
			</div>
		</div>

		<div class="flex items-center space-x-3">
			<span
				class="inline-flex items-center rounded-full bg-gray-900 px-2.5 py-0.5 text-xs font-medium text-white"
			>
				{accrual.amount || 0} AK
			</span>
			<div class="flex space-x-2">
				<button
					onclick={() => onEdit(accrual)}
					class="text-gray-400 hover:text-gray-600"
					title="Редактировать"
					aria-label="Редактировать начисление"
				>
					<SquarePen class="h-4 w-4" />
				</button>
				<button
					onclick={() => onDelete(accrual.accrual_guid || accrual.post_guid)}
					class="text-gray-400 hover:text-red-600"
					title="Удалить"
					aria-label="Удалить начисление"
				>
					<Trash2 class="h-4 w-4" />
				</button>
			</div>
		</div>
	</div>
</div>
