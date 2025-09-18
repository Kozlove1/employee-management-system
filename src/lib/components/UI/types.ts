// Типы для компонентов
export interface ComponentProps {
	[key: string]: any
}

// Типы для обработчиков событий
export type EventHandler<T = any> = (event: T) => void
export type FormSubmitHandler = (data: any) => void
export type ClickHandler = () => void
export type ChangeHandler<T = string> = (value: T) => void

// Типы для состояний загрузки
export interface LoadingState {
	isLoading: boolean
	error: string | null
}

// Типы для пагинации
export interface PaginationState {
	currentPage: number
	itemsPerPage: number
	totalItems: number
	totalPages: number
}

// Типы для поиска и фильтрации
export interface SearchParams {
	searchTerm?: string
	hasFixedAmount?: boolean
	sortOrder?: 'newest' | 'oldest' | 'name_asc' | 'name_desc'
}

// Типы для модальных окон
export interface ModalState {
	isOpen: boolean
	data?: any
}
