import { Metadata } from 'next'

import { NO_INDEX_PAGE } from '@/constants/seo.constants'
import { notFound } from 'next/navigation'


export const metadata: Metadata = {
	title: 'Auth',
	...NO_INDEX_PAGE
}

export default function AuthPage() {
    notFound()
}
