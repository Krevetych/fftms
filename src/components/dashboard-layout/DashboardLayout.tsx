'use client'

import { type PropsWithChildren, useState } from 'react'

import { Sidebar } from './sidebar/Sidebar'

export default function DashboardLayout({
	children
}: PropsWithChildren<unknown>) {
	const [collapsed, setCollapsed] = useState<boolean>(false)

	const toggleCollapsed = () => {
		setCollapsed(collapsed => !collapsed)
	}

	return (
		<div
			className={`${collapsed ? 'grid-cols-[60px_6fr]' : 'grid-cols-[1.4fr_6fr]'} grid h-screen gap-x-5 p-5`}
		>
			<Sidebar
				collapsed={collapsed}
				toggleCollapsed={toggleCollapsed}
				setCollapsed={setCollapsed}
			/>
			<main className='overflow-x-hidden h-full relative bg-card rounded-2xl p-4'>
				{children}
			</main>
		</div>
	)
}
