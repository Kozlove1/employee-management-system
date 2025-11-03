# API Endpoints Specification

## Общие требования

- **Base URL**: определяется через переменную окружения `API_URL`
- **Content-Type**: `application/json`
- **Accept**: `application/json`
- **Аутентификация**: Bearer Token в заголовке `Authorization: Bearer {token}`
- **Формат ответа**: все ответы обернуты в `ApiResponse<T>`

### Нотация параметров пути

В эндпоинтах используется нотация с двоеточием (`:`) для обозначения параметров пути (path parameters):

- `:employee_guid` - параметр пути, который заменяется на реальный GUID при запросе
- Пример: `/employees/:employee_guid` → `/employees/123-456-789-abc-def`
- Пример: `/employees/department/:department_guid` → `/employees/department/abc-123-def-456`

### Формат ответа API

```typescript
interface ApiResponse<T> {
	data: T
	message?: string
	status: 'success' | 'error'
}
```

### Общие параметры пагинации

```typescript
interface PaginationParams {
	page?: number // Номер страницы (начиная с 1)
	limit?: number // Количество элементов на странице
	sort?: string // Поле для сортировки
	order?: 'asc' | 'desc' // Направление сортировки
}
```

### Общие параметры фильтрации

```typescript
interface BaseFilterParams {
	search?: string // Поисковый запрос
	date_from?: string // Дата начала периода (ISO 8601)
	date_to?: string // Дата окончания периода (ISO 8601)
	active_only?: boolean // Только активные записи
}
```

---

## Аутентификация (Auth)

### POST `/auth/login`

Авторизация пользователя.

**Request Body:**

```typescript
{
	email: string
	password: string
}
```

**Response:**

```typescript
{
  data: {
    user: {
      id: string
      email: string
      name: string
      role: string
      org_guid: string
    }
    token: string
    refresh_token: string
  }
  status: 'success' | 'error'
  message?: string
}
```

---

### POST `/auth/logout`

Выход из системы.

**Response:**

```typescript
{
  data: undefined
  status: 'success' | 'error'
  message?: string
}
```

---

### POST `/auth/refresh`

Обновление access token через refresh token.

**Note**: Refresh token передается через HttpOnly cookie.

**Response:**

```typescript
{
  data: {
    token: string
  }
  status: 'success' | 'error'
  message?: string
}
```

---

### GET `/auth/me`

Получение информации о текущем пользователе.

**Response:**

```typescript
{
  data: {
    user: {
      id: string
      email: string
      name: string
      role: string
      org_guid: string
    }
    access_token: string
  }
  status: 'success' | 'error'
  message?: string
}
```

---

## Сотрудники (Employees)

### GET `/employees`

Получение списка всех сотрудников с пагинацией и фильтрацией.

**Query Parameters:**

```typescript
{
  // PaginationParams
  page?: number
  limit?: number
  sort?: string
  order?: 'asc' | 'desc'

  // BaseFilterParams
  search?: string
  date_from?: string
  date_to?: string
  active_only?: boolean

  // EmployeeFilterParams
  department_guid?: string
  position_guid?: string
  sex?: 'Мужской' | 'Женский'
}
```

**Response:**

```typescript
{
  data: {
    employees: Array<{
      org_guid: string
      employee_guid: string
      employee_name?: string
      department_guid: string
      department_name?: string
      post_guid: string
      post?: string
      position_name?: string
      ident: string
      employee: string
      email: string
      sex: string
      person_guid: string
      date_create?: string
      date_disband?: string
      date_employ?: string
      date_dismis?: string
      balance?: number
    }>
  }
  status: 'success' | 'error'
  message?: string
}
```

---

### GET `/employees/search`

Поиск сотрудников с фильтрацией.

**Query Parameters:** (те же, что и для GET `/employees`)

**Response:** (тот же формат, что и для GET `/employees`)

---

### GET `/employees/:employee_guid`

Получение информации о конкретном сотруднике.

**Response:**

