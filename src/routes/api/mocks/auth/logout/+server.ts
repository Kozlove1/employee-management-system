import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

export const POST: RequestHandler = async ({ cookies }) => {
	try {
		// Clear HttpOnly refresh token cookie
		cookies.delete('refresh_token', { path: '/' })

		return json({
			status: 'success',
			message: 'Logout successful'
		})

	} catch {
		return json({
			status: 'error',
			message: 'Logout failed'
		}, { status: 500 })
	}
}
