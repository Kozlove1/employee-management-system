import { goto } from '$app/navigation'
import { authStore } from '../store/authStore.svelte'

const publicRoutes = ['/login', '/register', '/forgot-password']

const protectedRoutes = ['/accruals', '/employees', '/statistics', '/typesOfAccruals']

export function isPublicRoute(pathname: string): boolean {
	return publicRoutes.some(route => pathname.startsWith(route))
}

export function isProtectedRoute(pathname: string): boolean {
	return protectedRoutes.some(route => pathname.startsWith(route)) || pathname === '/'
}

export function requiresAuth(pathname: string): boolean {
	return isProtectedRoute(pathname) && !isPublicRoute(pathname)
}

export function handleAuthRedirect() {
	if (typeof window === 'undefined') return
	
	const currentPath = window.location.pathname
	
	if (authStore.isAuthenticated && currentPath === '/login') {
		goto('/')
		return
	}
	
	if (!authStore.isAuthenticated && requiresAuth(currentPath)) {
		const redirectUrl = currentPath === '/' ? '' : `?redirect=${encodeURIComponent(currentPath)}`
		goto(`/login${redirectUrl}`)
		return
	}
}
