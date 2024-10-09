import { Metadata } from 'next'

import { Heading } from '@/components/Heading'

import { NO_INDEX_PAGE } from '@/constants/seo.constants'

export const metadata: Metadata = {
	title: 'Dashboard',
	...NO_INDEX_PAGE
}

export default function DashboardPage() {
	return (
		<div className='bg-card rounded-2xl p-5 my-5 mr-4'>
			<Heading title='Панель управления' />
			<div>Hello</div>
		</div>
	)
}
