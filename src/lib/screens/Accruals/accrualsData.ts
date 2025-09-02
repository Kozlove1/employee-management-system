import type { AccrualWithDetails } from '$lib/types';

// Функция для генерации уникального GUID
export function generateAccrualId(): string {
  return `accrual_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Комплексные mock данные для начислений
export const mockAccrualsData: AccrualWithDetails[] = [
  {
    // Базовые поля Accrual
    org_guid: '8753101a-4fb8-11ed-9d6f-00155dd75c64',
    post_guid: 'acc_001_2024_12_20_001',
    post: 'Тестовая награда 2 - 300 АК',
    department_guid: '86253ef6-4e33-11ee-9d85-00155de8647c',
    datecreate: '2024-12-20T14:30',
    datedisband: '',
    
    // Расширенные поля AccrualWithDetails
    employee_name: 'Абдуллина Надежа Маскутовна',
    employee_guid: 'e806f017-a041-11ef-9dad-00155de8647c',
    type_name: 'Тестовая награда 2',
    type_guid: 'type1',
    amount: 300,
    comment: 'Награда за выдающиеся достижения в работе',
  },
  {
    org_guid: '8753101a-4fb8-11ed-9d6f-00155dd75c64',
    post_guid: 'acc_002_2024_12_19_001', 
    post: 'Тестовая награда 3 - 60 АК',
    department_guid: '86253b1a-4e33-11ee-9d85-00155de8647c',
    datecreate: '2024-12-19T09:15',
    datedisband: '',
    
    employee_name: 'Абдулганеев Ільназар Альфредович',
    employee_guid: 'd705e016-a041-11ef-9dad-00155de8647c',
    type_name: 'Тестовая награда 3',
    type_guid: 'type2',
    amount: 60,
    comment: 'За качественную работу над проектом модернизации',
  },
  {
    org_guid: '8753101a-4fb8-11ed-9d6f-00155dd75c64',
    post_guid: 'acc_003_2024_12_18_001',
    post: 'Тестовая награда - 100 АК',
    department_guid: '86253ef6-4e33-11ee-9d85-00155de8647c',
    datecreate: '2024-12-18T16:45',
    datedisband: '',
    
    employee_name: 'Абрахманов Ільшат Ришатович',
    employee_guid: 'c604d015-a041-11ef-9dad-00155de8647c',
    type_name: 'Тестовая награда',
    type_guid: 'type3',
    amount: 100,
    comment: 'Специальная награда за инновационное решение',
  },
  {
    org_guid: '8753101a-4fb8-11ed-9d6f-00155dd75c64',
    post_guid: 'acc_004_2024_12_17_001',
    post: 'Премия за выслугу лет - 500 руб',
    department_guid: '86253e12-4e33-11ee-9d85-00155de8647c',
    datecreate: '2024-12-17T11:20',
    datedisband: '',
    
    employee_name: 'Колногорова Олеся Александровна',
    employee_guid: '6b68a3b2-a041-11ef-9dad-00155de8647c',
    type_name: 'Премия за выслугу лет',
    type_guid: 'type4',
    amount: 500,
    comment: 'За 10 лет добросовестной работы в компании',
  },
  {
    org_guid: '8753101a-4fb8-11ed-9d6f-00155dd75c64',
    post_guid: 'acc_005_2024_12_16_001',
    post: 'Бонус за качественную работу - 200 руб',
    department_guid: '86253ef6-4e33-11ee-9d85-00155de8647c',
    datecreate: '2024-12-16T13:10',
    datedisband: '',
    
    employee_name: 'Макаров Дмитрий Юрьевич',
    employee_guid: '0a08b119-a041-11ef-9dad-00155de8647c',
    type_name: 'Бонус за качественную работу',
    type_guid: 'type5',
    amount: 200,
    comment: 'За отличное выполнение проекта автоматизации',
  },
  {
    org_guid: '8753101a-4fb8-11ed-9d6f-00155dd75c64',
    post_guid: 'acc_006_2024_12_15_001',
    post: 'Тестовая награда 2 - 300 АК',
    department_guid: '86253ef6-4e33-11ee-9d85-00155de8647c',
    datecreate: '2024-12-15T10:30',
    datedisband: '',
    
    employee_name: 'Разбойкин Юрий Павлович',
    employee_guid: '1b19c21a-a041-11ef-9dad-00155de8647c',
    type_name: 'Тестовая награда 2',
    type_guid: 'type1',
    amount: 300,
    comment: 'За превышение плановых показателей на 150%',
  },
  {
    org_guid: '8753101a-4fb8-11ed-9d6f-00155dd75c64',
    post_guid: 'acc_007_2024_12_14_001',
    post: 'Тестовая награда 3 - 60 АК',
    department_guid: '86253b1a-4e33-11ee-9d85-00155de8647c',
    datecreate: '2024-12-14T15:20',
    datedisband: '',
    
    employee_name: 'Смирнова Анна Владимировна',
    employee_guid: '2c2ad31b-a041-11ef-9dad-00155de8647c',
    type_name: 'Тестовая награда 3',
    type_guid: 'type2',
    amount: 60,
    comment: 'За успешную реализацию клиентского проекта',
  },
  {
    org_guid: '8753101a-4fb8-11ed-9d6f-00155dd75c64',
    post_guid: 'acc_008_2024_12_13_001',
    post: 'Бонус за качественную работу - 200 руб',
    department_guid: '86253ef6-4e33-11ee-9d85-00155de8647c',
    datecreate: '2024-12-13T09:45',
    datedisband: '',
    
    employee_name: 'Петров Игорь Сергеевич',
    employee_guid: '3d3be41c-a041-11ef-9dad-00155de8647c',
    type_name: 'Бонус за качественную работу',
    type_guid: 'type5',
    amount: 200,
    comment: 'За внедрение новой системы контроля качества',
  },
  {
    org_guid: '8753101a-4fb8-11ed-9d6f-00155dd75c64',
    post_guid: 'acc_009_2024_12_12_001',
    post: 'Тестовая награда - 100 АК',
    department_guid: '86253e12-4e33-11ee-9d85-00155de8647c',
    datecreate: '2024-12-12T14:15',
    datedisband: '',
    
    employee_name: 'Козлова Елена Михайловна',
    employee_guid: '4e4cf51d-a041-11ef-9dad-00155de8647c',
    type_name: 'Тестовая награда',
    type_guid: 'type3',
    amount: 100,
    comment: 'За разработку улучшений в рабочем процессе',
  },
  {
    org_guid: '8753101a-4fb8-11ed-9d6f-00155dd75c64',
    post_guid: 'acc_010_2024_12_11_001',
    post: 'Премия за выслугу лет - 500 руб',
    department_guid: '86253ef6-4e33-11ee-9d85-00155de8647c',
    datecreate: '2024-12-11T16:00',
    datedisband: '',
    
    employee_name: 'Абдуллин Алмаз Ришатович',
    employee_guid: 'f907a018-a041-11ef-9dad-00155de8647c',
    type_name: 'Премия за выслугу лет',
    type_guid: 'type4',
    amount: 500,
    comment: 'За 5 лет безупречной работы в отделе',
  },
];

// Интерфейс для создания нового начисления
export interface CreateAccrualData {
  employee_guid: string;
  type_guid: string;
  amount: number;
  comment: string;
  date: string;
}

// Интерфейс для обновления начисления
export interface UpdateAccrualData extends CreateAccrualData {
  post_guid: string;
}

// CRUD операции для работы с начислениями
export class AccrualsDataManager {
  private static data: AccrualWithDetails[] = [...mockAccrualsData];

  // Получить все начисления
  static getAll(): AccrualWithDetails[] {
    return [...this.data];
  }

  // Получить начисление по ID
  static getById(postGuid: string): AccrualWithDetails | undefined {
    return this.data.find(accrual => accrual.post_guid === postGuid);
  }

  // Создать новое начисление
  static create(data: CreateAccrualData, mockEmployees: any[], mockAccrualTypes: any[]): AccrualWithDetails {
    const employee = mockEmployees.find(e => e.employee_guid === data.employee_guid);
    const type = mockAccrualTypes.find(t => t.type_guid === data.type_guid);

    if (!employee || !type) {
      throw new Error('Employee or Accrual Type not found');
    }

    const newAccrual: AccrualWithDetails = {
      // Генерируем уникальный ID
      org_guid: '8753101a-4fb8-11ed-9d6f-00155dd75c64',
      post_guid: generateAccrualId(),
      post: `${type.type_name} - ${data.amount} ${type.ammo_coins_amount ? 'АК' : 'руб'}`,
      department_guid: employee.department_guid,
      datecreate: data.date,
      datedisband: '',
      
      // Дополнительные поля
      employee_name: employee.employee,
      employee_guid: data.employee_guid,
      type_name: type.type_name,
      type_guid: data.type_guid,
      amount: data.amount,
      comment: data.comment,
    };

    // Добавляем в начало массива (последние записи сверху)
    this.data.unshift(newAccrual);
    return newAccrual;
  }

  // Обновить начисление
  static update(data: UpdateAccrualData, mockEmployees: any[], mockAccrualTypes: any[]): AccrualWithDetails | null {
    console.log('AccrualsDataManager.update called with:', data);
    const index = this.data.findIndex(accrual => accrual.post_guid === data.post_guid);
    console.log('Found index:', index);
    
    if (index === -1) {
      console.log('Accrual not found with post_guid:', data.post_guid);
      return null;
    }

    const employee = mockEmployees.find(e => e.employee_guid === data.employee_guid);
    const type = mockAccrualTypes.find(t => t.type_guid === data.type_guid);
    console.log('Found employee:', employee);
    console.log('Found type:', type);

    if (!employee || !type) {
      console.log('Employee or type not found');
      throw new Error('Employee or Accrual Type not found');
    }

    const updatedAccrual: AccrualWithDetails = {
      ...this.data[index],
      // Сохраняем оригинальный post_guid
      post: `${type.type_name} - ${data.amount} ${type.ammo_coins_amount ? 'АК' : 'руб'}`,
      department_guid: employee.department_guid,
      datecreate: data.date,
      
      // Обновляемые поля
      employee_name: employee.employee,
      employee_guid: data.employee_guid,
      type_name: type.type_name,
      type_guid: data.type_guid,
      amount: data.amount,
      comment: data.comment,
    };

    console.log('Updating accrual from:', this.data[index]);
    console.log('Updating accrual to:', updatedAccrual);
    
    this.data[index] = updatedAccrual;
    return updatedAccrual;
  }

  // Удалить начисление
  static delete(postGuid: string): boolean {
    const index = this.data.findIndex(accrual => accrual.post_guid === postGuid);
    
    if (index === -1) {
      return false;
    }

    this.data.splice(index, 1);
    return true;
  }

  // Получить статистику
  static getStats() {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyAccruals = this.data.filter(accrual => {
      const accrualDate = new Date(accrual.datecreate);
      return (
        accrualDate.getMonth() === currentMonth &&
        accrualDate.getFullYear() === currentYear
      );
    });

    return {
      total: this.data.length,
      monthlyCount: monthlyAccruals.length,
      monthlyAmount: monthlyAccruals.reduce((sum, accrual) => sum + (accrual.amount || 0), 0),
    };
  }

  // Поиск и фильтрация
  static search(params: {
    searchTerm?: string;
    employeeGuid?: string;
    typeGuid?: string;
    sortOrder?: 'newest' | 'oldest';
  }): AccrualWithDetails[] {
    let filtered = [...this.data];

    // Поиск по тексту
    if (params.searchTerm) {
      const searchLower = params.searchTerm.toLowerCase();
      filtered = filtered.filter(accrual =>
        accrual.employee_name?.toLowerCase().includes(searchLower) ||
        accrual.type_name?.toLowerCase().includes(searchLower) ||
        accrual.comment?.toLowerCase().includes(searchLower)
      );
    }

    // Фильтр по сотруднику
    if (params.employeeGuid) {
      filtered = filtered.filter(accrual => accrual.employee_guid === params.employeeGuid);
    }

    // Фильтр по типу
    if (params.typeGuid) {
      filtered = filtered.filter(accrual => accrual.type_guid === params.typeGuid);
    }

    // Сортировка
    if (params.sortOrder === 'oldest') {
      filtered.sort((a, b) =>
        new Date(a.datecreate).getTime() - new Date(b.datecreate).getTime()
      );
    } else {
      filtered.sort((a, b) =>
        new Date(b.datecreate).getTime() - new Date(a.datecreate).getTime()
      );
    }

    return filtered;
  }
}
