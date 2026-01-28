import { apiClient } from "$lib/api/client";
import { authApi } from "../api/authApi";
import type { LoginCredentials, User } from "../types";

class AuthStore {
	// Private reactive state - encapsulated
	private user = $state<User | null>(null);
	private isLoading = $state<boolean>(false);
	private isLoggingOut = $state<boolean>(false);
	private error = $state<string | null>(null);
	private accessToken = $state<string | null>(null); // In-memory only, never persisted
	private isCheckingAuth = false; // Prevent multiple simultaneous checks

	constructor() {
		// Register token provider with API client
		apiClient.setTokenProvider(() => this.accessToken);
		// Register refresh and logout handlers
		apiClient.setRefreshHandler(() => this.refreshToken());
		apiClient.setLogoutHandler(() => this.logout());

		// Restore auth state from localStorage immediately on initialization
		if (typeof window !== "undefined") {
			const storedUser = localStorage.getItem("user");
			const storedToken = localStorage.getItem("accessToken");

			if (storedUser && storedToken) {
				try {
					this.user = JSON.parse(storedUser);
					this.accessToken = storedToken;
				} catch {
					localStorage.removeItem("user");
					localStorage.removeItem("accessToken");
				}
			}
		}
	}

	// Public getters for accessing state
	getUser() {
		return this.user;
	}

	getIsLoading() {
		return this.isLoading;
	}

	getIsLoggingOut() {
		return this.isLoggingOut;
	}

	getError() {
		return this.error;
	}

	getAccessToken() {
		return this.accessToken;
	}

	// Computed values with $derived
	isAuthenticated = $derived(this.user !== null && this.accessToken !== null);

	setLoading(loading: boolean) {
		this.isLoading = loading;
	}

	setError(error: string | null) {
		this.error = error;
	}

	clearError() {
		this.error = null;
	}

	setUser(user: User | null) {
		this.user = user;
	}

	setAccessToken(token: string | null) {
		this.accessToken = token;
	}

	clearAuth() {
		this.user = null;
		this.accessToken = null;
		this.isCheckingAuth = false;
		this.isLoggingOut = false;
	}

	async login(credentials: LoginCredentials) {
		this.setLoading(true);
		this.clearError();

		try {
			const response = await authApi.login(credentials);
			if (response.status === "success") {
				// Сохраняем токен и данные пользователя из ответа логина
				this.setAccessToken(response.data.token);
				this.setUser(response.data.user);
				
				if (typeof window !== "undefined") {
					localStorage.setItem("accessToken", response.data.token);
					localStorage.setItem("user", JSON.stringify(response.data.user));
				}
			} else {
				// Use server error message
				this.setError(response.message || "Login failed");
			}
		} catch (err) {
			this.setError(err instanceof Error ? err.message : "Login failed");
		} finally {
			this.setLoading(false);
		}
	}

	async logout() {
		this.isLoggingOut = true;
		this.clearError();

		try {
			await authApi.logout();
		} catch (err) {
			console.error(
				"Logout API error:",
				err instanceof Error ? err.message : "Unknown error",
			);
		} finally {
			// Clear in-memory auth data
			this.clearAuth();

			if (typeof window !== "undefined") {
				localStorage.removeItem("user");
				localStorage.removeItem("accessToken");
			}

			this.isLoggingOut = false;
		}
	}

	async checkAuthStatus() {
		// Only run on client side
		if (typeof window === "undefined") return;

		// If we already have auth data in memory, no need to check
		if (this.user && this.accessToken) return;

		// If we're already loading, don't start another check
		if (this.isLoading) return;

		// If already checking auth, don't start another check
		if (this.isCheckingAuth) return;

		this.isCheckingAuth = true;

		const storedUser = localStorage.getItem("user");
		const storedToken = localStorage.getItem("accessToken");

		if (storedUser && storedToken) {
			try {
				this.setUser(JSON.parse(storedUser));
				this.setAccessToken(storedToken);
				this.isCheckingAuth = false;
				return;
			} catch {
				localStorage.removeItem("user");
				localStorage.removeItem("accessToken");
			}
		}

		this.isCheckingAuth = false;
		this.setLoading(false);
	}

	async refreshToken() {
		if (typeof window === "undefined") return false;

		try {
			const response = await authApi.refreshToken();

			if (response.status === "success") {
				this.setAccessToken(response.data.token);
				if (typeof window !== "undefined") {
					localStorage.setItem("accessToken", response.data.token);
				}
				return true;
			}
		} catch {
			// Refresh failed, clear auth
			this.clearAuth();
			if (typeof window !== "undefined") {
				localStorage.removeItem("user");
				localStorage.removeItem("accessToken");
			}
		}

		return false;
	}

	async initialize() {
		if (typeof window !== "undefined" && !this.isCheckingAuth) {
			await this.checkAuthStatus();
		}
	}
}

export const authStore = new AuthStore();
