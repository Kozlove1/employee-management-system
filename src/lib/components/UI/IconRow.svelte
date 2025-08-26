<script lang="ts">
  import {
    Award,
    Coins,
    ChartNoAxesCombined,
    Building2,
    Briefcase,
    Calendar,
    Mail,
    User,
    VenusAndMars,
    Menu,
    Crown,
  } from '@lucide/svelte';

  export type IconName =
    | 'award'
    | 'coins'
    | 'chart'
    | 'building'
    | 'briefcase'
    | 'calendar'
    | 'mail'
    | 'user'
    | 'venus-and-mars'
    | 'menu'
    | 'crown';

  export type IconColor = 'yellow' | 'black' | 'blue';

  type Props = {
    backgroundColor?: string;
    gapSize?: 's' | 'm' | 'l';
    title?: string;
    titleColor?: string;
    titleSize?: 's' | 'm' | 'l' | 'xl' | '3xl';
    icon: IconName;
    iconSize?: 's' | 'm' | 'l' | 'xl' | '2xl';
    iconColor?: IconColor;
    hoverColor?: string;
  };

  let {
    backgroundColor = 'bg-primary-50',
    gapSize = 'm',
    title,
    titleColor = 'text-neutral-500',
    titleSize = 'm',
    icon,
    iconSize = 'm',
    iconColor = 'black',
    hoverColor = 'text-neutral-700',
  }: Props = $props();

  const icons = {
    award: Award,
    coins: Coins,
    chart: ChartNoAxesCombined,
    building: Building2,
    briefcase: Briefcase,
    calendar: Calendar,
    mail: Mail,
    user: User,
    'venus-and-mars': VenusAndMars,
    menu: Menu,
    crown: Crown,
  };

  const iconSizes = {
    s: 10,
    m: 12,
    l: 16,
    xl: 22,
    '2xl': 28,
  };

  const iconColors = {
    yellow: '#f5e804',
    black: '#002335',
    blue: '#005691',
  };

  const titleSizes = {
    s: 'text-xs',
    m: 'text-sm',
    l: 'text-base',
    xl: 'text-lg',
    '3xl': 'text-3xl',
  };

  const gapSizes = {
    s: 'gap-1',
    m: 'gap-2',
    l: 'gap-3',
  };

  const backgroundStyles = backgroundColor
    ? `${backgroundColor} rounded-md p-1`
    : '';

  const IconComponent = icons[icon];
</script>

<div>
  <div class="flex items-center {gapSizes[gapSize]} {backgroundStyles}">
    <IconComponent
      size={iconSizes[iconSize]}
      class="group-hover:{hoverColor}"
      color={iconColors[iconColor]}
    />
    {#if title}
      <p class="{titleSizes[titleSize]} {titleColor} group-hover:{hoverColor}">
        {title}
      </p>
    {/if}
  </div>
</div>
