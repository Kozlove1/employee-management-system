/**
 * Утилиты для работы с переменными окружения
 * Согласно документации Vite: https://vite.dev/guide/env-and-mode.html
 */

export interface EnvConfig {
  appName: string
  appVersion: string
  apiUrl: string
  apiTimeout: number
  debug: boolean
  logLevel: 'debug' | 'info' | 'warn' | 'error'
}

function getEnvVar(key: keyof ImportMetaEnv, defaultValue?: string): string {
  const value = import.meta.env[key]
  if (value === undefined) {
    if (defaultValue !== undefined) {
      return defaultValue
    }
    throw new Error(`Environment variable ${key} is not defined`)
  }
  return value
}

function getBooleanEnvVar(key: keyof ImportMetaEnv, defaultValue: boolean = false): boolean {
  const value = getEnvVar(key, defaultValue.toString())
  return value.toLowerCase() === 'true'
}

function getNumberEnvVar(key: keyof ImportMetaEnv, defaultValue: number): number {
  const value = getEnvVar(key, defaultValue.toString())
  const parsed = parseInt(value, 10)
  if (isNaN(parsed)) {
    console.warn(`Invalid number for ${key}: ${value}, using default: ${defaultValue}`)
    return defaultValue
  }
  return parsed
}

export function getEnvConfig(): EnvConfig {
  return {
    appName: getEnvVar('VITE_APP_NAME', 'Accrual Management System'),
    appVersion: getEnvVar('VITE_APP_VERSION', '1.0.0'),
    apiUrl: getEnvVar('VITE_API_URL', '/api'),
    apiTimeout: getNumberEnvVar('VITE_API_TIMEOUT', 10000),
    debug: getBooleanEnvVar('VITE_DEBUG', false),
    logLevel: getEnvVar('VITE_LOG_LEVEL', 'info') as EnvConfig['logLevel'],
  }
}

export function validateEnvConfig(): void {
  const requiredVars: (keyof ImportMetaEnv)[] = [
    'VITE_APP_NAME',
    'VITE_API_URL',
  ]

  const missing: string[] = []
  
  for (const varName of requiredVars) {
    if (!import.meta.env[varName]) {
      missing.push(varName as string)
    }
  }

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }
}

export function logEnvInfo(): void {
  const config = getEnvConfig()
  
  if (config.debug) {
    console.log('Environment Configuration:', {
      mode: import.meta.env.MODE,
      dev: import.meta.env.DEV,
      prod: import.meta.env.PROD,
      baseUrl: import.meta.env.BASE_URL,
      config,
    })
  }
}
