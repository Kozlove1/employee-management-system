import type { Employee } from './types'

function generateAdditionalEmployees(count: number): Employee[] {
	const firstNames = [
		'Александр',
		'Алексей',
		'Андрей',
		'Артем',
		'Владимир',
		'Дмитрий',
		'Евгений',
		'Игорь',
		'Максим',
		'Михаил',
		'Николай',
		'Павел',
		'Роман',
		'Сергей',
		'Станислав',
		'Юрий',
		'Анна',
		'Елена',
		'Ирина',
		'Мария',
		'Наталья',
		'Ольга',
		'Светлана',
		'Татьяна',
		'Юлия',
		'Виктория',
		'Дарья',
		'Екатерина',
		'Кристина',
		'Людмила'
	]

	const lastNames = [
		'Иванов',
		'Петров',
		'Сидоров',
		'Смирнов',
		'Кузнецов',
		'Попов',
		'Васильев',
		'Соколов',
		'Михайлов',
		'Новиков',
		'Федоров',
		'Морозов',
		'Волков',
		'Алексеев',
		'Лебедев',
		'Семенов',
		'Егоров',
		'Павлов',
		'Козлов',
		'Степанов',
		'Николаев',
		'Орлов',
		'Андреев',
		'Макаров',
		'Никитин',
		'Захаров',
		'Зайцев',
		'Соловьев',
		'Борисов',
		'Яковлев'
	]

	const middleNames = [
		'Александрович',
		'Алексеевич',
		'Андреевич',
		'Артемович',
		'Владимирович',
		'Дмитриевич',
		'Евгеньевич',
		'Игоревич',
		'Максимович',
		'Михайлович',
		'Николаевич',
		'Павлович',
		'Романович',
		'Сергеевич',
		'Станиславович',
		'Юрьевич',
		'Александровна',
		'Алексеевна',
		'Андреевна',
		'Артемовна',
		'Владимировна',
		'Дмитриевна',
		'Евгеньевна',
		'Игоревна',
		'Максимовна',
		'Михайловна',
		'Николаевна',
		'Павловна',
		'Романовна',
		'Сергеевна',
		'Станиславовна',
		'Юрьевна'
	]

	const departments = [
		'86253b53-4e33-11ee-9d85-00155de8647c', // Подразделение 1
		'86253e12-4e33-11ee-9d85-00155de8647c', // Подразделение 2
		'86253c25-4e33-11ee-9d85-00155de8647c' // Подразделение 3
	]

	const positions = [
		'add09c40-a0c4-11ef-9dad-00155de8647c', // Должность 1
		'11dbba8e-a0c4-11ef-9dad-00155de8647c', // Должность 2
		'22dbba8e-a0c4-11ef-9dad-00155de8647c', // Должность 3
		'33dbba8e-a0c4-11ef-9dad-00155de8647c', // Должность 4
		'44dbba8e-a0c4-11ef-9dad-00155de8647c' // Должность 5
	]

	const additionalEmployees: Employee[] = []

	for (let i = 0; i < count; i++) {
		const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
		const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
		const middleName = middleNames[Math.floor(Math.random() * middleNames.length)]
		const fullName = `${lastName} ${firstName} ${middleName}`

		const isMale = Math.random() > 0.5
		const sex = isMale ? 'Мужской' : 'Женский'

		const year = 2010 + Math.floor(Math.random() * 15)
		const month = String(1 + Math.floor(Math.random() * 12)).padStart(2, '0')
		const day = String(1 + Math.floor(Math.random() * 28)).padStart(2, '0')
		const dateemploy = `${day}.${month}.${year}`

		// 10% сотрудников уволены
		const isDismissed = Math.random() < 0.1
		const datedismis = isDismissed ? '15.06.2024' : ''

		const ident = `0000-${String(700 + i).padStart(5, '0')}`
		const employeeGuid = `emp${String(i + 100).padStart(3, '0')}-a041-11ef-9dad-00155de8647c`
		const personGuid = `per${String(i + 100).padStart(3, '0')}-a025-11ef-9dad-00155de8647c`
		const postGuid = positions[Math.floor(Math.random() * positions.length)]
		const departmentGuid = departments[Math.floor(Math.random() * departments.length)]

		const email =
			Math.random() > 0.2
				? `${lastName.toLowerCase()}.${firstName.charAt(0).toLowerCase()}@ammoni.ru`
				: ''

		additionalEmployees.push({
			org_guid: '8753101a-4fb8-11ed-9d6f-00155dd75c64',
			post_guid: postGuid,
			ident: ident,
			employee: fullName,
			employee_guid: employeeGuid,
			dateemploy: dateemploy,
			datedismis: datedismis,
			email: email,
			sex: sex,
			person_guid: personGuid,
			department_guid: departmentGuid
		})
	}

	return additionalEmployees
}

