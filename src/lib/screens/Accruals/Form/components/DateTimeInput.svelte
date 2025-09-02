<script lang="ts">
  import FormField from './FormField.svelte';

  type Props = {
    value: string;
    required?: boolean;
    disabled?: boolean;
    label?: string;
    error?: string;
    onValueChange?: (value: string) => void;
  };

  let {
    value,
    required = false,
    disabled = false,
    label = 'Дата',
    error,
    onValueChange,
  }: Props = $props();

  function handleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    if (onValueChange) {
      onValueChange(target.value);
    }
  }
</script>

<FormField {label} {required} {error} id="datetime-input">
  {#snippet children()}
    <div class="relative">
      <input
        id="datetime-input"
        type="datetime-local"
        {value}
        {required}
        {disabled}
        oninput={handleInput}
        class="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed {error
          ? 'border-red-300'
          : ''}"
      />
      <div
        class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
      >
        <svg
          class="h-5 w-5 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    </div>
  {/snippet}
</FormField>
