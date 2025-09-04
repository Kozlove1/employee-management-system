<script lang="ts">
  type SpinnerSize = 'sm' | 'md' | 'lg';
  type TopOffset = '25vh' | '50vh' | '75vh';

  let {
    title = 'Загрузка...',
    size = 'lg' as SpinnerSize,
    topOffset = '0vh' as TopOffset,
  } = $props();

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };
</script>

<div
  class="fixed inset-0 flex justify-center items-center"
  style="padding-top: {topOffset}"
>
  <div class="text-center">
    <div
      class="animate-spin rounded-full border-b-2 {sizeClasses[
        size
      ]} border-info-500 mb-2 mx-auto"
    ></div>
    <p class="text-neutral-600">{title}</p>
  </div>
</div>
