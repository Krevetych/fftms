'use client'

import Link from 'next/link'
import { useState } from 'react'

import Loader from '@/components/Loader'

import { PAGES } from '@/config/url.config'

export function Main() {
	const [loading, setLoading] = useState<boolean>(false)

	const toggleLoading = () => {
		setLoading(loading => !loading)
	}

	return (
		<>
			<div
				className='flex h-screen items-center justify-center'
				onClick={toggleLoading}
			>
				<Link
					href={PAGES.LOGIN}
					className='text-xl font-semibold'
				>
					<div className='bg-primary rounded-lg p-4 hover:bg-primary/80 transition-colors'>
						{loading ? <Loader /> : <p>Перейти в панель</p>}
					</div>
				</Link>
			</div>
		</>
	)
}
