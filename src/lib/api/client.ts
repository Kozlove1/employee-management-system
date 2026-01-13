import { getEnvConfig } from "$lib/utils/envUtils";
import type { ApiEnvelope, ApiResponse } from "./types";

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
	private isRefreshing = false;
	private refreshPromise: Promise<boolean> | null = null;
	private onRefreshToken: (() => Promise<boolean>) | null = null;
	private onLogout: (() => void) | null = null;

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

	setRefreshHandler(handler: () => Promise<boolean>) {
		this.onRefreshToken = handler;
	}

	setLogoutHandler(handler: () => void) {
		this.onLogout = handler;
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

	private buildHeaders(
		headers: Record<string, string>,
		body: any,
		skipAuth: boolean,
	): Record<string, string> {
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

		return requestHeaders;
	}

	private createAbortController(timeout: number): {
		controller: AbortController;
		timeoutId: ReturnType<typeof setTimeout>;
	} {
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), timeout);
		return { controller, timeoutId };
	}

	private async parseResponse(response: Response): Promise<any> {
		const contentType = response.headers.get("content-type");
		const isJson =
			contentType?.includes("application/json") ||
			contentType?.includes("text/json");

		if (!isJson || response.status === 204) {
			return null;
		}

		try {
			const text = await response.text();
			return text ? JSON.parse(text) : null;
		} catch {
			return null;
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
		this.logRequest(method, url, body);

		// Create abort controller for initial request
		const { controller, timeoutId } = this.createAbortController(timeout);

		try {
			const requestHeaders = this.buildHeaders(headers, body, skipAuth);

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

			const serverResponse = await this.parseResponse(response);

			if (this.shouldLog()) {
				console.debug("[ApiClient] Raw server response:", {
					url,
					method,
					status: response.status,
					serverResponse: serverResponse
						? JSON.stringify(serverResponse, null, 2)
						: "empty",
				});
			}

			this.logResponse(url, method, response, serverResponse);

			// Handle 401 Unauthorized - try to refresh token
			if (response.status === 401 && !skipAuth && this.getAccessToken) {
				// Try to refresh token and retry the request
				const refreshed = await this.handleTokenRefresh();
				if (refreshed) {
					// Retry the request with new token
					const newToken = this.getAccessToken();
					if (newToken) {
						// Create new abort controller for retry
						const {
							controller: retryController,
							timeoutId: retryTimeoutId,
						} = this.createAbortController(timeout);

						// Rebuild headers for retry (important for Content-Type)
						const retryHeaders = this.buildHeaders(headers, body, skipAuth);
						retryHeaders["Authorization"] = `Bearer ${newToken}`;

						try {
							const retryResponse = await fetch(url, {
								method,
								headers: retryHeaders,
								body:
									body instanceof FormData
										? body
										: body
											? JSON.stringify(body)
											: undefined,
								signal: retryController.signal,
								credentials,
							});

							clearTimeout(retryTimeoutId);
							const retryServerResponse = await this.parseResponse(retryResponse);
							this.logResponse(url, method, retryResponse, retryServerResponse);

							// If retry also returns 401, logout user
							if (retryResponse.status === 401) {
								this.onLogout?.();
								return {
									data: {} as T,
									status: "error",
									message: "Session expired. Please login again.",
								};
							}

							if (!retryResponse.ok) {
								return {
									data: {} as T,
									status: (retryServerResponse?.status as "error") || "error",
									message:
										retryServerResponse?.message ||
										`HTTP ${retryResponse.status}: ${retryResponse.statusText}`,
								};
							}

							const retryServerStatus =
								retryServerResponse?.status || "success";
							const retryServerMessage = retryServerResponse?.message;

							return {
								data:
									retryServerResponse?.data ||
									retryServerResponse ||
									({} as T),
								status:
									retryServerStatus === "success" ? "success" : "error",
								message: retryServerMessage,
							};
						} catch (retryError) {
							clearTimeout(retryTimeoutId);
							if (retryError instanceof Error && retryError.name === "AbortError") {
								return {
									data: {} as T,
									status: "error",
									message: "Request timeout",
								};
							}
							throw retryError;
						}
					}
				}
				// If refresh failed, logout and return 401 error
				this.onLogout?.();
				return {
					data: {} as T,
					status: "error",
					message: serverResponse?.message || "Unauthorized",
				};
			}

			if (!response.ok) {
				return {
					data: {} as T,
					status: (serverResponse?.status as "error") || "error",
					message:
						serverResponse?.message ||
						`HTTP ${response.status}: ${response.statusText}`,
				};
			}

			// Strict envelope parsing - ожидаем строгую структуру ApiEnvelope
			if (
				serverResponse &&
				typeof serverResponse === "object" &&
				"status" in serverResponse &&
				"data" in serverResponse
			) {
				const envelope = serverResponse as ApiEnvelope<T>;
				return {
					data: envelope.data,
					status: envelope.status,
					message: envelope.message,
				};
			}

			// Fallback для нестандартных ответов (legacy support)
			const serverStatus = serverResponse?.status || "success";
			const serverMessage = serverResponse?.message;
			const responseData =
				serverResponse && typeof serverResponse === "object" && "data" in serverResponse
					? serverResponse.data
					: serverResponse || ({} as T);

			return {
				data: responseData as T,
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

	private async handleTokenRefresh(): Promise<boolean> {
		// Prevent multiple simultaneous refresh attempts
		if (this.isRefreshing && this.refreshPromise) {
			return this.refreshPromise;
		}

		if (!this.onRefreshToken) {
			console.warn("[ApiClient] No refresh handler set");
			return false;
		}

		this.isRefreshing = true;
		this.refreshPromise = this.onRefreshToken();

		try {
			const result = await this.refreshPromise;
			return result;
		} finally {
			this.isRefreshing = false;
			this.refreshPromise = null;
		}
	}
}

export const apiClient = new ApiClient();