// Mock данные сотрудников на основе реального JSON API
export const apiEmployeesData: Employee[] = [
	{
		org_guid: '8753101a-4fb8-11ed-9d6f-00155dd75c64',
		post_guid: 'add09c40-a0c4-11ef-9dad-00155de8647c',
		ident: '0000-00283',
		employee: 'Колногорова Оксана Викторовна',
		employee_guid: '6b68a3b2-a041-11ef-9dad-00155de8647c',
		dateemploy: '27.01.2014',
		datedismis: '',
		email: 'kolnogorova.o@ammoni.ru',
		sex: 'Женский',
		person_guid: 'c9bc282f-a02c-11ef-9dad-00155de8647c',
		department_guid: '86253b53-4e33-11ee-9d85-00155de8647c'
	},
	{
		org_guid: '8753101a-4fb8-11ed-9d6f-00155dd75c64',
		post_guid: '11dbba8e-a0c4-11ef-9dad-00155de8647c',
		ident: '0000-00468',
		employee: 'Ибрагимова Гузель Ильдаровна',
		employee_guid: 'c604d015-a041-11ef-9dad-00155de8647c',
		dateemploy: '16.02.2015',
		datedismis: '',
		email: '',
		sex: 'Женский',
		person_guid: '05546027-a025-11ef-9dad-00155de8647c',
		department_guid: '86253e12-4e33-11ee-9d85-00155de8647c'
	},
	{
		org_guid: '8753101a-4fb8-11ed-9d6f-00155dd75c64',
		post_guid: '22dbba8e-a0c4-11ef-9dad-00155de8647c',
		ident: '0000-00501',
		employee: 'Петров Михаил Александрович',
		employee_guid: 'd604d015-a041-11ef-9dad-00155de8647c',
		dateemploy: '15.03.2016',
		datedismis: '20.12.2023',
		email: 'petrov.m@ammoni.ru',
		sex: 'Мужской',
		person_guid: '15546027-a025-11ef-9dad-00155de8647c',
		department_guid: '86253b53-4e33-11ee-9d85-00155de8647c'
	},
	{
		org_guid: '8753101a-4fb8-11ed-9d6f-00155dd75c64',
		post_guid: '33dbba8e-a0c4-11ef-9dad-00155de8647c',
		ident: '0000-00512',
		employee: 'Сидорова Анна Сергеевна',
		employee_guid: 'e604d015-a041-11ef-9dad-00155de8647c',
		dateemploy: '10.09.2017',
		datedismis: '',
		email: 'sidorova.a@ammoni.ru',
		sex: 'Женский',
		person_guid: '25546027-a025-11ef-9dad-00155de8647c',
		department_guid: '86253e12-4e33-11ee-9d85-00155de8647c'
	},
	{
		org_guid: '8753101a-4fb8-11ed-9d6f-00155dd75c64',
		post_guid: '44dbba8e-a0c4-11ef-9dad-00155de8647c',
		ident: '0000-00523',
		employee: 'Иванов Дмитрий Петрович',
		employee_guid: 'f604d015-a041-11ef-9dad-00155de8647c',
		dateemploy: '22.11.2018',
		datedismis: '',
		email: 'ivanov.d@ammoni.ru',
		sex: 'Мужской',
		person_guid: '35546027-a025-11ef-9dad-00155de8647c',
		department_guid: '86253b53-4e33-11ee-9d85-00155de8647c'
	},
	{
		org_guid: '8753101a-4fb8-11ed-9d6f-00155dd75c64',
		post_guid: '55dbba8e-a0c4-11ef-9dad-00155de8647c',
		ident: '0000-00534',
		employee: 'Козлова Елена Владимировна',
		employee_guid: 'a604d015-a041-11ef-9dad-00155de8647c',
		dateemploy: '05.04.2019',
		datedismis: '',
		email: 'kozlova.e@ammoni.ru',
		sex: 'Женский',
		person_guid: '45546027-a025-11ef-9dad-00155de8647c',
		department_guid: '86253c25-4e33-11ee-9d85-00155de8647c'
	},
	// Дополнительные сотрудники для тестирования пагинации
	{
		org_guid: '8753101a-4fb8-11ed-9d6f-00155dd75c64',
		post_guid: '66dbba8e-a0c4-11ef-9dad-00155de8647c',
		ident: '0000-00545',
		employee: 'Федоров Алексей Николаевич',
		employee_guid: 'b604d015-a041-11ef-9dad-00155de8647c',
		dateemploy: '12.06.2020',
		datedismis: '',
		email: 'fedorov.a@ammoni.ru',
		sex: 'Мужской',
		person_guid: '55546027-a025-11ef-9dad-00155de8647c',
		department_guid: '86253b53-4e33-11ee-9d85-00155de8647c'
	},
	{
		org_guid: '8753101a-4fb8-11ed-9d6f-00155dd75c64',
		post_guid: '77dbba8e-a0c4-11ef-9dad-00155de8647c',
		ident: '0000-00556',
		employee: 'Морозова Татьяна Ивановна',
		employee_guid: 'c704d015-a041-11ef-9dad-00155de8647c',
		dateemploy: '08.08.2021',
		datedismis: '',
		email: 'morozova.t@ammoni.ru',
		sex: 'Женский',
		person_guid: '65546027-a025-11ef-9dad-00155de8647c',
		department_guid: '86253e12-4e33-11ee-9d85-00155de8647c'
	},
	{
		org_guid: '8753101a-4fb8-11ed-9d6f-00155dd75c64',
		post_guid: '88dbba8e-a0c4-11ef-9dad-00155de8647c',
		ident: '0000-00567',
		employee: 'Соколов Владимир Петрович',
		employee_guid: 'd804d015-a041-11ef-9dad-00155de8647c',
		dateemploy: '03.12.2019',
		datedismis: '15.06.2024',
		email: 'sokolov.v@ammoni.ru',
		sex: 'Мужской',
		person_guid: '75546027-a025-11ef-9dad-00155de8647c',
		department_guid: '86253c25-4e33-11ee-9d85-00155de8647c'
	},
	{
		org_guid: '8753101a-4fb8-11ed-9d6f-00155dd75c64',
		post_guid: '99dbba8e-a0c4-11ef-9dad-00155de8647c',
		ident: '0000-00578',
		employee: 'Новикова Мария Александровна',
		employee_guid: 'e904d015-a041-11ef-9dad-00155de8647c',
		dateemploy: '20.01.2022',
		datedismis: '',
		email: 'novikova.m@ammoni.ru',
		sex: 'Женский',
		person_guid: '85546027-a025-11ef-9dad-00155de8647c',
		department_guid: '86253b53-4e33-11ee-9d85-00155de8647c'
	},
	{
		org_guid: '8753101a-4fb8-11ed-9d6f-00155dd75c64',
		post_guid: 'aadbba8e-a0c4-11ef-9dad-00155de8647c',
		ident: '0000-00589',
		employee: 'Лебедев Сергей Михайлович',
		employee_guid: 'fa04d015-a041-11ef-9dad-00155de8647c',
		dateemploy: '14.07.2023',
		datedismis: '',
		email: 'lebedev.s@ammoni.ru',
		sex: 'Мужской',
		person_guid: '95546027-a025-11ef-9dad-00155de8647c',
		department_guid: '86253e12-4e33-11ee-9d85-00155de8647c'
	},
	{
		org_guid: '8753101a-4fb8-11ed-9d6f-00155dd75c64',
		post_guid: 'bbdbba8e-a0c4-11ef-9dad-00155de8647c',
		ident: '0000-00590',
		employee: 'Васильева Екатерина Дмитриевна',
		employee_guid: 'ab04d015-a041-11ef-9dad-00155de8647c',
		dateemploy: '09.03.2024',
		datedismis: '',
		email: 'vasilieva.e@ammoni.ru',
		sex: 'Женский',
		person_guid: 'a5546027-a025-11ef-9dad-00155de8647c',
		department_guid: '86253c25-4e33-11ee-9d85-00155de8647c'
	},
	{
		org_guid: '8753101a-4fb8-11ed-9d6f-00155dd75c64',
		post_guid: 'ccdbba8e-a0c4-11ef-9dad-00155de8647c',
		ident: '0000-00601',
		employee: 'Орлов Андрей Викторович',
		employee_guid: 'bc04d015-a041-11ef-9dad-00155de8647c',
		dateemploy: '25.05.2020',
		datedismis: '',
		email: 'orlov.a@ammoni.ru',
		sex: 'Мужской',
		person_guid: 'b5546027-a025-11ef-9dad-00155de8647c',
		department_guid: '86253b53-4e33-11ee-9d85-00155de8647c'
	},
	{
		org_guid: '8753101a-4fb8-11ed-9d6f-00155dd75c64',
		post_guid: 'dddbba8e-a0c4-11ef-9dad-00155de8647c',
		ident: '0000-00612',
		employee: 'Смирнова Ольга Сергеевна',
		employee_guid: 'cd04d015-a041-11ef-9dad-00155de8647c',
		dateemploy: '11.11.2021',
		datedismis: '',
		email: 'smirnova.o@ammoni.ru',
		sex: 'Женский',
		person_guid: 'c5546027-a025-11ef-9dad-00155de8647c',
		department_guid: '86253e12-4e33-11ee-9d85-00155de8647c'
	},
	{
		org_guid: '8753101a-4fb8-11ed-9d6f-00155dd75c64',
		post_guid: 'eedbba8e-a0c4-11ef-9dad-00155de8647c',
		ident: '0000-00623',
		employee: 'Павлов Игорь Александрович',
		employee_guid: 'de04d015-a041-11ef-9dad-00155de8647c',
		dateemploy: '07.02.2018',
		datedismis: '30.08.2023',
		email: 'pavlov.i@ammoni.ru',
		sex: 'Мужской',
		person_guid: 'd5546027-a025-11ef-9dad-00155de8647c',
		department_guid: '86253c25-4e33-11ee-9d85-00155de8647c'
	},
	{
		org_guid: '8753101a-4fb8-11ed-9d6f-00155dd75c64',
		post_guid: 'ffdbba8e-a0c4-11ef-9dad-00155de8647c',
		ident: '0000-00634',
		employee: 'Романова Наталья Викторовна',
		employee_guid: 'ef04d015-a041-11ef-9dad-00155de8647c',
		dateemploy: '18.09.2019',
		datedismis: '',
		email: 'romanova.n@ammoni.ru',
		sex: 'Женский',
		person_guid: 'e5546027-a025-11ef-9dad-00155de8647c',
		department_guid: '86253b53-4e33-11ee-9d85-00155de8647c'
	},
	{
		org_guid: '8753101a-4fb8-11ed-9d6f-00155dd75c64',
		post_guid: 'a1dbba8e-a0c4-11ef-9dad-00155de8647c',
		ident: '0000-00645',
		employee: 'Кузнецов Максим Игоревич',
		employee_guid: 'f004d015-a041-11ef-9dad-00155de8647c',
		dateemploy: '04.04.2022',
		datedismis: '',
		email: 'kuznetsov.m@ammoni.ru',
		sex: 'Мужской',
		person_guid: 'f5546027-a025-11ef-9dad-00155de8647c',
		department_guid: '86253e12-4e33-11ee-9d85-00155de8647c'
	},
	{
		org_guid: '8753101a-4fb8-11ed-9d6f-00155dd75c64',
		post_guid: 'a2dbba8e-a0c4-11ef-9dad-00155de8647c',
		ident: '0000-00656',
		employee: 'Белова Анастасия Олеговна',
		employee_guid: 'a104d015-a041-11ef-9dad-00155de8647c',
		dateemploy: '16.10.2023',
		datedismis: '',
		email: 'belova.a@ammoni.ru',
		sex: 'Женский',
		person_guid: 'a1546027-a025-11ef-9dad-00155de8647c',
		department_guid: '86253c25-4e33-11ee-9d85-00155de8647c'
	},
	...generateAdditionalEmployees(82)
]
