import { mockCredentials, mockLoginResponse } from '$lib/features/Auth/mocks/authMockData'
import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

export const POST: RequestHandler = async ({ request, cookies }) => {
	try {
		const { email, password } = await request.json()

		if (email === mockCredentials.email && password === mockCredentials.password) {
			// Set HttpOnly cookie for refresh token
			cookies.set('refresh_token', mockLoginResponse.refreshToken, {
				path: '/',
				httpOnly: true,
				secure: import.meta.env.PROD, // Only secure in production
				sameSite: 'strict',
				maxAge: 60 * 60 * 24 * 7 // 7 days
			})

			// Return user data and access token (not refresh token)
			return json({
				data: {
					user: mockLoginResponse.user,
					token: mockLoginResponse.token
				},
				status: 'success',
				message: 'Login successful'
			})
		}

		if (email !== mockCredentials.email || password !== mockCredentials.password) {
			return json({
				status: 'error',
				message: 'Invalid email address or password'
			}, { status: 401 })
		}

		return json({
			status: 'error',
			message: 'Invalid credentials'
		}, { status: 401 })

	} catch {
		return json({
			status: 'error',
			message: 'Login failed'
		}, { status: 500 })
	}
}
