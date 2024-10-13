
export enum ERate {
	SALARIED = 'Тарифицированная',
	HOURLY = 'Часовая'
}

export interface IPlan {
	id: string
	year: string
	rate: ERate
	maxHours: number
	objectId: string
	teacherId: string
	groupId: string
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
