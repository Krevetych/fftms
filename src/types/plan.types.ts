import { IGroup } from './group.types'
import { IObject } from './object.types'
import {
	EMonth,
	EMonthHalf,
	ETerm,
	ISubject,
	ISubjectTerm
} from './subject.types'
import { ITeacher } from './teacher.types'

export enum ERate {
	SALARIED = 'SALARIED',
	HOURLY = 'HOURLY'
}

export interface ISubjectForm {
	year: string
	rate: ERate
	objectId: string
	teacherId: string
	groupId: string
}

export interface IPlan {
	id: string
	year: string
	rate: ERate
	maxHours: number
	worked: number
	Object: IObject
	teacher: ITeacher
	group: IGroup
}

export interface IPlanD {
	id: string
	isDeleted: boolean
	year: string
	rate: ERate
	maxHours: number
	worked: number
	Object: IObject
	teacher: ITeacher
	group: IGroup
}

export interface IUnloadPlans {
	year: string
	rate: ERate
	term?: ETerm
	month?: EMonth
	monthHalf?: EMonthHalf
}

export interface IFilteredPlan {
	id: string
	year: string
	rate: ERate
	maxHours: number
	worked: number
	Object: IObject
	teacher: ITeacher
	group: IGroup
	Subject: ISubject[]
	SubjectTerm: ISubjectTerm[]
}

export interface IFilters {
	year: string
	rate: ERate
	term?: ETerm
	month?: EMonth
	monthHalf?: EMonthHalf
}

export interface IPlans {
	year?: string
	rate?: ERate
	objectId?: string
	teacherId?: string
	groupId?: string
}

export interface IPlanCreate {
	year: string
	rate: ERate
	maxHours: number
	worked: number
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
