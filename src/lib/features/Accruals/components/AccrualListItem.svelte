<script lang="ts">
	import { SquarePen, Trash2 } from '@lucide/svelte'

	interface Accrual {
		post_guid: string
		employee_name?: string
		type_name?: string
		amount?: number
		datecreate: string
	}

	interface Props {
		accrual: Accrual
		onEdit: (accrual: Accrual) => void
		onDelete: (guid: string) => void
	}

	let { accrual, onEdit, onDelete } = $props()

	function formatDate(dateString: string): string {
		const date = new Date(dateString)
		return (
			date.toLocaleDateString('ru-RU', {
				day: 'numeric',
				month: 'long',
				year: 'numeric'
			}) +
			' г. в ' +
			date.toLocaleTimeString('ru-RU', {
				hour: '2-digit',
				minute: '2-digit'
			})
		)
	}
</script>

<div class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
	<div class="flex items-center justify-between">
		<div class="flex items-center space-x-4">
			<div class="flex-shrink-0">
				<div class="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
					<span class="text-sm font-medium text-gray-600">
						{accrual.employee_name?.charAt(0) || '?'}
					</span>
				</div>
			</div>
			<div class="flex-1">
				<h3 class="text-sm font-medium text-gray-900">
					{accrual.employee_name}
				</h3>
				<p class="text-sm text-gray-500">{accrual.type_name}</p>
				<div class="mt-1 flex items-center text-xs text-gray-400">
					<svg class="mr-1 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
						/>
					</svg>
					{formatDate(accrual.datecreate)}
				</div>
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
					onclick={() => onDelete(accrual.post_guid)}
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
