import { Metadata } from 'next'

import { Heading } from '@/components/Heading'

import { NO_INDEX_PAGE } from '@/constants/seo.constants'

import { Groups } from './Groups'

export const metadata: Metadata = {
	title: 'Groups',
	...NO_INDEX_PAGE
}

export default function GroupsPage() {
	return (
		<>
			<Heading title='Группы' />
			<Groups />
		</>
	)
}
