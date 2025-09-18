<script lang="ts">
	import { formatDate, getInitials } from '$lib/utils'

	import IconRow from '$lib/components/UI/IconRow.svelte'

	import type { EmployeeWithDetails } from '$lib/types/shared'
	import { accrualFormStore } from '../../Accruals/store/accrualFormStore.svelte'

	type Props = {
		employee: EmployeeWithDetails
		onAccrualAdded?: () => void
	}

	let { employee, onAccrualAdded }: Props = $props()

	function getStatusBadge(employee: EmployeeWithDetails) {
		return employee.datedismis ? 'Уволен' : 'Активен'
	}

	function handleAccrualClick() {
		accrualFormStore.openForCreate()
		accrualFormStore.updateField('employee_guid', employee.employee_guid)
	}
</script>

<div
	class="rounded-lg border border-neutral-200 bg-primary-50 p-4 transition-shadow hover:shadow-md"
>
	<!-- Верхняя строка с аватаром и кнопками -->
	<div class="mb-1 flex items-start gap-2">
		<div class="mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-info-100 px-3">
			<span class="title-sm font-medium text-info-700">
				{getInitials(employee.employee)}
			</span>
		</div>
		<div class="max-w-40 flex-1">
			<h3 class="title-sm line-clamp-3 break-words font-medium text-neutral-900">
				{employee.employee}
			</h3>
		</div>
		<div class="ml-auto flex-shrink-0">
			<!-- Status and award button -->
			<div class="flex flex-col items-end gap-2 md:flex-row md:items-center">
				<span
					class="inline-flex items-center whitespace-nowrap rounded-full px-2 py-1 text-xs font-medium {employee.datedismis
						? 'bg-danger-100 text-danger-700'
						: 'bg-success-100 text-success-700'}"
				>
					{getStatusBadge(employee)}
				</span>
				{#if !employee.datedismis}
					<button
						onclick={handleAccrualClick}
						class="btn my-0 inline-flex items-center whitespace-nowrap rounded-lg border-2 border-success-100 px-1 font-normal text-success-700 transition-colors hover:bg-success-50"
					>
						<IconRow
							icon="award"
							iconSize="m"
							title="Начислить"
							titleColor="text-success-700"
							titleSize="s"
							gapSize="s"
						/>
					</button>
				{/if}
			</div>
		</div>
	</div>

	<!-- ID -->
	<div class="mb-3">
		<p class="title-xs text-neutral-500">ID: {employee.ident}</p>
	</div>

	<!-- Balance -->
	<IconRow
		icon="coins"
		title="Баланс: {employee.balance} АК"
		titleColor="text-neutral-900"
		backgroundColor={'bg-neutral-100'}
	/>

	<!-- Department -->
	<IconRow icon="building" title={employee.department_name} />

	<!-- Position and other details -->
	<div class="mb-3">
		<IconRow icon="briefcase" title={employee.position_name} />
		{#if employee.email}
			<IconRow icon="mail" title={employee.email} />
		{/if}
		<IconRow
			icon="calendar"
			title="Принят: {employee.dateemploy ? formatDate(employee.dateemploy) : 'Дата не указана'}"
		/>
		<IconRow icon="venus-and-mars" title="Пол: {employee.sex}" />
	</div>
</div>
