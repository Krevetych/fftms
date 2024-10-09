export interface IAuthForm {
	login: string
	password: string
}

export interface IUser {
	id: string
	login: string
}

export interface ILoginResponse {
	accessToken: string
	user: IUser
}

export interface IRegisterResponse {
	user: IUser
}
