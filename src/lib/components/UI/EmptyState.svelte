<script lang="ts">
  let {
    title,
    description,
    showButton = false,
    buttonText,
    buttonAction,
    disabled = false,
  } = $props();
</script>

<div
  class="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200"
>
  <h3 class="text-lg font-medium text-gray-900 mb-2">{title}</h3>
  <p class="text-gray-500 mb-4">
    {description}
  </p>

  {#if showButton && buttonAction}
    <button
      onclick={buttonAction}
      {disabled}
      class="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {buttonText}
    </button>
  {/if}
</div>
