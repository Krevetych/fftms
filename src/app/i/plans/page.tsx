import { Metadata } from 'next'

import { Heading } from '@/components/Heading'

import { NO_INDEX_PAGE } from '@/constants/seo.constants'

import { Plans } from './Plans'

export const metadata: Metadata = {
	title: 'Учебные планы',
	...NO_INDEX_PAGE
}

export default function PlansPage() {
	return (
		<>
			<Heading title='Учебные планы' />
			<Plans />
		</>
	)
}
