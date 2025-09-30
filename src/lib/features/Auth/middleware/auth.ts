import { goto } from '$app/navigation'
import { authStore } from '../store/authStore.svelte'

// TODO: Implement proper route protection when needed
// const publicRoutes = ['/login', '/register', '/forgot-password']
// const protectedRoutes = ['/accruals', '/employees', '/statistics', '/typesOfAccruals']

// export function isPublicRoute(pathname: string): boolean {
// 	return publicRoutes.some(route => pathname.startsWith(route))
// }

// export function isProtectedRoute(pathname: string): boolean {
// 	return protectedRoutes.some(route => pathname.startsWith(route)) || pathname === '/'
// }

// export function requiresAuth(pathname: string): boolean {
// 	return isProtectedRoute(pathname) && !isPublicRoute(pathname)
// }

export function handleAuthRedirect() {
	if (typeof window === 'undefined') return
	
	// Simple redirect logic - only redirect from login if authenticated
	if (authStore.isAuthenticated && window.location.pathname === '/login') {
		goto('/accruals')
		return
	}
	
	// TODO: Add protected route checks when needed
	// if (!authStore.isAuthenticated && requiresAuth(currentPath)) {
	// 	const redirectUrl = currentPath === '/' ? '' : `?redirect=${encodeURIComponent(currentPath)}`
	// 	goto(`/login${redirectUrl}`)
	// 	return
	// }
}
