'use client'

import { Heading } from '@/components/Heading'
import NotFoundData from '@/components/NotFoundData'

import { useProfile } from '@/hooks/useProfile'

import { Dashboard } from './Dashboard'

export function DashboardComponent() {
	const { data } = useProfile()

	const isAdmin = data?.isAdmin

	return (
		<>
			{isAdmin ? (
				<>
					<Heading title='Занесение часов преподавателей' />
					<Dashboard />
				</>
			) : (
				<NotFoundData />
			)}
		</>
	)
}
