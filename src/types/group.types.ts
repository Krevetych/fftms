export enum EType {
	NPO = 'NPO',
	BUDGET = 'BUDGET',
	NON_BUDGET = 'NON_BUDGET'
}

export enum EStatus {
	ACTIVE = 'ACTIVE',
	INACTIVE = 'INACTIVE'
}

export enum ECourse {
	FIRST = 'FIRST',
	SECOND = 'SECOND',
	THIRD = 'THIRD',
	FOURTH = 'FOURTH',
	INACTIVE = 'INACTIVE'
}

export interface IGroup {
	id: string
	name: string
	type: EType
	course: ECourse
	status: EStatus
}

export interface IGroupCreate {
	name: string
	type: EType
	course: ECourse
	status: EStatus
}

export interface IFilteredGroup {
	type?: EType
	course?: ECourse
	status?: EStatus
}

export interface IGroupUpdate {
	name?: string
	type?: EType
	course?: ECourse
	status?: EStatus
}
