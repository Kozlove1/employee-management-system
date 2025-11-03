export interface User {
	id: string
	email: string
	name: string
	role: string
	org_guid: string
}

export interface LoginCredentials {
	email: string
	password: string
}

export interface AuthState {
	user: User | null
	isAuthenticated: boolean
	isLoading: boolean
	error: string | null
}

export interface LoginResponse {
	user: User
	token: string
	refresh_token: string
}
