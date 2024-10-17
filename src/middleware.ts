import { NextRequest, NextResponse } from 'next/server'

import { PAGES } from './config/url.config'
import { EnumTokens } from './services/token.service'

export async function middleware(request: NextRequest, response: NextResponse) {
	const { url, cookies } = request

	const refreshToken = cookies.get(EnumTokens.REFRESH_TOKEN)

	const isRegisterPage = url.includes('/auth/register')
	const isLoginPage = url.includes('/auth/login')

	if ((isRegisterPage || isLoginPage) && refreshToken) {
		return NextResponse.redirect(new URL(PAGES.HOME, url))
	}

	if (isRegisterPage || isLoginPage) {
		return NextResponse.next()
	}

	if (!refreshToken) {
		return NextResponse.error()
	}

	return NextResponse.next()
}

export const config = {
	matcher: ['/i/:path*', '/auth/:path*']
}
