import { IGroup } from './group.types'
import { IObject } from './object.types'
import { ITeacher } from './teacher.types'

export enum ERate {
	SALARIED = 'Тарифицированная',
	HOURLY = 'Часовая'
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
