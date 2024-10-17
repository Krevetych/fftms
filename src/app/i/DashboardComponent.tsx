'use client'

import { redirect } from 'next/navigation'

import { Heading } from '@/components/Heading'
import NotFoundData from '@/components/NotFoundData'

import { PAGES } from '@/config/url.config'

import { useProfile } from '@/hooks/useProfile'

import { Dashboard } from './Dashboard'

export function DashboardComponent() {
	const { data } = useProfile()

	const isAdmin = data?.isAdmin || false

	if (!isAdmin) {
		redirect(PAGES.SUBJECTS_H)
	}

	return (
		<>
			<Heading title='Главная' />
			<Dashboard />
		</>
	)
}
