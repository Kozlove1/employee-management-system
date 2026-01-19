import { departmentsStore } from "$lib/stores/departmentsStore.svelte";
import type { EmployeeWithDetails } from "$lib/types/shared";
import { employeesApi } from "../api/employeesApi";

class EmployeeStore {
	private apiEmployees = $state<EmployeeWithDetails[]>([]);
	private isLoading = $state<boolean>(false);
	private error = $state<string | null>(null);
	private searchTerm = $state<string>("");
	private selectedDepartment = $state<string>("");
	private activeOnly = $state<boolean>(false);
	private currentPage = $state<number>(1);
	private itemsPerPage = $state<number>(50);
	private showDetailModal = $state<boolean>(false);
	private selectedEmployee = $state<EmployeeWithDetails | null>(null);
	private abortController: AbortController | null = null;
	private activeEmployeesCount = $state<number>(0);
	private lookupEmployees = $state<EmployeeWithDetails[]>([]);
	private lookupLoading = $state<boolean>(false);
	private lookupLoaded = $state<boolean>(false);
	private lookupRequest: Promise<void> | null = null;
	private totalCount = $state<number>(0);
	private isExactCount = $state<boolean>(false);

	getApiEmployees() {
		return this.apiEmployees;
	}

	getIsLoading() {
		return this.isLoading;
	}

	getError() {
		return this.error;
	}

	getSearchTerm() {
		return this.searchTerm;
	}

	getSelectedDepartment() {
		return this.selectedDepartment;
	}

	getActiveOnly() {
		return this.activeOnly;
	}

	getCurrentPage() {
		return this.currentPage;
	}

	getItemsPerPage() {
		return this.itemsPerPage;
	}

	getShowDetailModal() {
		return this.showDetailModal;
	}

	getSelectedEmployee() {
		return this.selectedEmployee;
	}

	getActiveEmployeesCount() {
		return this.activeEmployeesCount;
	}

	getLookupEmployees() {
		return this.lookupEmployees;
	}

	getIsLookupLoading() {
		return this.lookupLoading;
	}

	getIsLookupLoaded() {
		return this.lookupLoaded;
	}

	getTotalCount() {
		return this.totalCount;
	}

	getIsExactCount() {
		return this.isExactCount;
	}

	private _employeeOptionsCache: Array<{ value: string; label: string }> | null = null;
	private _employeeOptionsCacheKey: string = "";

	employeeOptions = $derived.by(() => {
		const lookupEmployees = this.getLookupEmployees();
		const cacheKey = `${lookupEmployees.length}-${lookupEmployees.map(e => `${e.employee_guid}-${e.date_delete}`).join(',')}`;
		
		if (this._employeeOptionsCache && this._employeeOptionsCacheKey === cacheKey) {
			return this._employeeOptionsCache;
		}

		const activeEmployees = lookupEmployees.filter((employee) => !employee.date_delete);
		const sorted = [...activeEmployees].sort((a, b) => a.employee.localeCompare(b.employee));
		
		this._employeeOptionsCache = [
			{ value: '', label: 'Все сотрудники' },
			...sorted.map((employee) => ({
				value: employee.employee_guid,
				label: employee.employee
			}))
		];
		this._employeeOptionsCacheKey = cacheKey;
		
		return this._employeeOptionsCache;
	});

	paginatedEmployees = $derived(this.apiEmployees);

	totalPages = $derived.by(() => {
		const pages = Math.ceil(this.totalCount / this.itemsPerPage);
		return pages > 0 ? pages : (this.apiEmployees.length > 0 ? 1 : 0);
	});

	private normalizeEmployees(employeesList: EmployeeWithDetails[]): EmployeeWithDetails[] {
		const departments = departmentsStore.getDepartments();
		const departmentsMap = new Map(departments.map(dept => [dept.id, dept]));
		
		return employeesList.map((emp) => {
			const empData = emp as unknown as Record<string, unknown> & {
				position?: { id?: string; post?: string };
				department?: { id?: string; department?: string };
				id?: string;
			};

			const position = empData.position || {};
			const department = empData.department || {};

			let departmentName = emp.department_name || department.department;
			const empDepartmentGuid =
				(emp.department_guid as string) ||
				department.id ||
				(empData.department_guid as string) ||
				"";

			if (empDepartmentGuid && departmentsMap.size > 0) {
				const dept = departmentsMap.get(empDepartmentGuid);
				if (dept) {
					departmentName = dept.department;
				}
			}

			const employeeGuid = emp.employee_guid || empData.id || emp.ident || "";
			const positionName = emp.position_name || position.post || emp.post || undefined;

			return {
				...emp,
				employee_guid: (employeeGuid as string) || emp.ident || "",
				department_guid: empDepartmentGuid || emp.department_guid || "",
				department_name: departmentName || undefined,
				position_name: positionName,
				post_guid: emp.post_guid || position.id || "",
				post: position.post || emp.post || undefined,
			} as EmployeeWithDetails;
		});
	}

	private cancelPreviousRequest() {
		if (this.abortController) {
			this.abortController.abort();
		}
		this.abortController = new AbortController();
	}

