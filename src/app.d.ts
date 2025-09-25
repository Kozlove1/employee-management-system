import type { User } from '$lib/features/Auth/types'

declare global {
	namespace App {
		interface Locals {
			user: User | null
			accessToken: string | null
		}
	}
}

export { }