```typescript
{
  data: {
    employee: {
      org_guid: string
      employee_guid: string
      employee_name?: string
      department_guid: string
      department_name?: string
      post_guid: string
      post?: string
      position_name?: string
      ident: string
      employee: string
      email: string
      sex: string
      person_guid: string
      date_create?: string
      date_disband?: string
      date_employ?: string
      date_dismis?: string
      balance?: number
    }
  }
  status: 'success' | 'error'
  message?: string
}
```

---

### GET `/employees/department/:department_guid`

Получение списка сотрудников по отделу.

**Query Parameters:**

```typescript
{
  page?: number
  limit?: number
  sort?: string
  order?: 'asc' | 'desc'
}
```

**Response:** (тот же формат, что и для GET `/employees`)

---

### POST `/employees`

Создание нового сотрудника.

**Request Body:**

```typescript
{
	employee: string // Имя сотрудника
	ident: string // Идентификатор
	email: string // Email
	sex: 'Мужской' | 'Женский'
	department_guid: string
	position_name: string
	date_employ: string // Дата трудоустройства (ISO 8601)
}
```

**Response:**

```typescript
{
  data: {
    employee: {
      org_guid: string
      employee_guid: string
      employee_name?: string
      department_guid: string
      department_name?: string
      post_guid: string
      post?: string
      position_name?: string
      ident: string
      employee: string
      email: string
      sex: string
      person_guid: string
      date_create?: string
      date_disband?: string
      date_employ?: string
      date_dismis?: string
      balance?: number
    }
  }
  status: 'success' | 'error'
  message?: string
}
```

---

### PUT `/employees/:employee_guid`

Обновление информации о сотруднике.

**Request Body:**

```typescript
{
  employee_guid: string
  employee?: string
  ident?: string
  email?: string
  sex?: 'Мужской' | 'Женский'
  department_guid?: string
  position_name?: string
  date_employ?: string
}
```

**Response:** (тот же формат, что и для POST `/employees`)

---

### DELETE `/employees/:employee_guid`

Удаление сотрудника.

**Response:**

```typescript
{
  data: {}
  status: 'success' | 'error'
  message?: string
}
```

---

### GET `/employees/stats`

Получение статистики по сотрудникам.

**Response:**

```typescript
{
  data: {
    stats: Array<{
      employee_guid: string
      employee_name: string
      ident: string
      total_balance: number
      department_name: string
    }>
  }
  status: 'success' | 'error'
  message?: string
}
```

---

## Начисления (Accruals)

### GET `/accruals`

Получение списка всех начислений с пагинацией и фильтрацией.

**Query Parameters:**

```typescript
{
  // PaginationParams
  page?: number
  limit?: number
  sort?: string
  order?: 'asc' | 'desc'

  // BaseFilterParams
  search?: string
  date_from?: string
  date_to?: string
  active_only?: boolean

  // AccrualFilterParams
  employee_guid?: string
  type_guid?: string
  department_guid?: string
  amount_min?: number
  amount_max?: number
}
```

**Response:**

```typescript
{
  data: {
    accruals: Array<{
      accrual_guid: string
      employee_guid: string
      employee_name?: string
      type_guid: string
      type_name?: string
      amount: number
      date: string
      comment?: string
      org_guid: string
      post_guid: string
      post?: string
      department_guid: string
      department_name?: string
      date_create?: string
      date_disband?: string
    }>
  }
  status: 'success' | 'error'
  message?: string
}
```

---

### GET `/accruals/:accrual_guid`

Получение информации о конкретном начислении.

**Response:**

```typescript
{
  data: {
    accrual: {
      accrual_guid: string
      employee_guid: string
      employee_name?: string
      type_guid: string
      type_name?: string
      amount: number
      date: string
      comment?: string
      org_guid: string
      post_guid: string
      post?: string
      department_guid: string
      department_name?: string
      date_create?: string
      date_disband?: string
    }
  }
  status: 'success' | 'error'
  message?: string
}
```

---

### GET `/accruals/employee/:employee_guid`

Получение списка начислений по сотруднику.

**Query Parameters:**

```typescript
{
  page?: number
  limit?: number
  sort?: string
  order?: 'asc' | 'desc'
}
```

**Response:** (тот же формат, что и для GET `/accruals`)

---

### POST `/accruals`

Создание нового начисления.

