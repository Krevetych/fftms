export enum EType {
	NPO = 'NPO',
	BUDGET = 'BUDGET',
	NON_BUDGET = 'NON_BUDGET'
}

export enum ECourse {
	FIRST = 'FIRST',
	SECOND = 'SECOND',
	THIRD = 'THIRD',
	FOURTH = 'FOURTH',
	INACTIVE = 'INACTIVE'
}

export interface ISubjectForm {
	type: EType
	course: ECourse
}

export interface IGroup {
	id: string
	name: string
	type: EType
	course: ECourse
}

export interface IGroupD {
	id: string
	name: string
	type: EType
	course: ECourse
	isDeleted: boolean
}

export interface IGroupCreate {
	name: string
	type: EType
	course: ECourse
}

export interface IFilteredGroup {
	type?: EType
	course?: ECourse
}

export interface IGroupUpdate {
	name?: string
	type?: EType
	course?: ECourse
}
