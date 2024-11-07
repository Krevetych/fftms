export interface IObject {
	id: string
	name: string
}

export interface IObjectD {
	id: string
	name: string
	isDeleted: boolean
}

export interface IObjectCreate {
	name: string
}

export interface IObjectUpdate {
	name?: string
}
