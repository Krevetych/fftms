import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'
import { Toaster } from 'sonner'

import { SITE_NAME } from '@/constants/seo.constants'

import './globals.css'
import { Providers } from './providers'

const zed = Roboto({
	subsets: ['latin', 'cyrillic'],
	weight: ['100', '300', '400', '500', '700', '900'],
	display: 'swap',
	style: 'normal'
})

export const metadata: Metadata = {
	title: {
		default: SITE_NAME,
		template: `%s | ${SITE_NAME}`
	},
	description: 'Faculty Time Management System',
	icons: {
		icon: '/icon-white.png'
	}
}

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html
			lang='en'
			className='bg-bg text-text scroll-smooth antialiased'
		>
			<body className={zed.className}>
				<Providers>
					{children}
					<Toaster
						theme='dark'
						position='top-center'
						duration={2500}
						richColors
					/>
				</Providers>
			</body>
		</html>
	)
}
