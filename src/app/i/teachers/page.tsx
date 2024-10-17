import { Metadata } from 'next'

import { NO_INDEX_PAGE } from '@/constants/seo.constants'

import { TeacherComponent } from './TeacherComponent'

export const metadata: Metadata = {
	title: 'Преподаватели',
	...NO_INDEX_PAGE
}

export default function TeachersPage() {
	return (
		<>
			<TeacherComponent />
		</>
	)
}
