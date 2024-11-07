'use client'

import { Heading } from '@/components/Heading'
import NotFoundData from '@/components/NotFoundData'

import { useProfile } from '@/hooks/useProfile'

import { Archive } from './Archive'

export function ArchiveComponent() {
	const { data } = useProfile()

	const isAdmin = data?.isAdmin

	return (
		<>
			{isAdmin ? (
				<>
					<Heading title='Архив' />
					<Archive />
				</>
			) : (
				<NotFoundData />
			)}
		</>
	)
}
