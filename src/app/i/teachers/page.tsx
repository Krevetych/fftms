import { Metadata } from 'next'

import { Heading } from '@/components/Heading'

import { NO_INDEX_PAGE } from '@/constants/seo.constants'

export const metadata: Metadata = {
	title: 'Преподаватели',
	...NO_INDEX_PAGE
}

export default function TeachersPage() {
	return (
		<>
			<Heading title='Преподаватели' />
			<div>Hello</div>
		</>
	)
}
