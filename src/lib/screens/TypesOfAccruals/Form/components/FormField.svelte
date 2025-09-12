<script lang="ts">
	interface Props {
		label: string
		required?: boolean
		error?: string
		children: any
	}

	let { label, required = false, error, children }: Props = $props()

	let fieldId = `field-${Math.random().toString(36).substr(2, 9)}`
</script>

<div class="space-y-2">
	<label for={fieldId} class="block text-sm font-medium text-gray-700">
		{label}
		{#if required}
			<span class="ml-1 text-red-500">*</span>
		{/if}
	</label>

	<div id={fieldId}>
		{@render children()}
	</div>

	{#if error}
		<p class="text-sm text-red-600">{error}</p>
	{/if}
</div>
