export interface ITeacher {
	id: string
	fio: string
}

export interface ITeacherD {
	id: string
	fio: string
	isDeleted: boolean
}

export interface ITeacherCreate {
	fio: string
}

export interface ITeacherUpdate {
	fio?: string
}
