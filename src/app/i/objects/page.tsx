import { Metadata } from 'next'

import { NO_INDEX_PAGE } from '@/constants/seo.constants'

import { ObjectComponent } from './ObjectComponent'

export const metadata: Metadata = {
	title: 'Предметы',
	...NO_INDEX_PAGE
}

export default function ObjectsPage() {
	return (
		<>
			<ObjectComponent />
		</>
	)
}