**Request Body:**

```typescript
{
  employee_guid: string
  type_guid: string
  amount: number
  date: string              // ISO 8601
  comment?: string
}
```

**Response:**

```typescript
{
  data: {
    accrual: {
      accrual_guid: string
      employee_guid: string
      type_guid: string
      amount: number
      date: string
      comment?: string
      org_guid: string
      date_create?: string
    }
  }
  status: 'success' | 'error'
  message?: string
}
```

---

### PUT `/accruals/:accrual_guid`

Обновление начисления.

**Request Body:**

```typescript
{
  accrual_guid: string
  employee_guid?: string
  type_guid?: string
  amount?: number
  date?: string
  comment?: string
}
```

**Response:**

```typescript
{
  data: {
    accrual: {
      accrual_guid: string
      employee_guid: string
      employee_name?: string
      type_guid: string
      type_name?: string
      amount: number
      date: string
      comment?: string
      org_guid: string
      post_guid: string
      post?: string
      department_guid: string
      department_name?: string
      date_create?: string
      date_disband?: string
    }
  }
  status: 'success' | 'error'
  message?: string
}
```

---

### DELETE `/accruals/:accrual_guid`

Удаление начисления.

**Response:**

```typescript
{
  data: {}
  status: 'success' | 'error'
  message?: string
}
```

---

### GET `/accruals/stats`

Получение статистики по начислениям.

**Response:**

```typescript
{
  data: {
    stats: {
      total_accruals: number
      total_amount: number
      average_amount: number
      monthly_accruals: number
      top_types: Array<{
        type_guid: string
        type_name: string
        count: number
        total_amount: number
      }>
    }
  }
  status: 'success' | 'error'
  message?: string
}
```

---

## Типы начислений (Accrual Types)

### GET `/accrual-types`

Получение списка всех типов начислений с пагинацией и фильтрацией.

**Query Parameters:**

```typescript
{
  // PaginationParams
  page?: number
  limit?: number
  sort?: string
  order?: 'asc' | 'desc'

  // BaseFilterParams
  search?: string
  date_from?: string
  date_to?: string
  active_only?: boolean

  // AccrualTypeFilterParams
  has_fixed_amount?: boolean
  ammo_coins_min?: number
  ammo_coins_max?: number
}
```

**Response:**

```typescript
{
  data: {
    accrualTypes: Array<{
      org_guid?: string
      type_guid: string
      type_name: string
      ammo_coins_amount?: number
    }>
  }
  status: 'success' | 'error'
  message?: string
}
```

---

### GET `/accrual-types/:type_guid`

Получение информации о конкретном типе начисления.

**Response:**

```typescript
{
  data: {
    accrualType: {
      org_guid?: string
      type_guid: string
      type_name: string
      ammo_coins_amount?: number
    }
  }
  status: 'success' | 'error'
  message?: string
}
```

---

### POST `/accrual-types`

Создание нового типа начисления.

**Request Body:**

```typescript
{
  type_name: string
  ammo_coins_amount?: number
}
```

**Response:**

```typescript
{
  data: {
    accrualType: {
      org_guid?: string
      type_guid: string
      type_name: string
      ammo_coins_amount?: number
    }
  }
  status: 'success' | 'error'
  message?: string
}
```

---

### PUT `/accrual-types/:type_guid`

Обновление типа начисления.

**Request Body:**

```typescript
{
  type_guid: string
  type_name?: string
  ammo_coins_amount?: number
}
```

**Response:** (тот же формат, что и для POST `/accrual-types`)

---

### DELETE `/accrual-types/:type_guid`

Удаление типа начисления.

**Response:**

```typescript
{
  data: {}
  status: 'success' | 'error'
  message?: string
}
```

---

### GET `/accrual-types/stats`

Получение статистики по типам начислений.

**Response:**

```typescript
{
  data: {
    stats: {
      total_types: number
      types_with_fixed_amount: number
      types_with_variable_amount: number
      most_used_types: Array<{
        type_guid: string
        type_name: string
        usage_count: number
        total_amount: number
      }>
    }
  }
  status: 'success' | 'error'
  message?: string
}
```

---

## Статистика (Statistics)

