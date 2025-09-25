import type { Handle } from '@sveltejs/kit'
import { sequence } from '@sveltejs/kit/hooks'

const authHandle: Handle = async ({ event, resolve }) => {
	event.locals.user = null
	event.locals.accessToken = null

	const refreshToken = event.cookies.get('refresh_token')
	
	if (refreshToken) {
		try {
			const userResponse = await fetch(`${event.url.origin}/api/mocks/auth/me`, {
				headers: {
					'Cookie': `refresh_token=${refreshToken}`
				}
			})

			if (userResponse.ok) {
				const userData = await userResponse.json()
				event.locals.user = userData.user
				event.locals.accessToken = userData.accessToken
			}
		} catch {
			event.cookies.delete('refresh_token', { path: '/' })
		}
	}

	return resolve(event)
}

export const handle: Handle = sequence(authHandle)
