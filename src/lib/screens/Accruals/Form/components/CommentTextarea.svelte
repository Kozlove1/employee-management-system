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

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && event.shiftKey) {
      // Shift+Enter добавляет новую строку - ничего не делаем
      return;
    }
    if (event.key === 'Enter') {
      // Обычный Enter предотвращает отправку формы
      event.preventDefault();
      event.stopPropagation();
      // Убираем фокус с поля
      const target = event.target as HTMLTextAreaElement;
      target.blur();
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
      onkeydown={handleKeyDown}
      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical disabled:bg-gray-50 disabled:cursor-not-allowed {error
        ? 'border-red-300'
        : ''}"
    ></textarea>
    <!-- Подсказка по использованию -->
    <div class="mt-1 text-xs text-gray-500">
      Enter - выйти из режима ввода, Shift+Enter - новая строка
    </div>
  {/snippet}
</FormField>
