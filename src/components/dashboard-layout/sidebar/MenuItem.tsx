import Link from 'next/link'

import { IMenuItem } from './menu.interface'

export function MenuItem({ item }: { item: IMenuItem }) {
	return (
		<div>
			<Link
				href={item.link}
				className='flex gap-2 items-center py-2 mt-2 px-5 transition-colors hover:bg-gray-700 rounded-lg'
			>
				<item.icon />
				<span>{item.name}</span>
			</Link>
		</div>
	)
}
