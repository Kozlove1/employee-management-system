<script lang="ts">
	import { goto } from '$app/navigation'
	import { page } from '$app/state'
	import { IconRow, Logo } from '$lib/components/UI'
	import type { IconName } from '$lib/components/UI/IconRow.svelte'
	import { authStore } from '$lib/features/Auth'
	import { getAppContainerStyle } from '$lib/utils'
	import { onMount } from 'svelte'
	import type { MenuItem, MenuItemEnum } from '.'

	let sidebarOpen = $state(false)
	let isNavbarVisible = $state(true)
	let lastScrollY = $state(0)

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

	function handleScroll() {
		if (sidebarOpen) {
			isNavbarVisible = true
			return
		}

		const currentScrollY = window.scrollY
		const scrollThreshold = 10
		const hideThreshold = 100

		if (currentScrollY < lastScrollY || currentScrollY < scrollThreshold) {
			isNavbarVisible = true
		} else if (currentScrollY > lastScrollY && currentScrollY > hideThreshold) {
			isNavbarVisible = false
		}

		lastScrollY = currentScrollY
	}

	onMount(() => {
		if (typeof window !== 'undefined') {
			let scrollHandler: (() => void) | null = null

			function setupScrollHandler() {
				if (scrollHandler) {
					window.removeEventListener('scroll', scrollHandler)
				}

				const isMobile = window.innerWidth < 1024 // lg breakpoint

				if (isMobile) {
					scrollHandler = handleScroll
					window.addEventListener('scroll', scrollHandler, { passive: true })
				} else {
					isNavbarVisible = true
				}
			}

			setupScrollHandler()

			window.addEventListener('resize', setupScrollHandler)

			return () => {
				if (scrollHandler) {
					window.removeEventListener('scroll', scrollHandler)
				}
				window.removeEventListener('resize', setupScrollHandler)
			}
		}
	})
</script>

<nav
	class="border-b border-neutral-200 bg-primary-50 shadow-sm transition-transform duration-300 ease-in-out {isNavbarVisible
		? 'translate-y-0'
		: '-translate-y-full'} fixed left-0 right-0 top-0 z-50"
>
	<div class={getAppContainerStyle()}>
		<div class="flex h-16 items-center justify-between">
			<!-- Left side: Mobile menu + Logo + Navigation -->
			<div class="flex items-center space-x-4">
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

				<!-- Logo -->
				<div class="flex-shrink-0">
					<Logo size="md" />
				</div>

				<!-- Desktop Navigation Items -->
				<div class="hidden lg:flex lg:items-center lg:space-x-4 xl:space-x-10">
					{#each menuItems as item}
						<button
							disabled={isLoggingOut}
							class="btn rounded-lg px-1 py-1 text-sm font-medium xl:px-2 {isCurrentPage(item.href)
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
			</div>

			<!-- Right side: User menu -->
			<div class="flex items-center space-x-4 lg:space-x-4 xl:space-x-4">
				<!-- User info - адаптивное скрытие -->
				<div class="flex min-w-0 flex-shrink-0 items-center space-x-1 lg:space-x-2">
					<div
						class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-500"
					>
						<span class="text-sm font-medium text-white">
							{user?.name?.charAt(0).toUpperCase()}
						</span>
					</div>
					<div class="hidden min-w-0 2xl:block">
						<p class="truncate text-sm font-bold text-gray-900">{user?.name}</p>
						<p class="truncate text-xs text-gray-500">{user?.email}</p>
					</div>
				</div>

				<!-- Logout button - скрываем на мобильных устройствах -->
				<button
					onclick={handleLogout}
					disabled={isLoggingOut}
					class="btn hidden flex-shrink-0 rounded-lg border-2 border-transparent px-1 py-1 text-sm font-medium text-neutral-600 hover:border-neutral-200 hover:bg-white hover:text-neutral-800 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-50 lg:flex lg:px-2"
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
