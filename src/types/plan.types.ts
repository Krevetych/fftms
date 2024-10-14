import { IGroup } from './group.types'
import { IObject } from './object.types'
import { EMonth, EMonthHalf, ISubject } from './subject.types'
import { ITeacher } from './teacher.types'

export enum ERate {
	SALARIED = 'SALARIED',
	HOURLY = 'HOURLY'
}

export interface IPlan {
	id: string
	year: string
	rate: ERate
	maxHours: number
	Object: IObject
	teacher: ITeacher
	group: IGroup
}

export interface IFilteredPlan {
	id: string
	year: string
	rate: ERate
	maxHours: number
	Object: IObject
	teacher: ITeacher
	group: IGroup
	Subject: ISubject[]
}

export interface IFilters {
	year: string
	teacher: string
	month: EMonth
	monthHalf: EMonthHalf
}

export interface IPlanCreate {
	year: string
	rate: ERate
	maxHours: number
	objectId: string
	teacherId: string
	groupId: string
}

export interface IPlanUpdate {
	year?: string
	rate?: ERate
	maxHours?: number
	objectId?: string
	teacherId?: string
	groupId?: string
}
