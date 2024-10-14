import { IPlan } from './plan.types'

export enum EMonth {
	JANUARY = 'JANUARY',
	FEBRUARY = 'FEBRUARY',
	MARCH = 'MARCH',
	APRIL = 'APRIL',
	MAY = 'MAY',
	JUNE = 'JUNE',
	JULY = 'JULY',
	AUGUST = 'AUGUST',
	SEPTEMBER = 'SEPTEMBER',
	OCTOBER = 'OCTOBER',
	NOVEMBER = 'NOVEMBER',
	DECEMBER = 'DECEMBER'
}

export enum EMonthHalf {
	FIRST = 'FIRST',
	SECOND = 'SECOND'
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
