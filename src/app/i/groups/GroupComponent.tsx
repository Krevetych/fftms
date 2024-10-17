'use client'

import { Heading } from '@/components/Heading'
import NotFoundData from '@/components/NotFoundData'

import { useProfile } from '@/hooks/useProfile'

import { Groups } from './Groups'

export function GroupComponent() {
	const { data } = useProfile()

	const isAdmin = data?.isAdmin || false

	return (
		<>
			{isAdmin ? (
				<>
					<Heading title='Группы' />
					<Groups />
				</>
			) : (
				<NotFoundData />
			)}
		</>
	)
}
