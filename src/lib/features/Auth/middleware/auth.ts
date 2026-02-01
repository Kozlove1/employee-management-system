import { goto } from '$app/navigation'
import { authStore } from '../store/authStore.svelte'

const publicRoutes = ['/login']
const protectedRoutes = ['/accruals', '/employees', '/statistics', '/typesOfAccruals']

function isPublicRoute(pathname: string): boolean {
	return publicRoutes.some((route) => pathname.startsWith(route))
}

function isProtectedRoute(pathname: string): boolean {
	return pathname === '/' || protectedRoutes.some((route) => pathname.startsWith(route))
}

function requiresAuth(pathname: string): boolean {
	return isProtectedRoute(pathname) && !isPublicRoute(pathname)
}

export function handleAuthRedirect() {
	if (typeof window === 'undefined') return

	const pathname = window.location.pathname

	if (authStore.isAuthenticated && pathname === '/login') {
		goto('/accruals')
		return
	}

	if (!authStore.isAuthenticated && requiresAuth(pathname)) {
		goto('/login')
	}
}
