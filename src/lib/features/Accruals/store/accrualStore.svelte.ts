import { employeeStore } from "$lib/features/Employees/store/employeeStore.svelte";
import { accrualTypesStore } from "$lib/features/TypesOfAccruals/store/accrualTypesStore.svelte";
import { accrualsApi } from "../api/accrualsApi";
import type { AccrualFormData, AccrualWithDetails } from "../types";

class AccrualStore {
	private accruals = $state<AccrualWithDetails[]>([]);
	private isLoading = $state<boolean>(false);
	private error = $state<string | null>(null);
	private searchTerm = $state<string>("");
	private selectedEmployee = $state<string>("");
	private selectedType = $state<string>("");
	private sortOrder = $state<"newest" | "oldest">("newest");
	private hasInitialized = $state<boolean>(false);

	getAccruals(): AccrualWithDetails[] {
		return this.accruals;
	}

	getIsLoading(): boolean {
		return this.isLoading;
	}

	getError(): string | null {
		return this.error;
	}

	getSearchTerm(): string {
		return this.searchTerm;
	}

	getSelectedEmployee(): string {
		return this.selectedEmployee;
	}

	getSelectedType(): string {
		return this.selectedType;
	}

	getSortOrder(): "newest" | "oldest" {
		return this.sortOrder;
	}

	filteredAccruals = $derived.by(() => {
		let filtered = [...this.accruals];

		if (this.searchTerm) {
			const searchLower = this.searchTerm.toLowerCase();
			filtered = filtered.filter(
				(accrual) =>
					accrual.employee_name?.toLowerCase().includes(searchLower) ||
					accrual.type_name?.toLowerCase().includes(searchLower) ||
					accrual.comment?.toLowerCase().includes(searchLower),
			);
		}

		if (this.selectedEmployee) {
			filtered = filtered.filter(
				(accrual) => accrual.employee_guid === this.selectedEmployee,
			);
		}

		if (this.selectedType) {
			filtered = filtered.filter(
				(accrual) => accrual.type_guid === this.selectedType,
			);
		}

		if (this.sortOrder === "oldest") {
			filtered.sort((a, b) => {
				const dateA = a.date ? new Date(a.date).getTime() : 0;
				const dateB = b.date ? new Date(b.date).getTime() : 0;
				return dateA - dateB;
			});
		} else {
			filtered.sort((a, b) => {
				const dateA = a.date ? new Date(a.date).getTime() : 0;
				const dateB = b.date ? new Date(b.date).getTime() : 0;
				return dateB - dateA;
			});
		}

		return filtered;
	});

	uniqueEmployees = $derived.by(() => {
		const employeeMap = new Map();
		this.accruals.forEach((accrual) => {
			if (accrual.employee_guid && accrual.employee_name) {
				employeeMap.set(accrual.employee_guid, {
					employee_guid: accrual.employee_guid,
					employee_name: accrual.employee_name,
				});
			}
		});
		return Array.from(employeeMap.values());
	});

	uniqueTypes = $derived.by(() => {
		const typeMap = new Map();
		this.accruals.forEach((accrual) => {
			if (accrual.type_guid && accrual.type_name) {
				typeMap.set(accrual.type_guid, {
					type_guid: accrual.type_guid,
					type_name: accrual.type_name,
				});
			}
		});
		return Array.from(typeMap.values());
	});

	stats = $derived.by(() => {
		const currentMonth = new Date().getMonth();
		const currentYear = new Date().getFullYear();

		const monthlyAccruals = this.accruals.filter((accrual) => {
			if (!accrual.date) return false;
			const accrualDate = new Date(accrual.date);
			return (
				accrualDate.getMonth() === currentMonth &&
				accrualDate.getFullYear() === currentYear
			);
		});

		const monthlyAmount = monthlyAccruals.reduce(
			(sum, accrual) => sum + (accrual.amount || 0),
			0,
		);

		return {
			total: this.accruals.length,
			monthlyCount: monthlyAccruals.length,
			monthlyAmount,
		};
	});

	setLoading(loading: boolean): void {
		this.isLoading = loading;
	}

	setError(error: string | null): void {
		this.error = error;
	}

	clearError(): void {
		this.error = null;
	}

	setSearchTerm(term: string): void {
		this.searchTerm = term;
	}

	setSelectedEmployee(employeeGuid: string): void {
		this.selectedEmployee = employeeGuid;
	}

	setSelectedType(typeGuid: string): void {
		this.selectedType = typeGuid;
	}

	setSortOrder(order: "newest" | "oldest"): void {
		this.sortOrder = order;
	}

	public resetFilters(): void {
		this.searchTerm = "";
		this.selectedEmployee = "";
		this.selectedType = "";
	}

