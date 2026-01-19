import type { AccrualType } from "$lib/types/shared";
import { accrualTypesApi } from "../api/accrualTypesApi";
import type { AccrualTypeFromApi, AccrualTypeSearchParams } from "../api/types";

class AccrualTypesStore {
	private accrualTypes = $state<AccrualType[]>([]);
	private isLoading = $state<boolean>(false);
	private error = $state<string | null>(null);
	private searchTerm = $state<string>("");
	private sortField = $state<string>("date_create");
	private sortOrder = $state<"asc" | "desc">("desc");
	private hasFixedAmount = $state("");
	private hasInitialized = $state<boolean>(false);
	private totalCount = $state<number>(0);
	private currentPage = $state<number>(1);
	private itemsPerPage = $state<number>(50);
	private totalPagesFromApi = $state<number>(1);

	types = $derived(this.accrualTypes);

	private _typeOptionsCache: Array<{ value: string; label: string }> | null = null;
	private _typeOptionsCacheKey: string = "";

	typeOptions = $derived.by(() => {
		const types = this.accrualTypes;
		const cacheKey = `${types.length}-${types.map(t => `${t.type_guid}-${t.type_name}`).join(',')}`;
		
		if (this._typeOptionsCache && this._typeOptionsCacheKey === cacheKey) {
			return this._typeOptionsCache;
		}

		this._typeOptionsCache = [
			{ value: '', label: 'Все типы' },
			...types.map((type) => ({
				value: type.type_guid,
				label: type.type_name
			}))
		];
		this._typeOptionsCacheKey = cacheKey;
		
		return this._typeOptionsCache;
	});

	getIsLoading(): boolean {
		return this.isLoading;
	}

	getError(): string | null {
		return this.error;
	}

	getSearchTerm(): string {
		return this.searchTerm;
	}

	getTotalCount(): number {
		return this.totalCount;
	}

	getCurrentPage(): number {
		return this.currentPage;
	}

	getItemsPerPage(): number {
		return this.itemsPerPage;
	}

	getSortOrder(): "asc" | "desc" {
		return this.sortOrder;
	}

	getHasFixedAmount(): string {
		return this.hasFixedAmount;
	}

	totalPages = $derived.by(() => {
		const pages = Math.ceil(this.totalCount / this.itemsPerPage);
		return this.totalPagesFromApi > 0 
			? this.totalPagesFromApi 
			: pages > 0 
				? pages 
				: this.accrualTypes.length > 0 
					? 1 
					: 0;
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
		this.currentPage = 1;
	}

	setSort(field: string, order: "asc" | "desc"): void {
		this.sortField = field;
		this.sortOrder = order;
		this.currentPage = 1;
	}

	setHasFixedAmount(value: string): void {
		this.hasFixedAmount = value;
		this.currentPage = 1;
	}

	setItemsPerPage(itemsPerPage: number): void {
		this.itemsPerPage = itemsPerPage;
		this.currentPage = 1;
		this.fetchTypes();
	}

	nextPage(): void {
		if (this.currentPage < this.totalPages) {
			this.currentPage++;
			this.fetchTypes();
		}
	}

	prevPage(): void {
		if (this.currentPage > 1) {
			this.currentPage--;
			this.fetchTypes();
		}
	}

	goToPage(page: number): void {
		if (page >= 1 && page <= this.totalPages) {
			this.currentPage = page;
			this.fetchTypes();
		}
	}

	private buildRequestParams(params?: AccrualTypeSearchParams): AccrualTypeSearchParams {
		const pageParam = params?.page ?? this.currentPage;
		const limitParam = pageParam === -1 ? undefined : params?.limit ?? this.itemsPerPage;

		const requestParams: AccrualTypeSearchParams = {
			...(params || {}),
			page: pageParam
		};

		if (limitParam !== undefined) {
			requestParams.limit = limitParam;
		}

		if (this.searchTerm) {
			requestParams.search = this.searchTerm;
		}

		if (this.hasFixedAmount === 'variable') {
			requestParams.ammo_coins_amount = 0;
		}

		if (this.sortField) {
			requestParams.sort = this.sortField;
		}

		if (this.sortOrder) {
			requestParams.order = this.sortOrder;
		}

		return requestParams;
	}

	async fetchTypes(params?: AccrualTypeSearchParams): Promise<void> {
		this.setLoading(true);
		this.clearError();

		try {
			const requestParams = this.buildRequestParams(params);
			const response = await accrualTypesApi.getAll(requestParams);

			if (response.status === "success") {
				const listResponse = response.data as unknown as {
					list: AccrualTypeFromApi[];
					page: number;
					total_page: number;
					total: number;
				};

				const typesList = listResponse.list || [];
				
				this.accrualTypes = typesList.map(
					(type: AccrualTypeFromApi): AccrualType => ({
						...type,
						type_guid: type.id,
					}),
				);
				
				this.totalCount = listResponse.total || 0;
				this.totalPagesFromApi = listResponse.total_page || 1;
				
				this._typeOptionsCache = null;
				this._typeOptionsCacheKey = "";
			} else {
				this.setError(response.message || "Ошибка загрузки типов начислений");
				this._typeOptionsCache = null;
				this._typeOptionsCacheKey = "";
			}
		} catch (err) {
			this.setError(
				err instanceof Error ? err.message : "Ошибка загрузки типов начислений",
			);
			this._typeOptionsCache = null;
			this._typeOptionsCacheKey = "";
		} finally {
			this.setLoading(false);
		}
	}

	refresh(): void {
		this.fetchTypes();
	}

	public getTypeById(typeGuid: string): AccrualType | null {
		return this.types.find((type) => type.type_guid === typeGuid) || null;
	}

	public getTypesWithFixedAmount(): AccrualType[] {
		return this.types.filter(
			(type) => type.ammo_coins_amount && type.ammo_coins_amount > 0,
		);
	}

	public getTypesWithVariableAmount(): AccrualType[] {
		return this.types.filter((type) => type.ammo_coins_amount === 0);
	}

	async initialize(): Promise<void> {
		if (this.hasInitialized || this.isLoading) {
			return;
		}
		
		this.hasInitialized = true;
		await this.fetchTypes();
	}
}

export const accrualTypesStore = new AccrualTypesStore();
