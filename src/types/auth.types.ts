export interface IAuthForm {
	login: string
	password: string
}

export interface IUser {
	id: string
	login: string
	isAdmin: boolean
}

export interface IUserCreate {
	login?: string
	password?: string
	isAdmin?: boolean
}

export interface IUserPassword {
	oldPassword: string
	newPassword: string
	confirmPassword: string
}

export interface ILoginResponse {
	accessToken: string
	user: IUser
}

export interface IRegisterResponse {
	user: IUser
}
