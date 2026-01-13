import { getEnvConfig } from "$lib/utils/envUtils";
import type { ApiResponse } from "./types";

export interface RequestOptions {
	method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
	headers?: Record<string, string>;
	body?: any;
	timeout?: number;
	credentials?: RequestCredentials;
	skipAuth?: boolean;
}

export class ApiClient {
	private baseURL: string;
	private defaultHeaders: Record<string, string>;
	private debug: boolean;
	private getAccessToken: (() => string | null) | null = null;

	constructor(baseURL?: string) {
		const envConfig = getEnvConfig();
		this.baseURL = baseURL ?? envConfig.apiUrl;
		this.defaultHeaders = {
			Accept: "application/json",
		};
		this.debug = envConfig.debug;
	}

	setTokenProvider(provider: () => string | null) {
		this.getAccessToken = provider;
	}

	private shouldLog(): boolean {
		return this.debug && typeof console !== "undefined" && !!console.debug;
	}

	private logRequest(method: string, url: string, body: any) {
		if (this.shouldLog()) {
			console.debug("[ApiClient] Request:", { method, url, body });
		}
	}

	private logResponse(
		url: string,
		method: string,
		response: Response,
		payload: any,
	) {
		if (this.shouldLog()) {
			console.debug("[ApiClient] Response:", {
				url,
				method,
				status: response.status,
				statusText: response.statusText,
				payload,
			});
		}
	}

	private async request<T>(
		endpoint: string,
		options: RequestOptions = {},
	): Promise<ApiResponse<T>> {
		const {
			method = "GET",
			headers = {},
			body,
			timeout = 30000,
			credentials = "include",
			skipAuth = false,
		} = options;

		const url = `${this.baseURL}${endpoint}`;
		const requestHeaders = { ...this.defaultHeaders, ...headers };

		if (!skipAuth && this.getAccessToken) {
			const token = this.getAccessToken();
			if (token) {
				requestHeaders["Authorization"] = `Bearer ${token}`;
			}
		}

		if (!(body instanceof FormData)) {
			requestHeaders["Content-Type"] = "application/json";
		}

		this.logRequest(method, url, body);

		// Логируем что будет отправлено в JSON
		if (body && !(body instanceof FormData)) {
			console.log("[ApiClient] Body before JSON.stringify:", body);
			console.log(
				"[ApiClient] Body after JSON.stringify:",
				JSON.stringify(body),
			);
		}

		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), timeout);

		try {
			const response = await fetch(url, {
				method,
				headers: requestHeaders,
				body:
					body instanceof FormData
						? body
						: body
							? JSON.stringify(body)
							: undefined,
				signal: controller.signal,
				credentials,
			});

			clearTimeout(timeoutId);

			const serverResponse = await response.json().catch(() => null);

			console.log("[ApiClient] Raw server response:", {
				url,
				method,
				status: response.status,
				serverResponse: JSON.stringify(serverResponse, null, 2),
			});

			this.logResponse(url, method, response, serverResponse);

			if (!response.ok) {
				return {
					data: {} as T,
					status: (serverResponse?.status as "error") || "error",
					message:
						serverResponse?.message ||
						`HTTP ${response.status}: ${response.statusText}`,
				};
			}

			const serverStatus = serverResponse?.status || "success";
			const serverMessage = serverResponse?.message;

			return {
				data: serverResponse?.data || serverResponse || ({} as T),
				status: serverStatus === "success" ? "success" : "error",
				message: serverMessage,
			};
		} catch (error) {
			clearTimeout(timeoutId);

			if (error instanceof Error) {
				if (error.name === "AbortError") {
					return {
						data: {} as T,
						status: "error",
						message: "Request timeout",
					};
				}

				return {
					data: {} as T,
					status: "error",
					message: error.message,
				};
			}

			return {
				data: {} as T,
				status: "error",
				message: "Unknown error occurred",
			};
		}
	}

	async get<T>(
		endpoint: string,
		options?: Omit<RequestOptions, "method" | "body">,
	): Promise<ApiResponse<T>> {
		return this.request<T>(endpoint, { ...options, method: "GET" });
	}

	async post<T>(
		endpoint: string,
		body?: any,
		options?: Omit<RequestOptions, "method">,
	): Promise<ApiResponse<T>> {
		return this.request<T>(endpoint, { ...options, method: "POST", body });
	}

	async put<T>(
		endpoint: string,
		body?: any,
		options?: Omit<RequestOptions, "method">,
	): Promise<ApiResponse<T>> {
		return this.request<T>(endpoint, { ...options, method: "PUT", body });
	}

	async delete<T>(
		endpoint: string,
		options?: Omit<RequestOptions, "method" | "body">,
	): Promise<ApiResponse<T>> {
		return this.request<T>(endpoint, { ...options, method: "DELETE" });
	}

	async patch<T>(
		endpoint: string,
		body?: any,
		options?: Omit<RequestOptions, "method">,
	): Promise<ApiResponse<T>> {
		return this.request<T>(endpoint, { ...options, method: "PATCH", body });
	}

	async upload<T>(
		endpoint: string,
		formData: FormData,
		options?: Omit<RequestOptions, "method" | "body">,
	): Promise<ApiResponse<T>> {
		return this.request<T>(endpoint, {
			...options,
			method: "POST",
			body: formData,
		});
	}
}

export const apiClient = new ApiClient();
