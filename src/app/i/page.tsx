import { Metadata } from 'next'

import { NO_INDEX_PAGE } from '@/constants/seo.constants'

import { DashboardComponent } from './DashboardComponent'

export const metadata: Metadata = {
	title: 'Занесение часов преподавателей',
	...NO_INDEX_PAGE
}

export default function DashboardPage() {
	return (
		<>
			<DashboardComponent />
		</>
	)
}
