import { mockDepartments } from '$lib/data/mockData';
import { apiEmployeesData } from '$lib/screens/Employees/employeesMockData';
import type { EmployeeWithDetails } from '$lib/types';

//reference: https://medium.com/@chose/week-7-how-to-manage-shared-state-in-svelte-5-with-runes-77a4ad305b8a

class EmployeeStore {
  private apiEmployees = $state<EmployeeWithDetails[]>([]);
  private isLoading = $state<boolean>(false);
  private error = $state<string | null>(null);
  private searchTerm = $state<string>('');
  private selectedDepartment = $state<string>('');
  private activeOnly = $state<boolean>(false);
  private currentPage = $state<number>(1);
  private itemsPerPage = $state<number>(50);
  private showDetailModal = $state<boolean>(false);
  private selectedEmployee = $state<EmployeeWithDetails | null>(null);

  // Public getters for accessing state
  getApiEmployees() { return this.apiEmployees; }
  getIsLoading() { return this.isLoading; }
  getError() { return this.error; }
  getSearchTerm() { return this.searchTerm; }
  getSelectedDepartment() { return this.selectedDepartment; }
  getActiveOnly() { return this.activeOnly; }
  getCurrentPage() { return this.currentPage; }
  getItemsPerPage() { return this.itemsPerPage; }
  getShowDetailModal() { return this.showDetailModal; }
  getSelectedEmployee() { return this.selectedEmployee; }

  // Computed values with $derived
  filteredEmployees = $derived.by(() => {
    let filtered = this.apiEmployees;

    if (this.searchTerm) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(emp => 
        emp.employee.toLowerCase().includes(searchLower) ||
        emp.ident.toLowerCase().includes(searchLower)
      );
    }

    if (this.selectedDepartment) {
      filtered = filtered.filter(emp => emp.department_guid === this.selectedDepartment);
    }

    if (this.activeOnly) {
      filtered = filtered.filter(emp => !emp.datedismis);
    }

    return filtered;
  });

  totalPages = $derived(Math.ceil(this.filteredEmployees.length / this.itemsPerPage));

  paginatedEmployees = $derived.by(() => {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredEmployees.slice(startIndex, endIndex);
  });

  // Methods for working with data
  async fetchEmployees() {
    if (this.isLoading) return;
    
    this.setLoading(true);
    this.clearError();
    try {
      // Mock API request
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      const enrichedData = apiEmployeesData.map((employee) => {
        const department = mockDepartments.find(
          (dept) => dept.department_guid === employee.department_guid
        );
        return {
          ...employee,
          department_name: department?.department || 'Неизвестное подразделение',
          position_name: employee.sex === 'Мужской' 
            ? 'Старший мастер по ремонту и обслуживанию оборудования'
            : 'Специалист по договорной работе',
          balance: this.generateRandomBalance(),
        };
      });
      
      this.apiEmployees = enrichedData;
    } catch (err) {
      console.error('Error fetching employees:', err);
      this.setError(err instanceof Error ? err.message : 'Произошла неизвестная ошибка при загрузке данных');
      this.apiEmployees = [];
    } finally {
      this.setLoading(false);
    }
  }

  // State management methods following the article pattern
  setLoading(isLoading: boolean) {
    this.isLoading = isLoading;
  }

  setError(error: string | null) {
    this.error = error;
  }

  clearError() {
    this.error = null;
  }

  // Methods for managing the modal window
  openEmployeeDetail(employee: EmployeeWithDetails) {
    this.selectedEmployee = employee;
    this.showDetailModal = true;
  }

  closeModal() {
    this.showDetailModal = false;
    this.selectedEmployee = null;
  }

  // Methods for pagination
  nextPage() {
    if (this.currentPage < this.totalPages) { 
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // Methods for filters
  setSearchTerm(term: string) {
    this.searchTerm = term;
    this.currentPage = 1;
  }

  setDepartmentFilter(departmentGuid: string) {
    this.selectedDepartment = departmentGuid;
    this.currentPage = 1;
  }

  setActiveOnlyFilter(activeOnlyValue: boolean) {
    this.activeOnly = activeOnlyValue;
    this.currentPage = 1;
  }

  clearFilters() {
    this.searchTerm = '';
    this.selectedDepartment = '';
    this.activeOnly = false;
    this.currentPage = 1;
  }

  // Helper methods
  refreshData() {
    this.fetchEmployees();
  }

  retry() {
    this.clearError();
    this.fetchEmployees();
  }

  // Demo method to simulate error (for testing)
  simulateError() {
    this.setError('Демонстрация ошибки: Не удалось подключиться к серверу. Проверьте интернет-соединение.');  
  }

  generateRandomBalance() {
    return Math.floor(Math.random() * 50000) + 1000;
  }

  getStatusBadge(employee: EmployeeWithDetails) {
    return employee.datedismis ? 'Уволен' : 'Активен';
  }
}

export const employeeStore = new EmployeeStore();