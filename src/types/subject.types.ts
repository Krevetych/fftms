import { IPlan } from './plan.types'

export enum EMonth {
	JANUARY = 'JANUARY',
	FEBRUARY = 'FEBRUARY',
	MARCH = 'MARCH',
	APRIL = 'APRIL',
	MAY = 'MAY',
	JUNE = 'JUNE',
	SEPTEMBER = 'SEPTEMBER',
	OCTOBER = 'OCTOBER',
	NOVEMBER = 'NOVEMBER',
	DECEMBER = 'DECEMBER'
}

export enum EMonthHalf {
	FIRST = 'FIRST',
	SECOND = 'SECOND'
}

export enum ETerm {
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

export interface ISubjectTerm {
	id: string
	term: ETerm
	hours: number
	plan: IPlan
}

export interface ISubjectTermCreate {
	term: ETerm
	hours: number
	planId: string
}

export interface ISubjectTermUpdate {
	term?: ETerm
	hours?: number
	planId?: string
}
