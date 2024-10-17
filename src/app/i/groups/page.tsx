import { Metadata } from 'next'

import { NO_INDEX_PAGE } from '@/constants/seo.constants'

import { GroupComponent } from './GroupComponent'

export const metadata: Metadata = {
	title: 'Groups',
	...NO_INDEX_PAGE
}

export default function GroupsPage() {
	return (
		<>
			<GroupComponent />
		</>
	)
}
