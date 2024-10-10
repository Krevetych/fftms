export interface IAuthForm {
	login: string
	password: string
}

export interface IUser {
	id: string
	login: string
	isAdmin: boolean
}

export interface IUpdateUser {
	login?: string
	password?: string
	isAdmin?: boolean
}

export interface ILoginResponse {
	accessToken: string
	user: IUser
}

export interface IRegisterResponse {
	user: IUser
}
