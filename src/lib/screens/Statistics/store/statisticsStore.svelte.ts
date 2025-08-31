import { getTopEmployeesByBalance } from '$lib/screens/Statistics/statisticsMockData';
import type { EmployeeStats } from '$lib/types';

class StatisticsStore {
  private topEmployees = $state<EmployeeStats[]>([]);
  private isLoading = $state<boolean>(false);
  private error = $state<string | null>(null);
  private topEmployeesCount = $state<number>(10);

  getTopEmployees() {
    return this.topEmployees;
  }

  getIsLoading() {
    return this.isLoading;
  }

  getError() {
    return this.error;
  }

  getTopEmployeesCount() {
    return this.topEmployeesCount;
  }

  hasData = $derived(this.topEmployees.length > 0);
  
  setLoading(loading: boolean) {
    this.isLoading = loading;
  }

  setError(error: string | null) {
    this.error = error;
  }

  clearError() {
    this.error = null;
  }

  setTopEmployeesCount(count: number) {
    this.topEmployeesCount = count;
    if (this.topEmployees.length > 0) {
      this.fetchStatistics();
    }
  }

  async fetchStatistics() {
    if (this.isLoading) return;
    
    this.setLoading(true);
    this.clearError();
    
    try {
      // Mock API request
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      const data = getTopEmployeesByBalance(this.topEmployeesCount);
      this.topEmployees = data;
    } catch (err) {
      console.error('Error fetching statistics:', err);
      this.setError(err instanceof Error ? err.message : 'Произошла неизвестная ошибка при загрузке статистики');
      this.topEmployees = [];
    } finally {
      this.setLoading(false);
    }
  }

  refreshData() {
    this.fetchStatistics();
  }

  retry() {
    this.clearError();
    this.fetchStatistics();
  }

  simulateError() {
    this.setError('Демонстрация ошибки: Не удалось загрузить статистику с сервера.');
  }
}

export const statisticsStore = new StatisticsStore();
