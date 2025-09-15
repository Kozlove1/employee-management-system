import type { AuthToken, AuthUser } from './types'

// Простая реализация для работы с токенами в localStorage
// В реальном проекте это может быть более сложная логика

const TOKEN_KEY = 'auth_token'
const USER_KEY = 'auth_user'

export class AuthService {
	private static instance: AuthService
	private currentUser: AuthUser | null = null
	private currentToken: AuthToken | null = null

	private constructor() {
		this.loadFromStorage()
	}

	static getInstance(): AuthService {
		if (!AuthService.instance) {
			AuthService.instance = new AuthService()
		}
		return AuthService.instance
	}

	// Загрузка данных из localStorage
	private loadFromStorage() {
		if (typeof window === 'undefined') return

		try {
			const tokenData = localStorage.getItem(TOKEN_KEY)
			const userData = localStorage.getItem(USER_KEY)

			if (tokenData) {
				this.currentToken = JSON.parse(tokenData)
			}

			if (userData) {
				this.currentUser = JSON.parse(userData)
			}
		} catch (error) {
			console.error('Error loading auth data from storage:', error)
			this.clearAuth()
		}
	}

	// Сохранение данных в localStorage
	private saveToStorage() {
		if (typeof window === 'undefined') return

		try {
			if (this.currentToken) {
				localStorage.setItem(TOKEN_KEY, JSON.stringify(this.currentToken))
			}

			if (this.currentUser) {
				localStorage.setItem(USER_KEY, JSON.stringify(this.currentUser))
			}
		} catch (error) {
			console.error('Error saving auth data to storage:', error)
		}
	}

	// Получение токена авторизации
	async getAuthToken(): Promise<string> {
		if (!this.currentToken?.accessToken) {
			return ''
		}

		// Проверяем, не истек ли токен
		if (this.currentToken.expiresAt && new Date() > this.currentToken.expiresAt) {
			// TODO: Реализовать обновление токена
			console.warn('Token expired, need to refresh')
			return ''
		}

		return `Bearer ${this.currentToken.accessToken}`
	}

	// Установка токена
	setToken(token: AuthToken) {
		this.currentToken = token
		this.saveToStorage()
	}

	// Установка пользователя
	setUser(user: AuthUser) {
		this.currentUser = user
		this.saveToStorage()
	}

	// Получение текущего пользователя
	getCurrentUser(): AuthUser | null {
		return this.currentUser
	}

	// Проверка авторизации
	isAuthenticated(): boolean {
		return !!this.currentToken?.accessToken && !!this.currentUser
	}

	// Выход из системы
	logout() {
		this.clearAuth()
	}

	// Очистка данных авторизации
	private clearAuth() {
		this.currentToken = null
		this.currentUser = null

		if (typeof window !== 'undefined') {
			localStorage.removeItem(TOKEN_KEY)
			localStorage.removeItem(USER_KEY)
		}
	}

	// Обновление токена
	async refreshToken(): Promise<boolean> {
		if (!this.currentToken?.refreshToken) {
			return false
		}

		try {
			// TODO: Реализовать запрос на обновление токена
			// const response = await apiClient.post('/auth/refresh', {
			//   refreshToken: this.currentToken.refreshToken
			// })
			
			// if (response.status === 'success') {
			//   this.setToken(response.data.token)
			//   return true
			// }

			return false
		} catch (error) {
			console.error('Error refreshing token:', error)
			this.clearAuth()
			return false
		}
	}
}

// Экспортируем singleton instance
export const authService = AuthService.getInstance()

// Функция для получения токена (используется в API клиенте)
export const getAuthToken = async (): Promise<string> => {
	return authService.getAuthToken()
}

// Функция для получения текущего пользователя
export const getAuthenticatedUser = async (): Promise<AuthUser | null> => {
	return authService.getCurrentUser()
}
