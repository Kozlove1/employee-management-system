<script lang="ts">
	import type { Snippet } from 'svelte'

	type Props = {
		label: string
		required?: boolean
		hint?: string
		error?: string
		id?: string
		children: Snippet
	}

	let { label, required = false, hint, error, id, children }: Props = $props()
</script>

<div class="space-y-1">
	<label for={id} class="block text-sm font-bold text-gray-700">
		{label}
		{#if required}
			<span class="text-red-500">*</span>
		{/if}
		{#if hint}
			<span class="ml-1 text-xs text-blue-700">
				{hint}
			</span>
		{/if}
	</label>

	{@render children()}

	{#if error}
		<p class="mt-1 text-xs text-red-600">
			{error}
		</p>
	{/if}
</div>
