<script lang="ts">
	import { StatCard } from '$lib/components/UI'

	interface StatCardData {
		id: string
		title: string
		subtitle: string
		icon: string
		color: 'blue' | 'yellow' | 'green' | 'gray'
		valueKey: string
		format?: 'number' | 'currency' | 'text'
		currency?: string
	}

	type Props = {
		statisticsValues: {
			totalEmployees: number
			monthlyAccruals: number
			totalAccrualTypes: number
			totalAmount: number
		}
		isLoading: boolean
	}

	let { statisticsValues, isLoading }: Props = $props()

	const statisticsCards: StatCardData[] = [
		{
			id: 'total-employees',
			title: 'Всего сотрудников',
			subtitle: 'Активные сотрудники',
			icon: 'users',
			color: 'blue',
			valueKey: 'totalEmployees',
			format: 'number'
		},
		{
			id: 'monthly-accruals',
			title: 'Начислений за месяц',
			subtitle: 'Начислено в этом месяце',
			icon: 'calendar',
			color: 'yellow',
			valueKey: 'monthlyAccruals',
			format: 'number'
		},
		{
			id: 'accrual-types',
			title: 'Типы начислений',
			subtitle: 'Доступных типов',
			icon: 'tags',
			color: 'green',
			valueKey: 'totalAccrualTypes',
			format: 'number'
		},
		{
			id: 'total-amount',
			title: 'Общая сумма',
			subtitle: 'Начислено в этом месяце',
			icon: 'wallet',
			color: 'gray',
			valueKey: 'totalAmount',
			format: 'currency',
			currency: 'AK'
		}
	]

	function formatStatValue(value: number, format: string, currency: string) {
		if (format === 'currency' && currency) {
			return `${value || 0} ${currency}`
		}
		return String(value || '0')
	}
</script>

<div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
	{#each statisticsCards as card}
		<StatCard
			title={card.title}
			value={formatStatValue(
				statisticsValues[card.valueKey as keyof typeof statisticsValues],
				card.format || '',
				card.currency || ''
			)}
			subtitle={card.subtitle}
			icon={card.icon}
			color={card.color}
		/>
	{/each}
</div>
