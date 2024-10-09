import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'

import { SITE_NAME } from '@/constants/seo.constants'

import './globals.css'

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
	description: 'Faculty Time Management System'
}

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='en'>
			<body className={zed.className}>{children}</body>
		</html>
	)
}
