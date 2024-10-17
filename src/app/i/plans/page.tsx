import { Metadata } from 'next'

import { NO_INDEX_PAGE } from '@/constants/seo.constants'

import { PlanComponent } from './PlanComponent'

export const metadata: Metadata = {
	title: 'Учебные планы',
	...NO_INDEX_PAGE
}

export default function PlansPage() {
	return (
		<>
			<PlanComponent />
		</>
	)
}
