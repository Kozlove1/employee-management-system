import type {
  Accrual,
  AccrualType,
  Department,
  Employee,
  Position
} from '$lib/types';

export const mockOrganization = {
  org_guid: "8753101a-4fb8-11ed-9d6f-00155dd75c64"
};

export const mockDepartments: Department[] = [
  {
    org_guid: "8753101a-4fb8-11ed-9d6f-00155dd75c64",
    department: "Цех теплогазоснабжения",
    department_guid: "86253ef6-4e33-11ee-9d85-00155de8647c",
    department_code: "1750200",
    parentdep_guid: "862539c4-4e33-11ee-9d85-00155de8647c",
    datecreate: "01.05.2024",
    datedisband: "",
    headofdep_guid: "e46ff3e0-a0c4-11ef-9dad-00155de8647c"
  },
  {
    org_guid: "8753101a-4fb8-11ed-9d6f-00155dd75c64",
    department: "Участок внутриплощадочного водоснабжения и химводоподготовки",
    department_guid: "86253b1a-4e33-11ee-9d85-00155de8647c",
    department_code: "1755200",
    parentdep_guid: "86253a36-4e33-11ee-9d85-00155de8647c",
    datecreate: "01.01.2024",
    datedisband: "",
    headofdep_guid: ""
  },
  {
    org_guid: "8753101a-4fb8-11ed-9d6f-00155dd75c64",
    department: "Цех химводоподготовки",
    department_guid: "86253e12-4e33-11ee-9d85-00155de8647c",
    department_code: "1760200",
    datecreate: "01.01.2024",
    datedisband: "",
    headofdep_guid: ""
  }
];

export const mockPositions: Position[] = [
  {
    position_guid: "pos1",
    position_name: "Старший мастер по ремонту и обслуживанию оборудования",
    department_guid: "86253ef6-4e33-11ee-9d85-00155de8647c"
  },
  {
    position_guid: "pos2", 
    position_name: "Участок внутриплощадочного водоснабжения и химводоподготовки",
    department_guid: "86253b1a-4e33-11ee-9d85-00155de8647c"
  },
  {
    position_guid: "pos3",
    position_name: "Машинист насосных установок ВОЦ", 
    department_guid: "86253e12-4e33-11ee-9d85-00155de8647c"
  },
  {
    position_guid: "pos4",
    position_name: "Специалист по договорной работе",
    department_guid: "86253ef6-4e33-11ee-9d85-00155de8647c"
  }
];

