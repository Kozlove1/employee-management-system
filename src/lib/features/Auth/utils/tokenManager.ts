import { authStore } from '../store/authStore.svelte'

export class TokenManager {
	private static instance: TokenManager
	private refreshPromise: Promise<boolean> | null = null

	static getInstance(): TokenManager {
		if (!TokenManager.instance) {
			TokenManager.instance = new TokenManager()
		}
		return TokenManager.instance
	}

	/**
	 * Get current access token
	 */
	getAccessToken(): string | null {
		return authStore.getAccessToken()
	}

	/**
	 * Check if user is authenticated
	 */
	isAuthenticated(): boolean {
		return authStore.isAuthenticated
	}

	/**
	 * Refresh access token using refresh token (HttpOnly cookie)
	 */
	async refreshAccessToken(): Promise<boolean> {
		// Prevent multiple simultaneous refresh attempts
		if (this.refreshPromise) {
			return this.refreshPromise
		}

		this.refreshPromise = this.performRefresh()
		
		try {
			const result = await this.refreshPromise
			return result
		} finally {
			this.refreshPromise = null
		}
	}

	private async performRefresh(): Promise<boolean> {
		try {
			const success = await authStore.refreshToken()
			return success
		} catch (error) {
			console.error('Token refresh failed:', error)
			return false
		}
	}

	/**
	 * Make authenticated request with automatic token refresh
	 */
	async makeAuthenticatedRequest<T>(
		requestFn: (token: string) => Promise<T>
	): Promise<T> {
		const token = this.getAccessToken()
		
		if (!token) {
			throw new Error('No access token available')
		}

		try {
			return await requestFn(token)
		} catch (error: any) {
			// If request failed with 401, try to refresh token
			if (error.status === 401 || error.message?.includes('401')) {
				const refreshed = await this.refreshAccessToken()
				
				if (refreshed) {
					const newToken = this.getAccessToken()
					if (newToken) {
						return await requestFn(newToken)
					}
				}
			}
			
			throw error
		}
	}

	/**
	 * Clear all authentication data
	 */
	clearAuth(): void {
		authStore.clearAuth()
	}
}

export const tokenManager = TokenManager.getInstance()
