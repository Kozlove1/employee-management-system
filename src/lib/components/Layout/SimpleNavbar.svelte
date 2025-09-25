<script lang="ts">
	import { goto } from '$app/navigation'
	import { page } from '$app/state'
	import IconRow, { type IconName } from '$lib/components/UI/IconRow.svelte'
	import { authStore } from '$lib/features/Auth'
	import { getAppContainerStyle } from '$lib/utils'
	import type { MenuItem, MenuItemEnum } from '.'

	let sidebarOpen = $state(false)

	let user = $derived(authStore.getUser())
	let isAuthenticated = $derived(authStore.isAuthenticated)
	let isLoggingOut = $derived(authStore.getIsLoggingOut())

	async function handleLogout() {
		await authStore.logout()
		goto('/login')
	}

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
				<div class="flex items-center space-x-12">
					{#each menuItems as item}
						<button
							disabled={isLoggingOut}
							class="btn rounded-lg px-2 py-1 text-sm font-medium {isCurrentPage(item.href)
								? 'border-2 border-info-200 bg-white text-info-700 shadow-sm'
								: 'border-2 border-transparent text-neutral-600 hover:border-neutral-200 hover:bg-white hover:text-neutral-800 hover:shadow-sm'} disabled:cursor-not-allowed disabled:opacity-50"
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

				<!-- User menu -->

				<div class="flex items-center space-x-6">
					<div class="flex items-center space-x-2">
						<div class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500">
							<span class="text-sm font-medium text-white">
								{user?.name?.charAt(0).toUpperCase()}
							</span>
						</div>
						<div class="hidden md:block">
							<p class="text-sm font-bold text-gray-900">{user?.name}</p>
							<p class="text-xs text-gray-500">{user?.email}</p>
						</div>
					</div>
					<button
						onclick={handleLogout}
						disabled={isLoggingOut}
						class="btn rounded-lg border-2 border-transparent px-2 py-1 text-sm font-medium text-neutral-600 hover:border-neutral-200 hover:bg-white hover:text-neutral-800 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
					>
						<IconRow
							icon="logout"
							iconSize="l"
							title={isLoggingOut ? 'Выход...' : 'Выйти'}
							titleSize="l"
							titleColor="text-neutral-600"
						/>
					</button>
				</div>
			</div>
		</div>
	</div>

	<!-- Mobile Navigation -->
	{#if sidebarOpen}
		<div class="lg:hidden">
			<div class="space-y-2 px-2 pb-3 pt-2">
				{#each menuItems as item}
					<button
						disabled={isLoggingOut}
						class="btn block w-full rounded-lg px-2 py-1 text-left font-medium {isCurrentPage(
							item.href
						)
							? 'border-2 border-info-200 bg-white text-info-700 shadow-sm'
							: 'border-2 border-transparent text-neutral-600 hover:border-neutral-200 hover:bg-white hover:text-neutral-800 hover:shadow-sm'} disabled:cursor-not-allowed disabled:opacity-50"
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

				<!-- Mobile logout button -->
				{#if isAuthenticated}
					<button
						onclick={handleLogout}
						disabled={isLoggingOut}
						class="btn block w-full rounded-lg border-2 border-transparent px-2 py-1 text-left font-medium text-neutral-600 hover:border-neutral-200 hover:bg-white hover:text-neutral-800 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
					>
						<span class="flex items-center space-x-2">
							<IconRow
								icon="logout"
								iconSize="l"
								title={isLoggingOut ? 'Выход...' : 'Выйти'}
								titleSize="l"
								titleColor="text-neutral-600"
							/>
						</span>
					</button>
				{/if}
			</div>
		</div>
	{/if}
</nav>
