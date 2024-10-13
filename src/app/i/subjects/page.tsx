import { Metadata } from 'next'

import { Heading } from '@/components/Heading'

import { NO_INDEX_PAGE } from '@/constants/seo.constants'

import { Subject } from './Subject'

export const metadata: Metadata = {
	title: 'Вычитанные часы',
	...NO_INDEX_PAGE
}

export default function SubjectsPage() {
	return (
		<>
			<Heading title='Вычитанные часы' />
			<Subject />
		</>
	)
}
