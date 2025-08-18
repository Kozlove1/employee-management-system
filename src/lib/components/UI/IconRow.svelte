<script lang="ts">
  import type { Component } from '@lucide/svelte';

  interface Props {
    icon: typeof Component;
    iconSize?: 's' | 'm' | 'l';
    title: string;
    titleSize?: 's' | 'm' | 'l';
    titleColor?: string;
    backgroundColor?: string;
  }

  let {
    icon: IconComponent,
    title,
    titleColor = 'title-gray-500',
    iconSize = 'm',
    titleSize = 'm',
    backgroundColor = 'bg-white',
  }: Props = $props();

  const iconSizes = {
    s: 10,
    m: 12,
    l: 16,
  };

  const titleSizes = {
    s: 'title-xs',
    m: 'title-sm',
    l: 'title-base',
  };

  const backgroundStyles = backgroundColor
    ? `${backgroundColor} rounded-md p-2`
    : '';
</script>

<div>
  <div class="flex items-center gap-2 {backgroundStyles}">
    <IconComponent size={iconSizes[iconSize]} />
    <p class="{titleSizes[titleSize]} {titleColor}">{title}</p>
  </div>
</div>
