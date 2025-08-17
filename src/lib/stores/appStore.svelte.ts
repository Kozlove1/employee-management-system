// Svelte 5 runes state management
class AppState {
  currentView = $state('accruals');
  sidebarOpen = $state(false);
}

export const appState = new AppState();
