import { init, type ErrorHandler } from './client'

// Инициализация API клиента
export function initializeApi() {
	// Получаем URL из переменных окружения или используем значения по умолчанию
	const apiUrl = import.meta.env.VITE_API_URL || '/api'
	const threadsUrl = import.meta.env.VITE_THREADS_URL || '/threads'

	// Глобальный обработчик ошибок
	const globalErrorHandler: ErrorHandler = (error) => {
		console.error('Global API Error:', error)
		
		// Здесь можно добавить логику для:
		// - Отправки ошибок в систему мониторинга
		// - Показа уведомлений пользователю
		// - Логирования в файл
		// - Перенаправления на страницу ошибки
	}

	// Инициализируем API клиент
	const axiosInstance = init({
		urls: {
			API: apiUrl,
			THREADS: threadsUrl,
		},
		axiosConfig: {
			timeout: 10000,
			headers: {
				'Content-Type': 'application/json',
			},
		},
		errorHandler: globalErrorHandler,
		// fetchTokenOverride: () => {
		//   // Если нужно переопределить логику получения токена
		//   return 'your-custom-token'
		// },
	})

	return axiosInstance
}

// Автоматическая инициализация при импорте модуля
export const apiInstance = initializeApi()
