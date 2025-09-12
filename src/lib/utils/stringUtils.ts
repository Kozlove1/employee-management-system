/**
 * Gets initials from a full name
 */
export function getInitials(fullName: string): string {
	if (!fullName) return ''
	return fullName
		.split(' ')
		.map((name) => name[0])
		.join('')
		.substring(0, 2)
}

/**
 * Capitalizes the first letter of each word
 */
export function capitalizeWords(str: string): string {
	if (!str) return ''
	return str
		.split(' ')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
		.join(' ')
}

/**
 * Removes extra spaces from a string
 */
export function normalizeWhitespace(str: string): string {
	if (!str) return ''
	return str.replace(/\s+/g, ' ').trim()
}
