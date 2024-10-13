export enum EKind {
	NPO = 'НПО',
	SPO = 'СПО'
}

export enum EType {
	BUDGET = 'Бюджетная',
	NON_BUDGET = 'Небюджетная'
}

export interface IGroup {
	id: string
	name: string
	kind: EKind
	type: EType
}

export interface IGroupCreate {
	name: string
	kind: EKind
	type: EType
}

export interface IGroupUpdate {
	name?: string
	kind?: EKind
	type?: EType
}
