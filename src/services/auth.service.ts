import {
	IAuthForm,
	ILoginResponse,
	IRegisterResponse
} from '@/types/auth.types'

import { axiosClassic, axiosWithAuth } from '@/api/interceptors'

import { tokenService } from './token.service'

class AuthService {
	private URL = '/auth'

	async login(data: IAuthForm) {
		const res = await axiosClassic.post<ILoginResponse>(
			`${this.URL}/login`,
			data
		)

		if (res.data.accessToken) {
			tokenService.saveTokenStorage(res.data.accessToken)
		}

		return res
	}

	async logout() {
		const res = await axiosWithAuth.post<boolean>(`${this.URL}/logout`)

		if (res.data) {
			tokenService.removeFromStorage()
		}

		return res
	}
}

export const authService = new AuthService()