	async fetchEmployees() {
		if (this.isLoading) return;

		this.setLoading(true);
		this.clearError();
		this.cancelPreviousRequest();

		if (departmentsStore.getDepartments().length === 0) {
			await departmentsStore.initialize();
		}

		try {
			const params: {
				page: number;
				limit: number;
				active_only?: boolean;
				search?: string;
				department_guid?: string;
			} = {
				page: this.currentPage,
				limit: this.itemsPerPage,
			};

			if (this.activeOnly) {
				params.active_only = true;
			}

			if (this.searchTerm) {
				params.search = this.searchTerm;
			}

			if (this.selectedDepartment) {
				params.department_guid = this.selectedDepartment;
			}

			const response = await employeesApi.getAll(params);

			if (response.status === "success") {
				const listResponse = response.data as unknown as {
					list: EmployeeWithDetails[];
					page: number;
					total_page: number;
					total: number;
				};
				
				const employeesList = listResponse.list || [];
				const employees = this.normalizeEmployees(employeesList);
				
				this.apiEmployees = employees;

				if (listResponse.total !== undefined) {
					this.totalCount = listResponse.total;
					this.isExactCount = true;
				} else if (employees.length < this.itemsPerPage) {
					this.totalCount = (this.currentPage - 1) * this.itemsPerPage + employees.length;
					this.isExactCount = true;
				} else {
					this.totalCount = this.currentPage * this.itemsPerPage;
					this.isExactCount = false;
				}
			} else {
				this.setError(response.message || "Ошибка загрузки сотрудников");
				this.apiEmployees = [];
				this.totalCount = 0;
				this.isExactCount = false;
			}
		} catch (err) {
			if (err instanceof Error && err.name === 'AbortError') {
				return;
			}
			this.setError(
				err instanceof Error
					? err.message
					: "Произошла неизвестная ошибка при загрузке данных",
			);
			this.apiEmployees = [];
			this.totalCount = 0;
			this.isExactCount = false;
		} finally {
			this.setLoading(false);
		}
	}

	async fetchLookupEmployees(force = false): Promise<void> {
		if (!force && this.lookupLoaded) {
			return;
		}
		if (this.lookupRequest) {
			return this.lookupRequest;
		}

		this.lookupLoading = true;

		this.lookupRequest = (async () => {
			if (departmentsStore.getDepartments().length === 0) {
				await departmentsStore.initialize();
			}

			try {
				const response = await employeesApi.getAll({
					page: -1,
					active_only: false
				});

				if (response.status === "success") {
					const listResponse = response.data as unknown as {
						list: EmployeeWithDetails[];
						total?: number;
					};
					const employeesList = listResponse.list || [];
					
					this.lookupEmployees = this.normalizeEmployees(employeesList);
					this.lookupLoaded = true;
					this.activeEmployeesCount =
						typeof listResponse.total === "number"
							? listResponse.total
							: this.lookupEmployees.length;
					
					this._employeeOptionsCache = null;
					this._employeeOptionsCacheKey = "";
				} else {
					this.lookupEmployees = [];
					this.lookupLoaded = false;
					this.activeEmployeesCount = 0;
					this._employeeOptionsCache = null;
					this._employeeOptionsCacheKey = "";
				}
			} catch (err) {
				this.lookupEmployees = [];
				this.lookupLoaded = false;
				this.activeEmployeesCount = 0;
			} finally {
				this.lookupLoading = false;
				this.lookupRequest = null;
			}
		})();

		return this.lookupRequest;
	}

	setLoading(isLoading: boolean) {
		this.isLoading = isLoading;
	}

	setError(error: string | null) {
		this.error = error;
	}

	clearError() {
		this.error = null;
	}

	openEmployeeDetail(employee: EmployeeWithDetails) {
		this.selectedEmployee = employee;
		this.showDetailModal = true;
	}

	closeModal() {
		this.showDetailModal = false;
		this.selectedEmployee = null;
	}

	nextPage() {
		if (this.currentPage < this.totalPages) {
			this.currentPage++;
			this.fetchEmployees();
		}
	}

	prevPage() {
		if (this.currentPage > 1) {
			this.currentPage--;
			this.fetchEmployees();
		}
	}

	goToPage(page: number) {
		if (page >= 1 && page <= this.totalPages) {
			this.currentPage = page;
			this.fetchEmployees();
		}
	}

	setSearchTerm(term: string) {
		this.searchTerm = term;
		this.currentPage = 1;
		this.fetchEmployees();
	}

	setDepartmentFilter(departmentGuid: string) {
		this.selectedDepartment = departmentGuid;
		this.currentPage = 1;
		this.fetchEmployees();
	}

	setActiveOnlyFilter(activeOnlyValue: boolean) {
		this.activeOnly = activeOnlyValue;
		this.currentPage = 1;
		this.fetchEmployees();
	}

	setItemsPerPage(itemsPerPage: number) {
		this.itemsPerPage = itemsPerPage;
		this.currentPage = 1;
		this.fetchEmployees();
	}

	clearFilters() {
		this.searchTerm = "";
		this.selectedDepartment = "";
		this.activeOnly = false;
		this.currentPage = 1;
		this.fetchEmployees();
	}

	refreshData() {
		this.fetchEmployees();
	}

	retry() {
		this.clearError();
		this.fetchEmployees();
	}

	simulateError() {
		this.setError(
			"Демонстрация ошибки: Не удалось подключиться к серверу. Проверьте интернет-соединение.",
		);
	}

	getStatusBadge(employee: EmployeeWithDetails) {
		return employee.date_delete ? "Уволен" : "Активен";
	}
}

export const employeeStore = new EmployeeStore();
