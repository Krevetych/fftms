import Cookies from 'js-cookie'

import { ILoginResponse } from '@/types/auth.types'

import { axiosWithAuth } from '@/api/interceptors'

export enum EnumTokens {
	'ACCESS_TOKEN' = 'accessToken',
	'REFRESH_TOKEN' = 'refreshToken'
}

class TokenService {
	private URL = '/token'

	getAccessToken() {
		const accessToken = Cookies.get(EnumTokens.ACCESS_TOKEN)

		return accessToken || null
	}

	saveTokenStorage(accessToken: string) {
		Cookies.set(EnumTokens.ACCESS_TOKEN, accessToken, {
			domain: 'localhost',
			sameSite: 'strict',
			expires: 1
		})
	}

	removeFromStorage() {
		Cookies.remove(EnumTokens.ACCESS_TOKEN)
	}

	async getNewTokens() {
		const res = await axiosWithAuth.post<ILoginResponse>(
			`${this.URL}/new_tokens`
		)

		if (res.data.accessToken) {
			this.saveTokenStorage(res.data.accessToken)
		}

		return res
	}
}

export const tokenService = new TokenService()
