'use client'

import type { PropsWithChildren } from 'react'

import { Sidebar } from './sidebar/Sidebar'

export default function DashboardLayout({
	children
}: PropsWithChildren<unknown>) {
	return (
		<div className='grid h-screen gap-x-5 grid-cols-[1.4fr_6fr] p-5'>
			<Sidebar />
			<main className='overflow-x-hidden relative bg-card rounded-2xl p-4'>
				{children}
			</main>
		</div>
	)
}
