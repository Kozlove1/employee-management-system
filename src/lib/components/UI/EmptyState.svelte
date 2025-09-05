<script lang="ts">
	let {
		title,
		description,
		showButton = false,
		buttonText,
		buttonAction,
		disabled = false
	} = $props()
</script>

<div class="rounded-lg border border-gray-200 bg-white py-12 text-center shadow-sm">
	<h3 class="mb-2 text-lg font-medium text-gray-900">{title}</h3>
	<p class="mb-4 text-gray-500">
		{description}
	</p>

	{#if showButton && buttonAction}
		<button
			onclick={buttonAction}
			{disabled}
			class="inline-flex items-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
		>
			{buttonText}
		</button>
	{/if}
</div>
