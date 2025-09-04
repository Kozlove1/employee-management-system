<script lang="ts">
  import { Search } from '@lucide/svelte';

  interface Props {
    value: string;
    placeholder?: string;
    bgColor?: string;
    borderColor?: string;
    rounded?: string;
    onChange: (value: string) => void;
  }

  let {
    value,
    placeholder = 'Поиск...',
    bgColor = 'bg-white',
    borderColor = 'border-gray-300',
    rounded = 'rounded-lg',
    onChange,
  } = $props();
</script>

<div class="relative">
  <Search
    class="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4"
  />
  <input
    type="text"
    {placeholder}
    {value}
    oninput={(e) => onChange((e.target as HTMLInputElement).value)}
    class="w-full pl-8 pr-4 py-2 border {borderColor} {rounded} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-sm placeholder:text-gray-400 {bgColor}"
  />
</div>
