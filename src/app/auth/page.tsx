import { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { NO_INDEX_PAGE } from '@/constants/seo.constants'

import { PAGES } from '@/config/url.config'

export const metadata: Metadata = {
	title: 'Auth',
	...NO_INDEX_PAGE
}

export default function AuthPage() {
	redirect(PAGES.LOGIN)
}
