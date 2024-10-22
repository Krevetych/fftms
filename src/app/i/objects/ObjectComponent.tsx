'use client'

import { Heading } from '@/components/Heading'
import NotFoundData from '@/components/NotFoundData'

import { useProfile } from '@/hooks/useProfile'

import { Object } from './Object'

export function ObjectComponent() {
	const { data } = useProfile()

	const isAdmin = data?.isAdmin

	return (
		<>
			{isAdmin ? (
				<>
					<Heading title='Предметы' />
					<Object />
				</>
			) : (
				<NotFoundData />
			)}
		</>
	)
}