### GET `/statistics`

Получение общей статистики.

**Query Parameters:**

```typescript
{
  // BaseFilterParams
  search?: string
  date_from?: string
  date_to?: string
  active_only?: boolean

  // StatisticsFilterParams
  department_guid?: string
  date_period?: 'week' | 'month' | 'quarter' | 'year'
}
```

**Response:**

```typescript
{
  data: {
    summary: {
      total_employees: number
      total_balance: number
      average_balance: number
    }
  }
  status: 'success' | 'error'
  message?: string
}
```

---

### GET `/statistics/employees`

Получение статистики по сотрудникам.

**Query Parameters:** (те же, что и для GET `/statistics`)

**Response:**

```typescript
{
  data: {
    employee_stats: Array<{
      employee_guid: string
      employee_name: string
      ident: string
      total_balance: number
      department_name: string
    }>
  }
  status: 'success' | 'error'
  message?: string
}
```

---

### GET `/statistics/accruals`

Получение статистики по типам начислений.

**Query Parameters:** (те же, что и для GET `/statistics`)

**Response:**

```typescript
{
  data: {
    accrual_type_stats: Array<{
      type_guid: string
      type_name: string
      category: string
      total_count: number
      unique_employees: number
      total_amount: number
      average_amount: number
      has_fixed_amount: boolean
    }>
  }
  status: 'success' | 'error'
  message?: string
}
```

---

### GET `/statistics/departments`

Получение статистики по отделам.

**Query Parameters:** (те же, что и для GET `/statistics`)

**Response:**

```typescript
{
  data: {
    department_stats: Array<{
      department_guid: string
      department_name: string
      total_employees: number
      total_accruals: number
      average_balance: number
    }>
  }
  status: 'success' | 'error'
  message?: string
}
```

---

### GET `/statistics/combined`

Получение комбинированной статистики.

**Query Parameters:** (те же, что и для GET `/statistics`)

**Response:**

```typescript
{
  data: {
    summary: {
      total_employees: number
      total_balance: number
      average_balance: number
    }
    top_employees: Array<{
      employee_guid: string
      employee_name: string
      ident: string
      total_balance: number
      department_name: string
    }>
    top_accrual_types: Array<{
      type_guid: string
      type_name: string
      category: string
      total_count: number
      unique_employees: number
      total_amount: number
      average_amount: number
      has_fixed_amount: boolean
    }>
    department_stats: Array<{
      department_guid: string
      department_name: string
      total_employees: number
      total_accruals: number
      average_balance: number
    }>
  }
  status: 'success' | 'error'
  message?: string
}
```

---

## Отделы (Departments)

### GET `/departments`

Получение списка всех отделов с пагинацией и фильтрацией.

**Query Parameters:**

```typescript
{
  // PaginationParams
  page?: number
  limit?: number
  sort?: string
  order?: 'asc' | 'desc'

  // BaseFilterParams
  search?: string
  date_from?: string
  date_to?: string
  active_only?: boolean
}
```

**Response:**

```typescript
{
  data: {
    departments: Array<{
      org_guid: string
      department_guid: string
      department: string
      department_code: string
      parentdep_guid?: string
      date_create: string
      date_disband: string
      headofdep_guid?: string
    }>
  }
  status: 'success' | 'error'
  message?: string
}
```

---

### GET `/departments/:department_guid`

Получение информации о конкретном отделе.

**Response:**

```typescript
{
  data: {
    department: {
      org_guid: string
      department_guid: string
      department: string
      department_code: string
      parentdep_guid?: string
      date_create: string
      date_disband: string
      headofdep_guid?: string
    }
  }
  status: 'success' | 'error'
  message?: string
}
```

---

### GET `/departments/:department_guid/employees`

Получение списка сотрудников отдела.

**Query Parameters:**

```typescript
{
  page?: number
  limit?: number
  sort?: string
  order?: 'asc' | 'desc'
}
```

**Response:** (тот же формат, что и для GET `/employees`)

---

### POST `/departments`

Создание нового отдела.

**Request Body:**

```typescript
{
  department: string
  department_code: string
  org_guid: string
  parentdep_guid?: string
  date_create: string
  date_disband?: string
  headofdep_guid?: string
}
```

