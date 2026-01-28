import { apiClient } from "./client";
import type { ApiResponse, BaseFilterParams, PaginationParams } from "./types";

export class ApiService {
	protected baseEndpoint: string;

	constructor(baseEndpoint: string) {
		this.baseEndpoint = baseEndpoint;
	}

	protected async get<T>(
		endpoint: string = "",
		params?: PaginationParams & BaseFilterParams,
	): Promise<ApiResponse<T>> {
		const queryString = this.buildQueryString(params);
		const fullEndpoint = `${this.buildBasePath(endpoint)}${queryString ? `?${queryString}` : ""}`;

		return apiClient.get<T>(fullEndpoint);
	}

	private buildBasePath(endpoint: string): string {
		const cleanEndpoint = endpoint.replace(/^\/+/, "");
		const cleanBaseEndpoint = this.baseEndpoint.replace(/\/+$/, "");
		let basePath = cleanBaseEndpoint + (cleanEndpoint ? `/${cleanEndpoint}` : "");
		basePath = basePath.replace(/\/+/g, "/");
		return basePath;
	}

	private buildQueryString(params?: PaginationParams & BaseFilterParams): string {
		if (!params) {
			return "";
		}

		const queryParams = new URLSearchParams();
		type QueryParamValue = string | number | boolean | (string | number | boolean)[];
		const entries = Object.entries(params) as [string, QueryParamValue][];

		entries.forEach(([key, value]) => {
			if (value === undefined || value === null) {
				return;
			}

			if (typeof value === "boolean") {
				queryParams.append(key, value ? "true" : "false");
				return;
			}

			if (Array.isArray(value)) {
				value.forEach((item) => {
					if (item !== undefined && item !== null) {
						queryParams.append(key, String(item));
					}
				});
				return;
			}

			queryParams.append(key, String(value));
		});

		return queryParams.toString();
	}

	protected async post<T>(
		endpoint: string = "",
		data?: unknown,
	): Promise<ApiResponse<T>> {
		return apiClient.post<T>(`${this.baseEndpoint}${endpoint}`, data);
	}

	protected async put<T>(
		endpoint: string = "",
		data?: unknown,
	): Promise<ApiResponse<T>> {
		return apiClient.put<T>(`${this.baseEndpoint}${endpoint}`, data);
	}

	protected async delete<T>(endpoint: string = ""): Promise<ApiResponse<T>> {
		return apiClient.delete<T>(`${this.baseEndpoint}${endpoint}`);
	}

	protected async patch<T>(
		endpoint: string = "",
		data?: unknown,
	): Promise<ApiResponse<T>> {
		return apiClient.patch<T>(`${this.baseEndpoint}${endpoint}`, data);
	}
}
