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
			| 'pagination-stats'
		count?: number
	}

	let { type, count = 1 } = $props()
</script>

{#if type === 'stat-card'}
	<!-- Loading skeleton for stat cards -->
	{#each Array(count) as _}
		<div class="animate-pulse rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
			<div class="flex items-center justify-between gap-2">
				<div class="h-8 w-8 rounded bg-gray-300"></div>
				<div class="flex-1">
					<div class="mb-2 h-4 w-20 rounded bg-gray-300"></div>
					<div class="mb-1 h-6 w-16 rounded bg-gray-300"></div>
					<div class="h-3 w-24 rounded bg-gray-300"></div>
				</div>
			</div>
		</div>
	{/each}
{:else if type === 'search-filters'}
	<!-- Loading skeleton for search and filters -->
	<div class="grid grid-cols-1 gap-4 lg:grid-cols-5">
		<div class="lg:col-span-2">
			<div class="h-10 animate-pulse rounded-lg bg-gray-300"></div>
		</div>
		<div class="h-10 animate-pulse rounded-lg bg-gray-300"></div>
		<div class="h-10 animate-pulse rounded-lg bg-gray-300"></div>
		<div class="h-10 animate-pulse rounded-lg bg-gray-300"></div>
	</div>
	<div class="mt-4">
		<div class="h-4 w-32 animate-pulse rounded bg-gray-300"></div>
	</div>
{:else if type === 'search-panel'}
	<!-- Loading skeleton for search panel with filters and pagination -->
	<div class="min-w-0 flex-1">
		<div class="h-10 animate-pulse rounded-md bg-neutral-300"></div>
	</div>
	<div class="w-48">
		<div class="h-10 animate-pulse rounded-md bg-neutral-300"></div>
	</div>
	<div class="flex-2 flex-row items-center justify-between sm:flex-row">
		<div class="flex-3 flex items-center">
			<div class="h-4 w-4 animate-pulse rounded bg-neutral-300"></div>
			<div class="ml-2 h-4 w-24 animate-pulse rounded bg-neutral-300"></div>
		</div>
	</div>
{:else if type === 'list-item'}
	<!-- Loading skeleton for list items -->
	{#each Array(count) as _}
		<div class="animate-pulse rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
			<div class="flex items-center justify-between">
				<div class="flex items-center space-x-4">
					<div class="flex-shrink-0">
						<div class="h-10 w-10 rounded-full bg-gray-300"></div>
					</div>
					<div class="flex-1 space-y-2">
						<div class="h-4 w-32 rounded bg-gray-300"></div>
						<div class="h-3 w-24 rounded bg-gray-300"></div>
						<div class="h-3 w-40 rounded bg-gray-300"></div>
					</div>
				</div>
				<div class="flex items-center space-x-3">
					<div class="h-6 w-16 rounded-full bg-gray-300"></div>
					<div class="flex space-x-2">
						<div class="h-4 w-4 rounded bg-gray-300"></div>
						<div class="h-4 w-4 rounded bg-gray-300"></div>
					</div>
				</div>
			</div>
		</div>
	{/each}
{:else if type === 'employee-card'}
	<!-- Loading skeleton for employee cards -->
	{#each Array(count) as _}
		<div class="animate-pulse rounded-lg border border-neutral-200 bg-primary-50 p-4">
			<div class="flex items-start space-x-4">
				<div class="h-10 w-10 rounded-full bg-neutral-300"></div>
				<div class="flex-1 space-y-2">
					<div class="h-4 w-3/4 rounded bg-neutral-300"></div>
					<div class="h-3 w-1/2 rounded bg-neutral-300"></div>
				</div>
			</div>
			<div class="mt-4 space-y-2">
				<div class="h-3 rounded bg-neutral-300"></div>
				<div class="h-3 w-5/6 rounded bg-neutral-300"></div>
			</div>
		</div>
	{/each}
{:else if type === 'employee-grid'}
	<!-- Loading skeleton for employee grid layout -->
	<div class="grid grid-cols-1 gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
		{#each Array(count) as _}
			<div class="animate-pulse rounded-lg border border-neutral-200 bg-primary-50 p-4">
				<div class="flex items-start space-x-4">
					<div class="h-10 w-10 rounded-full bg-neutral-300"></div>
					<div class="flex-1 space-y-2">
						<div class="h-4 w-3/4 rounded bg-neutral-300"></div>
						<div class="h-3 w-1/2 rounded bg-neutral-300"></div>
					</div>
				</div>
				<div class="mt-4 space-y-2">
					<div class="h-3 rounded bg-neutral-300"></div>
					<div class="h-3 w-5/6 rounded bg-neutral-300"></div>
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

			<div class="flex animate-pulse items-center justify-between px-6 py-4">
				<div class="flex items-center space-x-4">
					<!-- Position skeleton with special styling for top 3 -->
					<div class="flex-shrink-0">
						<div class="h-8 w-8 {positionBg} rounded-full"></div>
					</div>

					<!-- Employee info skeleton -->
					<div class="min-w-0 flex-1 space-y-2">
						<div class="h-4 rounded bg-neutral-300 {isTopThree ? 'w-52' : 'w-48'}"></div>
						<div class="h-3 rounded bg-neutral-300 {isTopThree ? 'w-36' : 'w-32'}"></div>
					</div>
				</div>

				<!-- Balance skeleton -->
				<div class="flex-shrink-0 text-right">
					<div class="flex items-center space-x-2">
						<div class="h-5 w-5 rounded bg-yellow-200"></div>
						<div class="h-4 rounded bg-neutral-300 {isTopThree ? 'w-24' : 'w-20'}"></div>
					</div>
				</div>
			</div>
		{/each}
	</div>
{:else if type === 'pagination-stats'}
	<!-- Loading skeleton for pagination and statistics -->
	<div class="flex flex-col items-center justify-between sm:flex-row">
		<div class="flex flex-row gap-2">
			<div class="h-4 w-32 animate-pulse rounded bg-neutral-300"></div>
			<div class="h-4 w-2 animate-pulse rounded bg-neutral-300"></div>
			<div class="h-4 w-24 animate-pulse rounded bg-neutral-300"></div>
		</div>
		<div class="h-8 w-32 animate-pulse rounded-md bg-neutral-300"></div>
	</div>
{/if}
