import { type } from 'os'

import { EType } from './group.types'
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

export interface IForm {
	month: EMonth
	monthHalf: EMonthHalf
	teacherId: string
	type: EType
	groupId: string
}

export interface ITermForm {
	term: ETerm
	teacherId: string
	type: EType
	groupId: string
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

export interface IFilteredSubject {
	month?: EMonth
	monthHalf?: EMonthHalf
	teacherId?: string
	type?: EType
	groupId?: string
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

export interface IFilteredSubjectTerm {
	term?: ETerm
	teacherId?: string
	type?: EType
	groupId?: string
}

export interface ISubjectTermUpdate {
	term?: ETerm
	hours?: number
	planId?: string
}
