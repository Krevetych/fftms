export enum EType {
	NPO = 'NPO',
	BUDGET = 'BUDGET',
	NON_BUDGET = 'NON_BUDGET'
}

export interface IGroup {
	id: string
	name: string
	type: EType
}

export interface IGroupCreate {
	name: string
	type: EType
}

export interface IGroupUpdate {
	name?: string
	type?: EType
}
