<script lang="ts">
	import type { EmployeeWithDetails } from '$lib/types'

	type Props = {
		employee: EmployeeWithDetails
	}

	let { employee }: Props = $props()

	function formatDate(dateStr: string) {
		if (!dateStr) return ''
		try {
			const [day, month, year] = dateStr.split('.')
			return `${day}.${month}.${year}`
		} catch {
			return dateStr
		}
	}

	function getStatusBadge(employee: EmployeeWithDetails) {
		return employee.datedismis ? 'Уволен' : 'Активен'
	}

	function getInitials(fullName: string) {
		return fullName
			.split(' ')
			.map((name) => name[0])
			.join('')
			.substring(0, 2)
	}
</script>

<div class="space-y-6">
	<!-- Header with avatar and basic info -->
	<div class="flex items-start space-x-4">
		<div class="flex-shrink-0">
			<div class="flex h-16 w-16 items-center justify-center rounded-full bg-info-100">
				<span class="text-xl font-medium text-info-700">
					{getInitials(employee.employee)}
				</span>
			</div>
		</div>

		<div class="min-w-0 flex-1">
			<h2 class="break-words text-xl font-semibold text-neutral-900">
				{employee.employee}
			</h2>
			<p class="mt-1 text-sm text-neutral-500">
				ID: {employee.ident}
			</p>
			<div class="mt-2">
				<span
					class="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium {employee.datedismis
						? 'bg-danger-100 text-danger-800'
						: 'bg-success-100 text-success-800'}"
				>
					{getStatusBadge(employee)}
				</span>
			</div>
		</div>
	</div>

	<!-- Details grid -->
	<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
		<!-- Personal Info -->
		<div>
			<h3 class="mb-4 text-lg font-medium text-neutral-900">Личная информация</h3>
			<div class="space-y-3">
				<div>
					<div class="text-sm font-medium text-neutral-500">Пол</div>
					<p class="mt-1 text-sm text-neutral-900">{employee.sex}</p>
				</div>

				{#if employee.email}
					<div>
						<div class="text-sm font-medium text-neutral-500">Email</div>
						<p class="mt-1 text-sm text-neutral-900">{employee.email}</p>
					</div>
				{/if}
			</div>
		</div>

		<!-- Work Info -->
		<div>
			<h3 class="mb-4 text-lg font-medium text-neutral-900">Рабочая информация</h3>
			<div class="space-y-3">
				<div>
					<div class="text-sm font-medium text-neutral-500">Подразделение</div>
					<p class="mt-1 text-sm text-neutral-900">
						{employee.department_name}
					</p>
				</div>

				<div>
					<div class="text-sm font-medium text-neutral-500">Должность</div>
					<p class="mt-1 text-sm text-neutral-900">{employee.position_name}</p>
				</div>

				<div>
					<div class="text-sm font-medium text-neutral-500">Дата приема</div>
					<p class="mt-1 text-sm text-neutral-900">
						{formatDate(employee.dateemploy)}
					</p>
				</div>

				{#if employee.datedismis}
					<div>
						<div class="text-sm font-medium text-neutral-500">Дата увольнения</div>
						<p class="mt-1 text-sm text-neutral-900">
							{formatDate(employee.datedismis)}
						</p>
					</div>
				{/if}
			</div>
		</div>
	</div>

	<!-- Balance Section -->
	<div class="border-t border-neutral-200 pt-6">
		<h3 class="mb-4 text-lg font-medium text-neutral-900">Баланс АммоКоинов</h3>
		<div class="rounded-lg bg-neutral-100 p-4">
			<div class="flex items-center justify-between">
				<span class="text-sm text-neutral-600">Текущий баланс</span>
				<span class="text-2xl font-bold text-success-600">{employee.balance} АК</span>
			</div>
		</div>
	</div>

	<!-- IDs Section -->
	<div class="border-t border-neutral-200 pt-6">
		<h3 class="mb-4 text-lg font-medium text-neutral-900">Системная информация</h3>
		<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
			<div>
				<div class="text-sm font-medium text-neutral-500">ID сотрудника</div>
				<p class="mt-1 font-mono text-sm text-neutral-900">{employee.ident}</p>
			</div>

			<div>
				<div class="text-sm font-medium text-neutral-500">GUID сотрудника</div>
				<p class="mt-1 break-all font-mono text-xs text-neutral-900">
					{employee.employee_guid}
				</p>
			</div>

			<div>
				<div class="text-sm font-medium text-neutral-500">GUID подразделения</div>
				<p class="mt-1 break-all font-mono text-xs text-neutral-900">
					{employee.department_guid}
				</p>
			</div>

			<div>
				<div class="text-sm font-medium text-neutral-500">GUID должности</div>
				<p class="mt-1 break-all font-mono text-xs text-neutral-900">
					{employee.post_guid}
				</p>
			</div>
		</div>
	</div>
</div>
