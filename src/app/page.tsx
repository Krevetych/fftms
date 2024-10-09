import Link from 'next/link'

import { PAGES } from '@/config/url.config'

export default function Home() {
	return (
		<div>
			<Link href={PAGES.LOGIN}>Перейти в панель</Link>
		</div>
	)
}
