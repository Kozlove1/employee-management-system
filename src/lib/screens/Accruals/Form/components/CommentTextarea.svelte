<script lang="ts">
  import FormField from './FormField.svelte';

  type Props = {
    value: string;
    required?: boolean;
    disabled?: boolean;
    rows?: number;
    placeholder?: string;
    label?: string;
    error?: string;
    onValueChange?: (value: string) => void;
  };

  let {
    value,
    required = false,
    disabled = false,
    rows = 3,
    placeholder = 'Введите комментарий',
    label = 'Комментарий (необязательно)',
    error,
    onValueChange,
  }: Props = $props();

  function handleInput(event: Event) {
    const target = event.target as HTMLTextAreaElement;
    if (onValueChange) {
      onValueChange(target.value);
    }
  }
</script>

<FormField {label} {required} {error} id="comment-textarea">
  {#snippet children()}
    <textarea
      id="comment-textarea"
      {value}
      {rows}
      {disabled}
      {placeholder}
      oninput={handleInput}
      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical disabled:bg-gray-50 disabled:cursor-not-allowed {error
        ? 'border-red-300'
        : ''}"
    ></textarea>
  {/snippet}
</FormField>
