<script lang="ts">
	import IconRow from './IconRow.svelte'

	type Props = {
		title: string
		value: string
		subtitle: string
		icon: string
		color?: 'blue' | 'yellow' | 'green' | 'gray'
	}

	let { title, value, subtitle, icon, color = 'blue' }: Props = $props()

	const colorClasses = {
		blue: 'bg-blue-100',
		yellow: 'bg-yellow-100',
		green: 'bg-green-100',
		gray: 'bg-gray-100'
	}

	const iconMapping = {
		users: 'user',
		calendar: 'calendar',
		tags: 'tags',
		wallet: 'coins',
		award: 'award',
		chart: 'chart',
		coins: 'coins'
	}
</script>

<div class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
	<div class="flex items-center">
		<div class="mr-4 flex-shrink-0">
			<div class="rounded-lg p-2 {colorClasses[color]}">
				<IconRow
					icon={iconMapping[icon]}
					iconSize="l"
					iconColor="black"
					backgroundColor={colorClasses[color]}
				/>
			</div>
		</div>

		<div class="min-w-0 flex-1">
			<p class="truncate text-sm font-medium text-gray-900">{title}</p>
			<p class="text-2xl font-bold text-gray-900">{value}</p>
			<p class="truncate text-xs text-gray-500">{subtitle}</p>
		</div>
	</div>
</div>
