import { Metadata } from 'next'

import { NO_INDEX_PAGE } from '@/constants/seo.constants'

import { ArchiveComponent } from './ArchiveComponent'

export const metadata: Metadata = {
	title: 'Архив',
	...NO_INDEX_PAGE
}

export default function ArchivePage() {
	return (
		<>
			<ArchiveComponent />
		</>
	)
}
