import type { AccrualType } from "$lib/types/shared";
import type { AccrualTypeFromApi } from "../api/types";
import { accrualTypesApi } from "../api/accrualTypesApi";

class AccrualTypesStore {
	private accrualTypes = $state<AccrualType[]>([]);
	private isLoading = $state<boolean>(false);
	private error = $state<string | null>(null);

	types = $derived(this.accrualTypes);

	getIsLoading(): boolean {
		return this.isLoading;
	}

	getError(): string | null {
		return this.error;
	}

	setLoading(loading: boolean): void {
		this.isLoading = loading;
	}

	setError(error: string | null): void {
		this.error = error;
	}

	clearError(): void {
		this.error = null;
	}

	async fetchTypes(): Promise<void> {
		this.setLoading(true);
		this.clearError();

		try {
			const response = await accrualTypesApi.getAll();

			if (response.status === "success") {
				// API возвращает AccrualTypeFromApi[] (с полем id), маппим в AccrualType (с type_guid)
				this.accrualTypes = response.data.map((type: AccrualTypeFromApi): AccrualType => ({
					...type,
					type_guid: type.id,
				}));
			} else {
				this.setError(response.message || "Ошибка загрузки типов начислений");
			}
		} catch (err) {
			this.setError(
				err instanceof Error ? err.message : "Ошибка загрузки типов начислений",
			);
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
		if (this.accrualTypes.length === 0 && !this.isLoading) {
			await this.fetchTypes();
		}
	}
}

export const accrualTypesStore = new AccrualTypesStore();
