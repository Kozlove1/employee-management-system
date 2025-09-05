<script lang="ts">
	import type { EmployeeStats } from '$lib/types'

	interface Props {
		employee: EmployeeStats
		index: number
	}

	let { employee, index }: Props = $props()

	const positionStyles = (() => {
		switch (index) {
			case 0:
				return 'bg-yellow-100 text-yellow-800'
			case 1:
				return 'bg-gray-100 text-gray-800'
			case 2:
				return 'bg-orange-100 text-orange-800'
			default:
				return 'bg-gray-50 text-gray-600'
		}
	})()

	const formattedBalance = employee.total_balance.toLocaleString()

	const employeeInfo = `${employee.ident} • ${employee.department_name}`
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

		<!-- Employee info -->
		<div class="min-w-0 flex-1">
			<p class="truncate text-sm font-medium text-gray-900" title={employee.employee_name}>
				{employee.employee_name}
			</p>
			<p class="truncate text-xs text-gray-500 sm:text-sm" title={`ID: ${employeeInfo}`}>
				ID: {employeeInfo}
			</p>
		</div>
	</div>

	<!-- Balance -->
	<div class="flex-shrink-0 text-right">
		<div class="flex items-center justify-end gap-1">
			<svg class="h-3 w-3 text-yellow-500 sm:h-4 sm:w-4" fill="currentColor" viewBox="0 0 20 20">
				<path
					d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"
				></path>
				<path
					fill-rule="evenodd"
					d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
					clip-rule="evenodd"
				></path>
			</svg>
			<span class="whitespace-nowrap text-xs font-bold text-gray-900 sm:text-sm">
				{formattedBalance} АК
			</span>
		</div>
	</div>
</div>
