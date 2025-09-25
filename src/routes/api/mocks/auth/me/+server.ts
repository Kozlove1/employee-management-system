import { mockLoginResponse } from '$lib/features/Auth/mocks/authMockData'
import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async ({ cookies }) => {
	try {
		// Check if we have a valid refresh token
		const refreshToken = cookies.get('refresh_token')
		
		if (!refreshToken) {
			return json({
				status: 'error',
				message: 'No refresh token found'
			}, { status: 401 })
		}

		// In production, validate refresh token with your auth service
		// For now, return mock data if refresh token exists
		if (refreshToken === mockLoginResponse.refreshToken) {
			return json({
				data: {
					user: mockLoginResponse.user,
					accessToken: mockLoginResponse.token
				},
				status: 'success',
				message: 'User data retrieved'
			})
		}

		// Invalid refresh token
		cookies.delete('refresh_token', { path: '/' })
		return json({
			status: 'error',
			message: 'Invalid refresh token'
		}, { status: 401 })

	} catch {
		return json({
			status: 'error',
			message: 'Failed to get user data'
		}, { status: 500 })
	}
}
