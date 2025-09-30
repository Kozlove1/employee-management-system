import { authApi } from '../api/authApi'
import type { LoginCredentials, User } from '../types'

class AuthStore {
	// Private reactive state - encapsulated
	private user = $state<User | null>(null)
	private isLoading = $state<boolean>(false)
	private isLoggingOut = $state<boolean>(false)
	private error = $state<string | null>(null)
	private accessToken = $state<string | null>(null) // In-memory only, never persisted
	private isCheckingAuth = false // Prevent multiple simultaneous checks

	// Public getters for accessing state
	getUser() {
		return this.user
	}

	getIsLoading() {
		return this.isLoading
	}

	getIsLoggingOut() {
		return this.isLoggingOut
	}

	getError() {
		return this.error
	}

	getAccessToken() {
		return this.accessToken
	}

	// Computed values with $derived
	isAuthenticated = $derived(this.user !== null && this.accessToken !== null)

	setLoading(loading: boolean) {
		this.isLoading = loading
	}

	setError(error: string | null) {
		this.error = error
	}

	clearError() {
		this.error = null
	}

	setUser(user: User | null) {
		this.user = user
	}

	setAccessToken(token: string | null) {
		this.accessToken = token
	}

	clearAuth() {
		this.user = null
		this.accessToken = null
		this.isCheckingAuth = false
		this.isLoggingOut = false
	}

	async login(credentials: LoginCredentials) {
		this.setLoading(true)
		this.clearError()

		try {
			const response = await authApi.login(credentials)
			
			if (response.status === 'success') {
				this.setUser(response.data.data.user)
				this.setAccessToken(response.data.data.token)
				
				if (typeof window !== 'undefined') {
					localStorage.setItem('user', JSON.stringify(response.data.data.user))
					localStorage.setItem('accessToken', response.data.data.token)
				}
			} else {
				// Use server error message
				this.setError(response.message || 'Login failed')
			}
		} catch (err) {
			this.setError(err instanceof Error ? err.message : 'Login failed')
		} finally {
			this.setLoading(false)
		}
	}

	async logout() {
		this.isLoggingOut = true
		this.clearError()

		try {
			await authApi.logout()
		} catch (err) {
			console.error('Logout API error:', err instanceof Error ? err.message : 'Unknown error')
		} finally {
			// Clear in-memory auth data
			this.clearAuth()
			
			if (typeof window !== 'undefined') {
				localStorage.removeItem('user')
				localStorage.removeItem('accessToken')
			}
			
			this.isLoggingOut = false
		}
	}

	async checkAuthStatus() {
		// Only run on client side
		if (typeof window === 'undefined') return

		// If we already have auth data in memory, no need to check
		if (this.user && this.accessToken) return

		// If we're already loading, don't start another check
		if (this.isLoading) return

		// If already checking auth, don't start another check
		if (this.isCheckingAuth) return

		const storedUser = localStorage.getItem('user')
		const storedToken = localStorage.getItem('accessToken')
		
		if (storedUser && storedToken) {
			try {
				this.setUser(JSON.parse(storedUser))
				this.setAccessToken(storedToken)
				return
			} catch {
				localStorage.removeItem('user')
				localStorage.removeItem('accessToken')
			}
		}

		this.setLoading(false)
	}

	async refreshToken() {
		if (typeof window === 'undefined') return false

		try {
			const response = await authApi.refreshToken()
			
			if (response.status === 'success') {
				this.setAccessToken(response.data.token)
				return true
			}
		} catch {
			// Refresh failed, clear auth
			this.clearAuth()
		}
		
		return false
	}

	async initialize() {
		if (typeof window !== 'undefined' && !this.isCheckingAuth) {
			await this.checkAuthStatus()
		}
	}
}

export const authStore = new AuthStore()
