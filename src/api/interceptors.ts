import axios, { type CreateAxiosDefaults } from 'axios'
import { log } from 'console'
import { request } from 'http'
import { config } from 'process'
import { use } from 'react'

import { errorCatch } from './error'
import { tokenService } from '@/services/token.service'

const options: CreateAxiosDefaults = {
	baseURL: 'https://fftms.universal-hub.site',
	headers: {
		'Content-Type': 'application/json'
	},
	withCredentials: true
}

const axiosClassic = axios.create(options)
const axiosWithAuth = axios.create(options)

axiosWithAuth.interceptors.request.use(cfg => {
	const accessToken = tokenService.getAccessToken()

	if (cfg?.headers && accessToken) {
		cfg.headers.Authorization = `Bearer ${accessToken}`
	}

	return cfg
})

axiosWithAuth.interceptors.response.use(
	cfg => cfg,
	async err => {
		const originalReq = { ...err.config, _isRetry: false }

		if (
			(err?.response?.status === 401 ||
				errorCatch(err) === 'Invalid access token' ||
				errorCatch(err) === 'jwt must be provided') &&
			!originalReq._isRetry
		) {
			originalReq._isRetry = true

			try {
				console.log('Attempting to refresh tokens...')
				await tokenService.getNewTokens()
				return axiosWithAuth.request(originalReq)
			} catch (error) {
				console.error('Error while refreshing tokens:', error)
				if (errorCatch(error) === 'jwt expired') {
					tokenService.removeFromStorage()
				}
			}
		}

		throw err
	}
)

export { axiosClassic, axiosWithAuth }
