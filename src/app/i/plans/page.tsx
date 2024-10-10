import { Metadata } from 'next'

import { Heading } from '@/components/Heading'

import { NO_INDEX_PAGE } from '@/constants/seo.constants'

export const metadata: Metadata = {
	title: 'Учебные планы',
	...NO_INDEX_PAGE
}

export default function PlansPage() {
	return (
		<>
			<Heading title='Учебные планы' />
			<div>Hello</div>
		</>
	)
}
