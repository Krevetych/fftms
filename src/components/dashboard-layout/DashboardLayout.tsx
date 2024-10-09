import type { PropsWithChildren } from 'react'

export default function DashboardLayout({
	children
}: PropsWithChildren<unknown>) {
	return (
		<div className='grid min-h-screen 2xl:grid-cols-[1.1fr_6fr] grid-cols-[1.2fr_6fr]'>
			<div className='bg-card my-5 mx-4 rounded-2xl p-4'>Sidebar</div>
			<main className='overflow-x-hidden max-h-screen relative'>
				{children}
			</main>
		</div>
	)
}
