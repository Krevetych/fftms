import { Metadata } from 'next'

import { Heading } from '@/components/Heading'
import NotFoundData from '@/components/NotFoundData'

import { NO_INDEX_PAGE } from '@/constants/seo.constants'

export const metadata: Metadata = {
	title: 'Главная',
	...NO_INDEX_PAGE
}

export default function DashboardPage() {
	return (
		<>
			<Heading title='Главная' />
			<div>
				<NotFoundData />
			</div>
		</>
	)
}
