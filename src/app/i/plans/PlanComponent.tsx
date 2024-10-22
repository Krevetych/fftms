'use client'

import { Heading } from '@/components/Heading'
import NotFoundData from '@/components/NotFoundData'

import { useProfile } from '@/hooks/useProfile'

import { Plans } from './Plans'

export function PlanComponent() {
	const { data } = useProfile()

	const isAdmin = data?.isAdmin

	return (
		<>
			{isAdmin ? (
				<>
					<Heading title='Учебные планы' />
					<Plans />
				</>
			) : (
				<NotFoundData />
			)}
		</>
	)
}
