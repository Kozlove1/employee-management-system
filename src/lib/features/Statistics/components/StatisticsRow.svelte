<script lang="ts">
	import { IconRow } from '$lib/components/UI'
	import type { EmployeeStats } from '$lib/types/shared'
	import type { AccrualTypeStats } from '../types'

	interface Props {
		data: EmployeeStats | AccrualTypeStats
		index: number
		type: 'employee' | 'accrualType'
	}

	let { data, index, type }: Props = $props()

	const positionStyles = (() => {
		switch (index) {
			case 0:
				return 'bg-yellow-200 text-yellow-800'
			case 1:
				return 'bg-gray-200 text-gray-800'
			case 2:
				return 'bg-orange-200 text-orange-800'
			default:
				return 'bg-gray-100 text-gray-600'
		}
	})()

	function isEmployee(data: EmployeeStats | AccrualTypeStats): data is EmployeeStats {
		return type === 'employee'
	}

	function isAccrualType(data: EmployeeStats | AccrualTypeStats): data is AccrualTypeStats {
		return type === 'accrualType'
	}

	const employee = isEmployee(data) ? data : null
	const formattedBalance = employee ? employee.total_balance.toLocaleString() : ''
	const employeeInfo = employee ? `${employee.ident} • ${employee.department_name}` : ''

	const accrualType = isAccrualType(data) ? data : null
	const formattedTotalAmount = accrualType ? accrualType.total_amount.toLocaleString() : ''
	const formattedAverageAmount = accrualType ? accrualType.average_amount.toLocaleString() : ''

	function getAmountType(): 'fixed' | 'variable' {
		return accrualType?.has_fixed_amount ? 'fixed' : 'variable'
	}
</script>

<div
	class="flex items-center justify-between gap-2 px-4 py-3 hover:bg-gray-50 sm:gap-4 sm:px-6 sm:py-4"
>
	<div class="flex min-w-0 flex-1 items-center space-x-2 sm:space-x-4">
		<!-- Position -->
		<div class="flex-shrink-0">
			<div
				class="flex h-7 w-7 items-center justify-center rounded-full sm:h-8 sm:w-8 {positionStyles}"
			>
				<span class="text-xs font-bold sm:text-sm">
					{index + 1}
				</span>
			</div>
		</div>

		<!-- Info section -->
		<div class="min-w-0 flex-1">
			{#if isEmployee(data)}
				<!-- Employee info -->
				<p class="truncate text-sm font-medium text-gray-900" title={data.employee_name}>
					{data.employee_name}
				</p>
				<p class="truncate text-xs text-gray-500 sm:text-sm" title={`ID: ${employeeInfo}`}>
					ID: {employeeInfo}
				</p>
			{:else if isAccrualType(data)}
				<!-- Accrual type info -->
				<p class="truncate text-sm font-medium text-gray-900" title={data.type_name}>
					{data.type_name}
				</p>
				<p class="truncate text-xs text-gray-500 sm:text-sm" title={data.category}>
					{data.category}
				</p>
				<div class="mt-1">
					<span
						class="inline-flex items-center rounded px-2 py-0.5 text-xs font-medium {getAmountType() ===
						'fixed'
							? 'bg-blue-100 text-blue-800'
							: 'bg-green-100 text-green-800'}"
					>
						{getAmountType() === 'fixed' ? 'Фиксированная сумма' : 'Переменная сумма'}
					</span>
				</div>
			{/if}
		</div>
	</div>

	<!-- Statistics section -->
	<div class="flex-shrink-0 text-right">
		{#if isEmployee(data)}
			<!-- Employee balance -->
			<div class="flex items-center justify-end gap-1">
				<IconRow icon="coins" iconSize="l" iconColor="yellow" backgroundColor="" />
				<span class="whitespace-nowrap text-xs font-bold text-gray-900 sm:text-sm">
					{formattedBalance} АК
				</span>
			</div>
		{:else if isAccrualType(data)}
			<!-- Accrual type statistics -->
			<div class="flex items-center justify-end gap-2">
				<!-- Count block -->
				<div class="flex w-16 flex-col items-center">
					<div class="flex items-center gap-1">
						<IconRow
							icon="users"
							iconSize="m"
							iconColor="blue"
							backgroundColor="bg-info-50"
							title={data.unique_employees.toString()}
							titleColor="text-primary-500"
						/>
					</div>
				</div>

				<!-- Amount block -->
				<div class="flex w-32 flex-col items-end gap-1">
					<div class="flex items-center gap-1">
						<IconRow icon="coins" iconSize="l" iconColor="yellow" backgroundColor="" />
						<span class="whitespace-nowrap text-xs font-bold text-gray-900 sm:text-sm">
							{formattedTotalAmount} АК
						</span>
					</div>
					<div class="text-xs text-gray-500">
						Среднее: {formattedAverageAmount} АК
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>
