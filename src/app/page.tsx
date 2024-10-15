import Link from 'next/link'

import { PAGES } from '@/config/url.config'

export default function Home() {
	return (
		<div className='flex h-screen items-center justify-center'>
			<div className='bg-primary rounded-lg p-4 hover:bg-primary/80 transition-colors'>
				<Link
					href={PAGES.LOGIN}
					className='text-xl font-semibold'
				>
					Перейти в панель
				</Link>
			</div>
		</div>
	)
}
