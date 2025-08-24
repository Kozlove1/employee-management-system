<script lang="ts">
  import IconRow, { type IconName } from '$lib/components/UI/IconRow.svelte';

  type MenuItem = {
    id: string;
    label: string;
    icon: IconName;
  };

  let { currentScreen = $bindable('accruals') } = $props();
  let sidebarOpen = $state(false);

  const menuItems = [
    { id: 'accruals', label: 'Начисления', icon: 'award' },
    { id: 'employees', label: 'Сотрудники', icon: 'user' },
    { id: 'departments', label: 'Подразделения', icon: 'building' },
    { id: 'positions', label: 'Должности', icon: 'briefcase' },
    { id: 'statistics', label: 'Статистика', icon: 'chart' },
  ] as MenuItem[];

  function setView(screenName) {
    currentScreen = screenName;
    sidebarOpen = false;
  }
</script>

<nav class="bg-primary-50 shadow-sm border-b border-neutral-200">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex h-16">
      <!-- Mobile menu button -->
      <div class="flex items-center lg:hidden">
        <button
          onclick={() => (sidebarOpen = !sidebarOpen)}
          aria-label="Toggle mobile menu"
        >
          <IconRow icon="menu" iconSize="l" titleColor="text-neutral-500" />
        </button>
      </div>

      <!-- Desktop Navigation - растягиваем на всю ширину -->
      <div class="hidden lg:flex lg:flex-1 lg:justify-between lg:items-center">
        {#each menuItems as item}
          <button
            class="px-2 py-1 rounded-lg text-sm font-medium {currentScreen ===
            item.id
              ? 'bg-white text-info-700 border-2 border-info-200 shadow-sm'
              : 'text-neutral-600 border-2 border-transparent hover:border-neutral-200 hover:bg-white hover:text-neutral-800 hover:shadow-sm'}"
            onclick={() => setView(item.id)}
          >
            <IconRow
              icon={item.icon}
              iconSize="l"
              title={item.label}
              titleSize="l"
              titleColor={currentScreen === item.id
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
            class="block w-full text-left px-2 py-1 font-medium rounded-lg {currentScreen ===
            item.id
              ? 'bg-white text-info-700 border-2 border-info-200 shadow-sm'
              : 'text-neutral-600 border-2 border-transparent hover:border-neutral-200 hover:bg-white hover:text-neutral-800 hover:shadow-sm'}"
            onclick={() => setView(item.id)}
          >
            <IconRow
              icon={item.icon as IconName}
              iconSize="m"
              title={item.label}
              titleSize="m"
              titleColor={currentScreen === item.id
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
