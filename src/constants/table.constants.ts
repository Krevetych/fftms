import { ECourse, EType } from '@/types/group.types'
import { ERate } from '@/types/plan.types'
import { EMonth, EMonthHalf, ETerm } from '@/types/subject.types'

export const RATE: Record<ERate, string> = {
	[ERate.HOURLY]: 'Почасовая',
	[ERate.SALARIED]: 'Тарифицированная'
}

export const PLAN = [
	{
		id: 1,
		title: 'Учебный год'
	},
	{
		id: 2,
		title: 'Тариф'
	},
	{
		id: 3,
		title: 'Макс. кол-во часов'
	},
	{
		id: 4,
		title: 'Предмет'
	},
	{
		id: 5,
		title: 'Преподаватель'
	},
	{
		id: 6,
		title: 'Группа'
	}
]

export const SUBJECT = [
	{
		id: 1,
		title: 'Месяц'
	},
	{
		id: 2,
		title: 'Половина месяца'
	},
	{
		id: 3,
		title: 'Часы'
	},
	{
		id: 5,
		title: 'Предмет'
	},
	{
		id: 6,
		title: 'Преподаватель'
	},
	{
		id: 7,
		title: 'Группа'
	},
	{
		id: 8,
		title: 'Вид группы'
	},
	{
		id: 9,
		title: 'Год'
	}
]

export const SUBJECT_RATE = [
	{
		id: 1,
		title: 'Семестр'
	},
	{
		id: 3,
		title: 'Часы'
	},
	{
		id: 5,
		title: 'Предмет'
	},
	{
		id: 6,
		title: 'Преподаватель'
	},
	{
		id: 7,
		title: 'Группа'
	},
	{
		id: 8,
		title: 'Вид группы'
	},
	{
		id: 9,
		title: 'Год'
	}
]

export const MONTH: Record<EMonth, string> = {
	[EMonth.JANUARY]: 'Январь',
	[EMonth.FEBRUARY]: 'Февраль',
	[EMonth.MARCH]: 'Март',
	[EMonth.APRIL]: 'Апрель',
	[EMonth.MAY]: 'Май',
	[EMonth.JUNE]: 'Июнь',
	[EMonth.SEPTEMBER]: 'Сентябрь',
	[EMonth.OCTOBER]: 'Октябрь',
	[EMonth.NOVEMBER]: 'Ноябрь',
	[EMonth.DECEMBER]: 'Декабрь'
}

export const MONTH_HALF: Record<EMonthHalf, string> = {
	[EMonthHalf.FIRST]: 'Первая',
	[EMonthHalf.SECOND]: 'Вторая'
}

export const GROUP = [
	{
		id: 1,
		title: 'Название группы'
	},
	{
		id: 2,
		title: 'Курс'
	},
	{
		id: 3,
		title: 'Тип группы'
	}
]

export const TYPE: Record<EType, string> = {
	[EType.NPO]: 'НПО',
	[EType.BUDGET]: 'Бюджетная',
	[EType.NON_BUDGET]: 'Внебюджетная'
}

export const COURSE: Record<ECourse, string> = {
	[ECourse.FIRST]: '1',
	[ECourse.SECOND]: '2',
	[ECourse.THIRD]: '3',
	[ECourse.FOURTH]: '4',
	[ECourse.INACTIVE]: '-'
}

export const TERM: Record<ETerm, string> = {
	[ETerm.FIRST]: '1',
	[ETerm.SECOND]: '2'
}
