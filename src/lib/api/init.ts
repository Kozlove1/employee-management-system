import { getEnvConfig, logEnvInfo, validateEnvConfig } from '$lib/utils/envUtils'
import { init, type ErrorHandler } from './client'

export function initializeApi() {

	validateEnvConfig()
	
	const envConfig = getEnvConfig()
	
	logEnvInfo()

	const globalErrorHandler: ErrorHandler = (error) => {
		console.error('Global API Error:', error)
		
		// Здесь можно добавить логику для:
		// - Отправки ошибок в систему мониторинга
		// - Показа уведомлений пользователю
		// - Логирования в файл
		// - Перенаправления на страницу ошибки
	}

	const axiosInstance = init({
		urls: {
			API: envConfig.apiUrl,
		},
		axiosConfig: {
			timeout: envConfig.apiTimeout,
			headers: {
				'Content-Type': 'application/json',
			},
		},
		errorHandler: globalErrorHandler,
	})

	return axiosInstance
}

// Автоматическая инициализация при импорте модуля
export const apiInstance = initializeApi()
