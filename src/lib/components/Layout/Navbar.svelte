<script>
  import { currentView, sidebarOpen } from '$lib/stores/appStore';
  import Icon from '$lib/components/Icons/Icon.svelte';

  const menuItems = [
    { id: 'accruals', label: 'Начисления', icon: 'award' },
    { id: 'employees', label: 'Сотрудники', icon: 'users' },
    { id: 'departments', label: 'Подразделения', icon: 'building2' },
    { id: 'positions', label: 'Должности', icon: 'briefcase' },
    { id: 'statistics', label: 'Статистика', icon: 'barChart3' },
  ];

  function setView(view) {
    currentView.set(view);
    sidebarOpen.set(false);
  }
</script>

<nav class="bg-white shadow-sm border-b border-gray-200">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between h-16">
      <div class="flex items-center">
        <button
          class="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 lg:hidden"
          onclick={() => sidebarOpen.update((open) => !open)}
        >
          <Icon name="menu" class="h-6 w-6" />
        </button>
      </div>

      <!-- Desktop Navigation -->
      <div class="hidden lg:flex lg:items-center lg:space-x-8">
        {#each menuItems as item}
          <button
            class="px-3 py-2 rounded-md text-sm font-medium transition-colors {$currentView ===
            item.id
              ? 'bg-primary-100 text-primary-700'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}"
            onclick={() => setView(item.id)}
          >
            <Icon name={item.icon} class="h-4 w-4 inline mr-2" />
            {item.label}
          </button>
        {/each}
      </div>
    </div>
  </div>

  <!-- Mobile Navigation -->
  {#if $sidebarOpen}
    <div class="lg:hidden">
      <div class="pt-2 pb-3 space-y-1">
        {#each menuItems as item}
          <button
            class="block w-full text-left px-3 py-2 text-base font-medium transition-colors {$currentView ===
            item.id
              ? 'bg-primary-100 text-primary-700 border-l-4 border-primary-500'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}"
            onclick={() => setView(item.id)}
          >
            <Icon name={item.icon} class="h-5 w-5 inline mr-3" />
            {item.label}
          </button>
        {/each}
      </div>
    </div>
  {/if}
</nav>