	private async fetchAccruals(): Promise<void> {
		this.setLoading(true);
		this.clearError();

		try {
			const response = await accrualsApi.getAll();

			if (response.status === "success") {
				// API returns { data: [...] } directly
				const data = response.data;

				if (Array.isArray(data)) {
					// Map API response fields to our interface and enrich with employee/type names
					this.accruals = data.map((item: any) => {
						// Find employee name from employeeStore
						const employees = employeeStore.getApiEmployees();
						const employee = employees.find(
							(emp) => emp.employee_guid === item.employee_guid,
						);

						// Find type name from accrualTypesStore
						const types = accrualTypesStore.types;
						const type = types.find((t) => t.type_guid === item.type_guid);

						return {
							...item,
							accrual_guid: item.id || item.accrual_guid,
							post_guid: item.post_guid,
							employee_name: employee?.employee,
							type_name: type?.type_name,
							org_guid: item.org_guid,
							department_guid: item.department_guid,
							date: item.date,
							date_create: employee?.date_create,
							date_delete: employee?.date_delete,
						};
					});
				} else if (data && typeof data === "object" && "accruals" in data) {
					const accrualsList = (data as any).accruals || [];
					this.accruals = accrualsList.map((item: any) => {
						const employees = employeeStore.getApiEmployees();
						const employee = employees.find(
							(emp) => emp.employee_guid === item.employee_guid,
						);

						const types = accrualTypesStore.types;
						const type = types.find((t) => t.type_guid === item.type_guid);

						return {
							...item,
							accrual_guid: item.id || item.accrual_guid,
							post_guid: item.post_guid,
							employee_name: employee?.employee,
							type_name: type?.type_name,
							org_guid: item.org_guid,
							department_guid: item.department_guid,
							date: item.date,
							date_create: employee?.date_create,
							date_delete: employee?.date_delete,
						};
					});
				} else {
					this.accruals = [];
				}
			} else {
				console.error("[AccrualStore] API error:", response.message);
				this.setError(response.message || "Ошибка загрузки начислений");
			}
		} catch (err) {
			console.error("[AccrualStore] Exception:", err);
			this.setError(
				err instanceof Error ? err.message : "Ошибка загрузки начислений",
			);
		} finally {
			this.setLoading(false);
		}
	}

	async createAccrual(data: AccrualFormData): Promise<void> {
		// Валидация обязательных полей перед отправкой
		if (!data.type_guid || data.type_guid === "") {
			throw new Error("Тип начисления обязателен для заполнения");
		}
		if (!data.employee_guid || data.employee_guid === "") {
			throw new Error("Сотрудник обязателен для заполнения");
		}

		this.setLoading(true);
		this.clearError();

		try {
			const response = await accrualsApi.create({
				employee_guid: data.employee_guid,
				type_guid: data.type_guid,
				amount: data.amount,
				date: data.date,
				comment: data.comment,
				org_guid: data.org_guid,
				department_guid: data.department_guid,
				post_guid: data.post_guid,
				date_create: data.date_create,
				date_delete: data.date_delete,
			});

			if (response.status === "success") {
				// Refresh accruals list after creating
				await this.fetchAccruals();
			} else {
				console.error("[AccrualStore] Create failed:", response.message);
				this.setError(response.message || "Ошибка создания начисления");
				throw new Error(response.message || "Ошибка создания начисления");
			}
		} catch (err) {
			console.error("[AccrualStore] Create exception:", err);
			this.setError(
				err instanceof Error ? err.message : "Ошибка создания начисления",
			);
			throw err;
		} finally {
			this.setLoading(false);
		}
	}

	async updateAccrual(
		accrualGuid: string,
		data: AccrualFormData,
	): Promise<void> {
		// Валидация обязательных полей перед отправкой
		if (!data.type_guid || data.type_guid === "") {
			throw new Error("Тип начисления обязателен для заполнения");
		}
		if (!data.employee_guid || data.employee_guid === "") {
			throw new Error("Сотрудник обязателен для заполнения");
		}

		this.setLoading(true);
		this.clearError();

		try {
			const response = await accrualsApi.update({
				accrual_guid: accrualGuid,
				employee_guid: data.employee_guid,
				type_guid: data.type_guid,
				amount: data.amount,
				date: data.date,
				comment: data.comment,
				org_guid: data.org_guid,
				department_guid: data.department_guid,
				post_guid: data.post_guid,
				date_create: data.date_create,
				date_delete: data.date_delete,
			});

			if (response.status === "success") {
				// Refresh accruals list after updating
				await this.fetchAccruals();
			} else {
				this.setError(response.message || "Ошибка обновления начисления");
				throw new Error(response.message || "Ошибка обновления начисления");
			}
		} catch (err) {
			this.setError(
				err instanceof Error ? err.message : "Ошибка обновления начисления",
			);
			throw err;
		} finally {
			this.setLoading(false);
		}
	}

	async deleteAccrual(accrualGuid: string): Promise<void> {
		this.setLoading(true);
		this.clearError();

		try {
			const response = await accrualsApi.deleteAccrual(accrualGuid);

			if (response.status === "success") {
				// Refresh accruals list after deleting
				await this.fetchAccruals();
			} else {
				this.setError(response.message || "Ошибка удаления начисления");
				throw new Error(response.message || "Ошибка удаления начисления");
			}
		} catch (err) {
			this.setError(
				err instanceof Error ? err.message : "Ошибка удаления начисления",
			);
			throw err;
		} finally {
			this.setLoading(false);
		}
	}

	async initialize(): Promise<void> {
		// Prevent multiple initializations
		if (this.hasInitialized || this.isLoading) {
			return;
		}

		this.hasInitialized = true;

		// Ensure employees and types are loaded first
		const employees = employeeStore.getApiEmployees();
		const types = accrualTypesStore.types;

		// If stores are empty, fetch them first
		if (employees.length === 0 && !employeeStore.getIsLoading()) {
			await employeeStore.fetchEmployees();
		}

		if (types.length === 0 && !accrualTypesStore.getIsLoading()) {
			await accrualTypesStore.fetchTypes();
		}
		await this.fetchAccruals();
	}
}

export const accrualStore = new AccrualStore();
