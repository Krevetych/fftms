import { Metadata } from 'next'

import { Heading } from '@/components/Heading'

import { NO_INDEX_PAGE } from '@/constants/seo.constants'

export const metadata: Metadata = {
	title: 'Предметы',
	...NO_INDEX_PAGE
}

export default function ObjectsPage() {
	return (
		<>
			<Heading title='Предметы' />
			<div>Hello</div>
		</>
	)
}