export const mockEmployees: Employee[] = [
  {
    org_guid: "8753101a-4fb8-11ed-9d6f-00155dd75c64",
    post_guid: "add09c40-a0c4-11ef-9dad-00155de8647c",
    ident: "0000-00283",
    employee: "Колногорова Олеся Александровна",
    employee_guid: "6b68a3b2-a041-11ef-9dad-00155de8647c",
    dateemploy: "27.01.2014",
    datedismis: "",
    email: "kolnogorova.o@ammoni.ru",
    sex: "Ж",
    person_guid: "c9bc282f-a02c-11ef-9dad-00155de8647c",
    department_guid: "86253b53-4e33-11ee-9d85-00155de8647c"
  },
  {
    org_guid: "8753101a-4fb8-11ed-9d6f-00155dd75c64",
    post_guid: "11dbba8e-a0c4-11ef-9dad-00155de8647c",
    ident: "0000-00468",
    employee: "Абрахманов Ильшат Ришатович",
    employee_guid: "c604d015-a041-11ef-9dad-00155de8647c",
    dateemploy: "16.02.2015",
    datedismis: "",
    email: "",
    sex: "М",
    person_guid: "05546027-a025-11ef-9dad-00155de8647c",
    department_guid: "86253ef6-4e33-11ee-9d85-00155de8647c"
  },
  {
    org_guid: "8753101a-4fb8-11ed-9d6f-00155dd75c64",
    post_guid: "22ccab9e-a0c4-11ef-9dad-00155de8647c",
    ident: "0000-01860",
    employee: "Абдулганеев Ильназар Альфредович",
    employee_guid: "d705e016-a041-11ef-9dad-00155de8647c",
    dateemploy: "20.03.2018",
    datedismis: "",
    email: "",
    sex: "М",
    person_guid: "16547028-a025-11ef-9dad-00155de8647c",
    department_guid: "86253b1a-4e33-11ee-9d85-00155de8647c"
  },
  {
    org_guid: "8753101a-4fb8-11ed-9d6f-00155dd75c64", 
    post_guid: "33ddbc8f-a0c4-11ef-9dad-00155de8647c",
    ident: "0000-01656",
    employee: "Абдуллина Надежа Маскутовна",
    employee_guid: "e806f017-a041-11ef-9dad-00155de8647c",
    dateemploy: "12.12.2016",
    datedismis: "",
    email: "abdullina.n@ammoni.ru",
    sex: "Ж",
    person_guid: "27658029-a025-11ef-9dad-00155de8647c",
    department_guid: "86253ef6-4e33-11ee-9d85-00155de8647c"
  },
  {
    org_guid: "8753101a-4fb8-11ed-9d6f-00155dd75c64",
    post_guid: "44eecda0-a0c4-11ef-9dad-00155de8647c",
    ident: "0000-02347",
    employee: "Абдуллин Алмаз Ришатович",
    employee_guid: "f907a018-a041-11ef-9dad-00155de8647c",
    dateemploy: "21.06.2025",
    datedismis: "",
    email: "",
    sex: "М", 
    person_guid: "3876902a-a025-11ef-9dad-00155de8647c",
    department_guid: "86253e12-4e33-11ee-9d85-00155de8647c"
  },
  {
    org_guid: "8753101a-4fb8-11ed-9d6f-00155dd75c64",
    post_guid: "55ffdee1-a0c4-11ef-9dad-00155de8647c",
    ident: "0000-03125",
    employee: "Макаров Дмитрий Юрьевич",
    employee_guid: "0a08b119-a041-11ef-9dad-00155de8647c",
    dateemploy: "15.08.2017",
    datedismis: "",
    email: "makarov.d@ammoni.ru",
    sex: "М",
    person_guid: "4987a02b-a025-11ef-9dad-00155de8647c",
    department_guid: "86253ef6-4e33-11ee-9d85-00155de8647c"
  },
  {
    org_guid: "8753101a-4fb8-11ed-9d6f-00155dd75c64",
    post_guid: "66ggff2-a0c4-11ef-9dad-00155de8647c",
    ident: "0000-04189",
    employee: "Разбойкин Юрий Павлович",
    employee_guid: "1b19c21a-a041-11ef-9dad-00155de8647c",
    dateemploy: "03.11.2019",
    datedismis: "",
    email: "razboykin.y@ammoni.ru",
    sex: "М",
    person_guid: "5a98b12c-a025-11ef-9dad-00155de8647c",
    department_guid: "86253b1a-4e33-11ee-9d85-00155de8647c"
  },
  {
    org_guid: "8753101a-4fb8-11ed-9d6f-00155dd75c64",
    post_guid: "77hhgg3-a0c4-11ef-9dad-00155de8647c",
    ident: "0000-05234",
    employee: "Смирнова Анна Владимировна",
    employee_guid: "2c2ad31b-a041-11ef-9dad-00155de8647c",
    dateemploy: "22.05.2020",
    datedismis: "",
    email: "smirnova.a@ammoni.ru",
    sex: "Ж",
    person_guid: "6ba9c23d-a025-11ef-9dad-00155de8647c",
    department_guid: "86253e12-4e33-11ee-9d85-00155de8647c"
  },
  {
    org_guid: "8753101a-4fb8-11ed-9d6f-00155dd75c64",
    post_guid: "88iihh4-a0c4-11ef-9dad-00155de8647c",
    ident: "0000-06178",
    employee: "Петров Игорь Сергеевич",
    employee_guid: "3d3be41c-a041-11ef-9dad-00155de8647c",
    dateemploy: "10.09.2021",
    datedismis: "",
    email: "petrov.i@ammoni.ru",
    sex: "М",
    person_guid: "7cbad34e-a025-11ef-9dad-00155de8647c",
    department_guid: "86253ef6-4e33-11ee-9d85-00155de8647c"
  },
  {
    org_guid: "8753101a-4fb8-11ed-9d6f-00155dd75c64",
    post_guid: "99jjii5-a0c4-11ef-9dad-00155de8647c",
    ident: "0000-07192",
    employee: "Козлова Елена Михайловна",
    employee_guid: "4e4cf51d-a041-11ef-9dad-00155de8647c",
    dateemploy: "14.12.2022",
    datedismis: "",
    email: "kozlova.e@ammoni.ru",
    sex: "Ж",
    person_guid: "8dcbe45f-a025-11ef-9dad-00155de8647c",
    department_guid: "86253b1a-4e33-11ee-9d85-00155de8647c"
  }
];

