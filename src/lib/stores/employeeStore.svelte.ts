import { apiEmployeesData } from '$lib/components/Employees/employeesMockData';
import { mockDepartments } from '$lib/data/mockData';
import type { EmployeeWithDetails } from '$lib/types';

class EmployeeStore {
  // Основные данные
  apiEmployees = $state<EmployeeWithDetails[]>([]);
  isLoading = $state(false);

  // Фильтры и поиск
  searchTerm = $state('');
  selectedDepartment = $state('');
  activeOnly = $state(false);

  // Пагинация
  currentPage = $state(1);
  itemsPerPage = $state(12);

  // Модальное окно
  showDetailModal = $state(false);
  selectedEmployee = $state<EmployeeWithDetails | null>(null);

  // Вычисляемые значения
  filteredEmployees = $derived(() => {
    let filtered = this.apiEmployees;

    // Поиск по имени
    if (this.searchTerm) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(emp => 
        emp.employee.toLowerCase().includes(searchLower) ||
        emp.ident.toLowerCase().includes(searchLower)
      );
    }

    // Фильтр по подразделению
    if (this.selectedDepartment) {
      filtered = filtered.filter(emp => 
        emp.department_guid === this.selectedDepartment
      );
    }

    // Фильтр только активные
    if (this.activeOnly) {
      filtered = filtered.filter(emp => !emp.datedismis);
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

  // Методы для работы с данными
  async fetchEmployees() {
    if (this.isLoading) return;
    
    this.isLoading = true;
    try {
      // Имитация API запроса
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

  // Методы для управления модальным окном
  openEmployeeDetail(employee: EmployeeWithDetails) {
    this.selectedEmployee = employee;
    this.showDetailModal = true;
  }

  closeModal() {
    this.showDetailModal = false;
    this.selectedEmployee = null;
  }

  // Методы для пагинации
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

  // Методы для фильтров
  setSearchTerm(term: string) {
    this.searchTerm = term;
    this.currentPage = 1; // Сброс на первую страницу при поиске
  }

  setDepartmentFilter(departmentGuid: string) {
    this.selectedDepartment = departmentGuid;
    this.currentPage = 1; // Сброс на первую страницу при фильтрации
  }

  setActiveOnlyFilter(activeOnly: boolean) {
    this.activeOnly = activeOnly;
    this.currentPage = 1; // Сброс на первую страницу при фильтрации
  }

  clearFilters() {
    this.searchTerm = '';
    this.selectedDepartment = '';
    this.activeOnly = false;
    this.currentPage = 1;
  }

  // Вспомогательные методы
  refreshData() {
    this.fetchEmployees();
  }

  private generateRandomBalance() {
    return Math.floor(Math.random() * 50000) + 1000;
  }

  // Форматирование данных
  formatDate(dateStr: string) {
    if (!dateStr) return '';
    try {
      const [day, month, year] = dateStr.split('.');
      return `${day}.${month}.${year}`;
    } catch {
      return dateStr;
    }
  }

  getStatusBadge(employee: EmployeeWithDetails) {
    return employee.datedismis ? 'Уволен' : 'Активен';
  }
}

// Экспортируем единственный экземпляр store
export const employeeStore = new EmployeeStore();
