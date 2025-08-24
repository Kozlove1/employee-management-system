import { mockDepartments } from '$lib/data/mockData';
import { apiEmployeesData } from '$lib/screens/Employees/employeesMockData';
import type { EmployeeWithDetails } from '$lib/types';

class EmployeeStore {
  // Main data
  apiEmployees = $state<EmployeeWithDetails[]>([]);
  isLoading = $state(false);

  // Filters and search
  searchTerm = $state('');
  selectedDepartment = $state('');
  activeOnly = $state(false);

  // Pagination
  currentPage = $state(1);
  itemsPerPage = $state(50);

  // Modal window
  showDetailModal = $state(false);
  selectedEmployee = $state<EmployeeWithDetails | null>(null);

  // Computed values
  filteredEmployees = $derived(() => {
    let filtered = this.apiEmployees;

    // Search by name
    if (this.searchTerm) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(emp => 
        emp.employee.toLowerCase().includes(searchLower) ||
        emp.ident.toLowerCase().includes(searchLower)
      );
    }

    // Filter by department
    if (this.selectedDepartment) {
      filtered = filtered.filter(emp => 
        emp.department_guid === this.selectedDepartment
      );
    }

    // Filter only active
    if (this.activeOnly) {
      filtered = filtered.filter(employee => !employee.datedismis);
    }

    return filtered;
  });

  totalPages = $derived(() => {
    return Math.ceil(this.filteredEmployees().length / this.itemsPerPage);
  });

  paginatedEmployees = $derived(() => {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredEmployees().slice(startIndex, endIndex);
  });

  // Methods for working with data
  async fetchEmployees() {
    if (this.isLoading) return;
    
    this.isLoading = true;
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
    } catch (error) {
      console.error('Error fetching employees:', error);
      this.apiEmployees = [];
    } finally {
      this.isLoading = false;
    }
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
    if (this.currentPage < this.totalPages()) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
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

  setActiveOnlyFilter(activeOnly: boolean) {
    this.activeOnly = activeOnly;
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

  private generateRandomBalance() {
    return Math.floor(Math.random() * 50000) + 1000;
  }

  getStatusBadge(employee: EmployeeWithDetails) {
    return employee.datedismis ? 'Уволен' : 'Активен';
  }
}


export const employeeStore = new EmployeeStore();