export const mockAccrualTypes: AccrualType[] = [
  {
    type_guid: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    type_name: "Тестовая награда 2",
    ammo_coins_amount: 300 // Фиксированное количество АК
  },
  {
    type_guid: "b2c3d4e5-f6g7-8901-bcde-f23456789012", 
    type_name: "Тестовая награда 3",
    ammo_coins_amount: 60 // Фиксированное количество АК
  },
  {
    type_guid: "c3d4e5f6-g7h8-9012-cdef-345678901234",
    type_name: "Тестовая награда",
    ammo_coins_amount: 100 // Фиксированное количество АК
  },
  {
    type_guid: "d4e5f6g7-h8i9-0123-def0-456789012345",
    type_name: "Премия за выслугу лет"
    // Нет ammo_coins_amount - означает, что сумма вводится вручную
  },
  {
    type_guid: "e5f6g7h8-i9j0-1234-ef01-567890123456",
    type_name: "Бонус за качественную работу"
    // Нет ammo_coins_amount - означает, что сумма вводится вручную
  }
];

export const mockAccruals: Accrual[] = [
  {
    org_guid: "8753101a-4fb8-11ed-9d6f-00155dd75c64",
    post_guid: "004a0126-0ee3-11f0-9db3-00155de8647c",
    post: "Тестовая награда 2",
    department_guid: "86253ef6-4e33-11ee-9d85-00155de8647c",
    datecreate: "03.03.2025",
    datedisband: ""
  },
  {
    org_guid: "8753101a-4fb8-11ed-9d6f-00155dd75c64",
    post_guid: "59f4672c-a0c4-11ef-9dad-00155de8647c",
    post: "Участок внутриплощадочного водоснабжения и химводоподготовки",
    department_guid: "86253e71-4e33-11ee-9d85-00155de8647c",
    datecreate: "01.01.2024",
    datedisband: ""
  }
];

// Вспомогательные функции для работы с данными
export function getEmployeesByDepartment(departmentGuid: string): Employee[] {
  return mockEmployees.filter(emp => emp.department_guid === departmentGuid);
}

export function getDepartmentName(departmentGuid: string): string {
  const dept = mockDepartments.find(d => d.department_guid === departmentGuid);
  return dept?.department || 'Неизвестное подразделение';
}

export function getPositionName(positionGuid: string): string {
  const pos = mockPositions.find(p => p.position_guid === positionGuid);
  return pos?.position_name || 'Неизвестная должность';
}

export function getAccrualTypeName(typeGuid: string): string {
  const type = mockAccrualTypes.find(t => t.type_guid === typeGuid);
  return type?.type_name || 'Неизвестный тип начисления';
}

// Генерация случайных балансов для демонстрации
export function generateRandomBalance(): number {
  return Math.floor(Math.random() * 10000);
}

