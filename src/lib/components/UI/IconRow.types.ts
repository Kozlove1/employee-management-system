export type IconName = 'award' | 'coins' | 'building2' | 'briefcase' | 'calendar' | 'mail' | 'user' | 'venusAndMars';

export interface IconRowProps {
  backgroundColor?: string;
  gapSize?: 's' | 'm' | 'l';
  title?: string;
  titleColor?: string;
  titleSize?: 's' | 'm' | 'l';
  icon: IconName;
  iconSize?: 's' | 'm' | 'l';
}