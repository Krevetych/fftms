import { IPlan } from './plan.types'

export enum EMonth {
	JANUARY = 'Январь',
	FEBRUARY = 'Февраль',
	MARCH = 'Март',
	APRIL = 'Апрель',
	MAY = 'Май',
	JUNE = 'Июнь',
	JULY = 'Июль',
	AUGUST = 'Август',
	SEPTEMBER = 'Сентябрь',
	OCTOBER = 'Октябрь',
	NOVEMBER = 'Ноябрь',
	DECEMBER = 'Декабрь'
}

export enum EMonthHalf {
	FIRST = '1',
	SECOND = '2'
}

export interface ISubject {
	id: string
	month: EMonth
	monthHalf: EMonthHalf
	hours: number
	plan: IPlan
}

export interface ISubjectCreate {
	month: EMonth
	monthHalf: EMonthHalf
	hours: number
	planId: string
}

export interface ISubjectUpdate {
	month?: EMonth
	monthHalf?: EMonthHalf
	hours?: number
	planId?: string
}
