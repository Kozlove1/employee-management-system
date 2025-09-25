import { mockLoginResponse } from '$lib/features/Auth/mocks/authMockData'
import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

export const POST: RequestHandler = async ({ cookies }) => {
	try {
		// Check for refresh token in HttpOnly cookie
		const refreshToken = cookies.get('refresh_token')
		
		if (!refreshToken) {
			return json({
				status: 'error',
				message: 'No refresh token found'
			}, { status: 401 })
		}

		// In production, validate refresh token and generate new access token
		// For now, return new access token if refresh token is valid
		if (refreshToken === mockLoginResponse.refreshToken) {
			return json({
				data: {
					token: `new-access-token-${Date.now()}`
				},
				status: 'success',
				message: 'Token refreshed'
			})
		}

		// Invalid refresh token, clear cookie
		cookies.delete('refresh_token', { path: '/' })
		return json({
			status: 'error',
			message: 'Invalid refresh token'
		}, { status: 401 })

	} catch {
		return json({
			status: 'error',
			message: 'Token refresh failed'
		}, { status: 500 })
	}
}
