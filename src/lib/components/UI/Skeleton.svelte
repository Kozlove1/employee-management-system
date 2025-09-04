<script lang="ts">
  interface Props {
    type:
      | 'stat-card'
      | 'search-filters'
      | 'list-item'
      | 'employee-card'
      | 'employee-grid'
      | 'statistics-table'
      | 'search-panel'
      | 'pagination-stats';
    count?: number;
  }

  let { type, count = 1 } = $props();
</script>

{#if type === 'stat-card'}
  <!-- Loading skeleton for stat cards -->
  {#each Array(count) as _}
    <div
      class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 animate-pulse"
    >
      <div class="flex items-center gap-2 justify-between">
        <div class="w-8 h-8 bg-gray-300 rounded"></div>
        <div class="flex-1">
          <div class="h-4 bg-gray-300 rounded w-20 mb-2"></div>
          <div class="h-6 bg-gray-300 rounded w-16 mb-1"></div>
          <div class="h-3 bg-gray-300 rounded w-24"></div>
        </div>
      </div>
    </div>
  {/each}
{:else if type === 'search-filters'}
  <!-- Loading skeleton for search and filters -->
  <div class="grid grid-cols-1 lg:grid-cols-5 gap-4">
    <div class="lg:col-span-2">
      <div class="h-10 bg-gray-300 rounded-lg animate-pulse"></div>
    </div>
    <div class="h-10 bg-gray-300 rounded-lg animate-pulse"></div>
    <div class="h-10 bg-gray-300 rounded-lg animate-pulse"></div>
    <div class="h-10 bg-gray-300 rounded-lg animate-pulse"></div>
  </div>
  <div class="mt-4">
    <div class="h-4 bg-gray-300 rounded w-32 animate-pulse"></div>
  </div>
{:else if type === 'search-panel'}
  <!-- Loading skeleton for search panel with filters and pagination -->
  <div class="flex flex-col lg:flex-row gap-4 items-center">
    <div class="flex-1 min-w-0">
      <div class="h-10 bg-neutral-300 rounded-md animate-pulse"></div>
    </div>
    <div class="w-48 flex-2">
      <div class="h-10 bg-neutral-300 rounded-md animate-pulse"></div>
    </div>
    <div class="flex items-center flex-3">
      <div class="h-4 w-4 bg-neutral-300 rounded animate-pulse"></div>
      <div class="ml-2 h-4 w-24 bg-neutral-300 rounded animate-pulse"></div>
    </div>
    <div class="h-10 w-24 bg-primary-500 rounded-md animate-pulse"></div>
  </div>
  <div class="mt-4 flex flex-col sm:flex-row justify-between items-center">
    <div class="flex flex-row gap-2">
      <div class="h-4 bg-neutral-300 rounded w-32 animate-pulse"></div>
      <div class="h-4 w-2 bg-neutral-300 rounded animate-pulse"></div>
      <div class="h-4 bg-neutral-300 rounded w-24 animate-pulse"></div>
    </div>
    <div class="h-8 w-32 bg-neutral-300 rounded-md animate-pulse"></div>
  </div>
{:else if type === 'list-item'}
  <!-- Loading skeleton for list items -->
  {#each Array(count) as _}
    <div
      class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 animate-pulse"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <div class="flex-shrink-0">
            <div class="w-10 h-10 rounded-full bg-gray-300"></div>
          </div>
          <div class="flex-1 space-y-2">
            <div class="h-4 bg-gray-300 rounded w-32"></div>
            <div class="h-3 bg-gray-300 rounded w-24"></div>
            <div class="h-3 bg-gray-300 rounded w-40"></div>
          </div>
        </div>
        <div class="flex items-center space-x-3">
          <div class="h-6 bg-gray-300 rounded-full w-16"></div>
          <div class="flex space-x-2">
            <div class="w-4 h-4 bg-gray-300 rounded"></div>
            <div class="w-4 h-4 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  {/each}
{:else if type === 'employee-card'}
  <!-- Loading skeleton for employee cards -->
  {#each Array(count) as _}
    <div
      class="bg-primary-50 rounded-lg border border-neutral-200 p-4 animate-pulse"
    >
      <div class="flex items-start space-x-4">
        <div class="h-10 w-10 bg-neutral-300 rounded-full"></div>
        <div class="flex-1 space-y-2">
          <div class="h-4 bg-neutral-300 rounded w-3/4"></div>
          <div class="h-3 bg-neutral-300 rounded w-1/2"></div>
        </div>
      </div>
      <div class="mt-4 space-y-2">
        <div class="h-3 bg-neutral-300 rounded"></div>
        <div class="h-3 bg-neutral-300 rounded w-5/6"></div>
      </div>
    </div>
  {/each}
{:else if type === 'employee-grid'}
  <!-- Loading skeleton for employee grid layout -->
  <div
    class="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
  >
    {#each Array(count) as _}
      <div
        class="bg-primary-50 rounded-lg border border-neutral-200 p-4 animate-pulse"
      >
        <div class="flex items-start space-x-4">
          <div class="h-10 w-10 bg-neutral-300 rounded-full"></div>
          <div class="flex-1 space-y-2">
            <div class="h-4 bg-neutral-300 rounded w-3/4"></div>
            <div class="h-3 bg-neutral-300 rounded w-1/2"></div>
          </div>
        </div>
        <div class="mt-4 space-y-2">
          <div class="h-3 bg-neutral-300 rounded"></div>
          <div class="h-3 bg-neutral-300 rounded w-5/6"></div>
        </div>
      </div>
    {/each}
  </div>
{:else if type === 'statistics-table'}
  <!-- Loading skeleton for statistics table with ranking -->
  <div class="divide-y divide-gray-200">
    {#each Array(count) as _, index}
      {@const isTopThree = index < 3}
      {@const positionBg =
        index === 0
          ? 'bg-yellow-200'
          : index === 1
            ? 'bg-gray-200'
            : index === 2
              ? 'bg-orange-200'
              : 'bg-neutral-300'}

      <div class="px-6 py-4 animate-pulse flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <!-- Position skeleton with special styling for top 3 -->
          <div class="flex-shrink-0">
            <div class="h-8 w-8 {positionBg} rounded-full"></div>
          </div>

          <!-- Employee info skeleton -->
          <div class="flex-1 min-w-0 space-y-2">
            <div
              class="h-4 bg-neutral-300 rounded {isTopThree ? 'w-52' : 'w-48'}"
            ></div>
            <div
              class="h-3 bg-neutral-300 rounded {isTopThree ? 'w-36' : 'w-32'}"
            ></div>
          </div>
        </div>

        <!-- Balance skeleton -->
        <div class="flex-shrink-0 text-right">
          <div class="flex items-center space-x-2">
            <div class="h-5 w-5 bg-yellow-200 rounded"></div>
            <div
              class="h-4 bg-neutral-300 rounded {isTopThree ? 'w-24' : 'w-20'}"
            ></div>
          </div>
        </div>
      </div>
    {/each}
  </div>
{:else if type === 'pagination-stats'}
  <!-- Loading skeleton for pagination and statistics -->
  <div class="flex flex-col sm:flex-row justify-between items-center">
    <div class="flex flex-row gap-2">
      <div class="h-4 bg-neutral-300 rounded w-32 animate-pulse"></div>
      <div class="h-4 w-2 bg-neutral-300 rounded animate-pulse"></div>
      <div class="h-4 bg-neutral-300 rounded w-24 animate-pulse"></div>
    </div>
    <div class="h-8 w-32 bg-neutral-300 rounded-md animate-pulse"></div>
  </div>
{/if}
