<script lang="ts">
	import { goto } from '$app/navigation'
	import { page } from '$app/state'
	import IconRow, { type IconName } from '$lib/components/UI/IconRow.svelte'
	import { getAppContainerStyle } from '$lib/utils'
	import type { MenuItem, MenuItemEnum } from '.'

	let sidebarOpen = $state(false)

	const menuItems = [
		{ id: 'accruals', label: 'Начисления', icon: 'award', href: '/accruals' },
		{ id: 'employees', label: 'Сотрудники', icon: 'user', href: '/employees' },
		{
			id: 'typesOfAccruals',
			label: 'Типы начислений',
			icon: 'briefcase',
			href: '/typesOfAccruals'
		},
		{
			id: 'statistics',
			label: 'Статистика',
			icon: 'chart',
			href: '/statistics'
		}
	] as MenuItem[]

	function navigateTo(href: MenuItemEnum) {
		goto(href)
		sidebarOpen = false
	}

	const isCurrentPage = (href: MenuItemEnum) => (page.url.pathname as MenuItemEnum) === href
</script>

<nav class="border-b border-neutral-200 bg-primary-50 shadow-sm">
	<div class={getAppContainerStyle()}>
		<div class="flex h-16">
			<!-- Mobile menu button -->
			<div class="flex items-center lg:hidden">
				<button
					onclick={() => (sidebarOpen = !sidebarOpen)}
					aria-label="Toggle mobile menu"
					class="btn"
				>
					<IconRow icon="menu" iconSize="l" titleColor="text-neutral-500" />
				</button>
			</div>

			<!-- Desktop Navigation - растягиваем на всю ширину -->
			<div class="hidden lg:flex lg:flex-1 lg:items-center lg:justify-between">
				{#each menuItems as item}
					<button
						class="btn rounded-lg px-2 py-1 text-sm font-medium {isCurrentPage(item.href)
							? 'border-2 border-info-200 bg-white text-info-700 shadow-sm'
							: 'border-2 border-transparent text-neutral-600 hover:border-neutral-200 hover:bg-white hover:text-neutral-800 hover:shadow-sm'}"
						onclick={() => navigateTo(item.href)}
					>
						<IconRow
							icon={item.icon}
							iconSize="l"
							title={item.label}
							titleSize="l"
							titleColor={isCurrentPage(item.href) ? 'text-info-700' : 'text-neutral-600'}
						/>
					</button>
				{/each}
			</div>
		</div>
	</div>

	<!-- Mobile Navigation -->
	{#if sidebarOpen}
		<div class="lg:hidden">
			<div class="space-y-2 px-2 pb-3 pt-2">
				{#each menuItems as item}
					<button
						class="btn block w-full rounded-lg px-2 py-1 text-left font-medium {isCurrentPage(
							item.href
						)
							? 'border-2 border-info-200 bg-white text-info-700 shadow-sm'
							: 'border-2 border-transparent text-neutral-600 hover:border-neutral-200 hover:bg-white hover:text-neutral-800 hover:shadow-sm'}"
						onclick={() => navigateTo(item.href)}
					>
						<IconRow
							icon={item.icon as IconName}
							iconSize="m"
							title={item.label}
							titleSize="m"
							titleColor={isCurrentPage(item.href) ? 'text-info-700' : 'text-neutral-600'}
							hoverColor="text-neutral-800"
						/>
					</button>
				{/each}
			</div>
		</div>
	{/if}
</nav>
