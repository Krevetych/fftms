'use client'

import { Heading } from '@/components/Heading'
import NotFoundData from '@/components/NotFoundData'

import { useProfile } from '@/hooks/useProfile'

import { Teachers } from './Teacher'

export function TeacherComponent() {
	const { data } = useProfile()

	const isAdmin = data?.isAdmin

	return (
		<>
			{isAdmin ? (
				<>
					<Heading title='Преподаватели' />
					<Teachers />
				</>
			) : (
				<NotFoundData />
			)}
		</>
	)
}
