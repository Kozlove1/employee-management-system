<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import IconRow, { type IconName } from '$lib/components/UI/IconRow.svelte';
  import { getAppContainerStyle } from '$lib/utils';

  enum MenuItemEnum {
    ACCRUALS = '/accruals',
    EMPLOYEES = '/employees',
    POSITIONS = '/positions',
    STATISTICS = '/statistics',
  }

  type MenuItem = {
    id: string;
    label: string;
    icon: IconName;
    href: MenuItemEnum;
  };

  let sidebarOpen = $state(false);

  const menuItems = [
    { id: 'accruals', label: 'Начисления', icon: 'award', href: '/accruals' },
    { id: 'employees', label: 'Сотрудники', icon: 'user', href: '/employees' },
    {
      id: 'positions',
      label: 'Типы начислений',
      icon: 'briefcase',
      href: '/positions',
    },
    {
      id: 'statistics',
      label: 'Статистика',
      icon: 'chart',
      href: '/statistics',
    },
  ] as MenuItem[];

  function navigateTo(href: MenuItemEnum) {
    goto(href);
    sidebarOpen = false;
  }

  const isCurrentPage = (href: MenuItemEnum) =>
    (page.url.pathname as MenuItemEnum) === href;
</script>

<nav class="bg-primary-50 shadow-sm border-b border-neutral-200">
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
      <div class="hidden lg:flex lg:flex-1 lg:justify-between lg:items-center">
        {#each menuItems as item}
          <button
            class="btn px-2 py-1 rounded-lg text-sm font-medium {isCurrentPage(
              item.href
            )
              ? 'bg-white text-info-700 border-2 border-info-200 shadow-sm'
              : 'text-neutral-600 border-2 border-transparent hover:border-neutral-200 hover:bg-white hover:text-neutral-800 hover:shadow-sm'}"
            onclick={() => navigateTo(item.href)}
          >
            <IconRow
              icon={item.icon}
              iconSize="l"
              title={item.label}
              titleSize="l"
              titleColor={isCurrentPage(item.href)
                ? 'text-info-700'
                : 'text-neutral-600'}
            />
          </button>
        {/each}
      </div>
    </div>
  </div>

  <!-- Mobile Navigation -->
  {#if sidebarOpen}
    <div class="lg:hidden">
      <div class="pt-2 pb-3 space-y-2 px-2">
        {#each menuItems as item}
          <button
            class="btn block w-full text-left px-2 py-1 font-medium rounded-lg {isCurrentPage(
              item.href
            )
              ? 'bg-white text-info-700 border-2 border-info-200 shadow-sm'
              : 'text-neutral-600 border-2 border-transparent hover:border-neutral-200 hover:bg-white hover:text-neutral-800 hover:shadow-sm'}"
            onclick={() => navigateTo(item.href)}
          >
            <IconRow
              icon={item.icon as IconName}
              iconSize="m"
              title={item.label}
              titleSize="m"
              titleColor={isCurrentPage(item.href)
                ? 'text-info-700'
                : 'text-neutral-600'}
              hoverColor="text-neutral-800"
            />
          </button>
        {/each}
      </div>
    </div>
  {/if}
</nav>
