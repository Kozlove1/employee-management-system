export const APP_MAX_WIDTH = 'max-w-7xl';

export const CONTAINER_SM = 'max-w-2xl mx-auto';
export const CONTAINER_MD = 'max-w-4xl mx-auto';
export const CONTAINER_LG = 'max-w-6xl mx-auto';

export function getAppContainerStyle(additionalClasses = '') {
  return `${APP_MAX_WIDTH} mx-auto px-4 sm:px-6 lg:px-8 ${additionalClasses}`.trim();
}