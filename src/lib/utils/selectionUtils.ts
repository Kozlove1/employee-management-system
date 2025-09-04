/**
 * Utility functions for safe handling of text selection to prevent Selection API errors
 */

/**
 * Safely clears all text selections to prevent IndexSizeError
 * This is useful when navigating or performing actions that might interfere with text selection
 */
export function clearTextSelection(): void {
  try {
    if (typeof window !== 'undefined' && window.getSelection) {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        selection.removeAllRanges();
      }
    }
  } catch (error) {
    // Silently handle any selection API errors
    console.warn('Failed to clear text selection:', error);
  }
}

/**
 * Safely removes focus from the currently focused element
 * This helps prevent selection-related issues during navigation
 */
export function blurActiveElement(): void {
  try {
    if (typeof document !== 'undefined' && document.activeElement) {
      const activeElement = document.activeElement as HTMLElement;
      if (activeElement && typeof activeElement.blur === 'function') {
        activeElement.blur();
      }
    }
  } catch (error) {
    // Silently handle any focus-related errors
    console.warn('Failed to blur active element:', error);
  }
}

/**
 * Safely gets the current text selection without throwing errors
 * @returns The selected text or empty string if no selection or error occurs
 */
export function getSelectedText(): string {
  try {
    if (typeof window !== 'undefined' && window.getSelection) {
      const selection = window.getSelection();
      return selection ? selection.toString() : '';
    }
    return '';
  } catch (error) {
    console.warn('Failed to get selected text:', error);
    return '';
  }
}

/**
 * Safely checks if there is any text selection
 * @returns true if there is a valid text selection, false otherwise
 */
export function hasTextSelection(): boolean {
  try {
    if (typeof window !== 'undefined' && window.getSelection) {
      const selection = window.getSelection();
      return selection ? selection.toString().length > 0 : false;
    }
    return false;
  } catch (error) {
    console.warn('Failed to check text selection:', error);
    return false;
  }
}

/**
 * Comprehensive function to prepare for navigation by clearing selection and removing focus
 * This should be called before any navigation action to prevent Selection API errors
 */
export function prepareForNavigation(): void {
  clearTextSelection();
  blurActiveElement();
}
