import type { LoginResponse, User } from '../types'

export const mockUser: User = {
	id: '1',
	email: 'admin@example.com',
	name: 'Administrator',
	role: 'admin',
	org_guid: 'org-123'
}

export const mockLoginResponse: LoginResponse = {
	user: mockUser,
	token: 'mock-jwt-token',
	refreshToken: 'mock-refresh-token'
}

export const mockCredentials = {
	email: 'admin@example.com',
	password: 'password123'
}