**Response:**

```typescript
{
  data: {
    department: {
      org_guid: string
      department_guid: string
      department: string
      department_code: string
      parentdep_guid?: string
      date_create: string
      date_disband: string
      headofdep_guid?: string
    }
  }
  status: 'success' | 'error'
  message?: string
}
```

---

### PUT `/departments/:department_guid`

Обновление информации об отделе.

**Request Body:**

```typescript
{
  department_guid: string
  department?: string
  department_code?: string
  parentdep_guid?: string
  date_disband?: string
  headofdep_guid?: string
}
```

**Response:** (тот же формат, что и для POST `/departments`)

---

### DELETE `/departments/:department_guid`

Удаление отдела.

**Response:**

```typescript
{
  data: {}
  status: 'success' | 'error'
  message?: string
}
```

---

## Должности (Positions)

### GET `/positions`

Получение списка всех должностей с пагинацией и фильтрацией.

**Query Parameters:**

```typescript
{
  // PaginationParams
  page?: number
  limit?: number
  sort?: string
  order?: 'asc' | 'desc'

  // BaseFilterParams
  search?: string
  date_from?: string
  date_to?: string
  active_only?: boolean

  // PositionFilterParams
  department_guid?: string
}
```

**Response:**

```typescript
{
  data: {
    positions: Array<{
      org_guid: string
      post_guid: string
      post?: string
      position_name?: string
      department_guid?: string
    }>
  }
  status: 'success' | 'error'
  message?: string
}
```

---

### GET `/positions/:post_guid`

Получение информации о конкретной должности.

**Response:**

```typescript
{
  data: {
    position: {
      org_guid: string
      post_guid: string
      post?: string
      position_name?: string
      department_guid?: string
    }
  }
  status: 'success' | 'error'
  message?: string
}
```

---

### GET `/positions/department/:department_guid`

Получение списка должностей по отделу.

**Query Parameters:**

```typescript
{
  page?: number
  limit?: number
  sort?: string
  order?: 'asc' | 'desc'
}
```

**Response:** (тот же формат, что и для GET `/positions`)

---

### POST `/positions`

Создание новой должности.

**Request Body:**

```typescript
{
  org_guid: string
  post: string                     // Название должности
  position_name?: string            // Альтернативное название
  department_guid?: string
}
```

**Response:**

```typescript
{
  data: {
    position: {
      org_guid: string
      post_guid: string
      post?: string
      position_name?: string
      department_guid?: string
    }
  }
  status: 'success' | 'error'
  message?: string
}
```

---

### PUT `/positions/:post_guid`

Обновление информации о должности.

**Request Body:**

```typescript
{
  post_guid: string
  post?: string
  position_name?: string
  department_guid?: string
}
```

**Response:** (тот же формат, что и для POST `/positions`)

---

### DELETE `/positions/:post_guid`

Удаление должности.

**Response:**

```typescript
{
  data: {}
  status: 'success' | 'error'
  message?: string
}
```

---

## Коды ошибок

Все эндпоинты должны возвращать стандартные HTTP коды статуса:

- `200 OK` - Успешный запрос
- `201 Created` - Ресурс успешно создан
- `400 Bad Request` - Неверные параметры запроса
- `401 Unauthorized` - Требуется аутентификация или токен истек
- `403 Forbidden` - Недостаточно прав доступа
- `404 Not Found` - Ресурс не найден
- `422 Unprocessable Entity` - Ошибка валидации данных
- `500 Internal Server Error` - Внутренняя ошибка сервера

---

## Примечания

1. Все GUID должны быть в формате UUID v4
2. Все даты должны быть в формате ISO 8601 (например: `2024-01-15T10:30:00Z`)
3. Все суммы должны быть числовыми значениями (без форматирования)
4. При пагинации по умолчанию используется `page=1` и `limit=20`
5. Refresh token должен храниться в HttpOnly cookie для безопасности
6. Access token должен передаваться в заголовке `Authorization: Bearer {token}`
7. При получении 401 ошибки, фронтенд автоматически попытается обновить токен через `/auth/refresh`
