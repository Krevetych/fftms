import { Metadata } from 'next'

import { Heading } from '@/components/Heading'
import CustomTable from '@/components/Table'

import { NO_INDEX_PAGE } from '@/constants/seo.constants'

export const metadata: Metadata = {
	title: 'Главная',
	...NO_INDEX_PAGE
}

export default function DashboardPage() {
	const headers: string[] = ['Name', 'Role', 'Status']
	const data: Array<Record<string, string>> = [
		{ name: 'Tony Reichert', role: 'CEO', status: 'Active' },
		{ name: 'Zoey Lang', role: 'Technical Lead', status: 'Paused' },
		{ name: 'Jane Fisher', role: 'Senior Developer', status: 'Active' },
		{ name: 'William Howard', role: 'Community Manager', status: 'Vacation' }
	]
	return (
		<>
			<Heading title='Главная' />
			<div>
				<CustomTable
					headers={headers}
					data={data}
				/>
			</div>
		</>
	)
}
