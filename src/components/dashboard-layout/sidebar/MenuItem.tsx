import Link from 'next/link'

import { IMenuItem } from './menu.interface'

export function MenuItem({ item }: { item: IMenuItem }) {
	return (
		<div>
			<Link
				href={item.link}
				className='flex gap-2 items-center py-2 mt-2 px-5 transition-colors hover:bg-primary rounded-lg'
			>
				<item.icon />
				<span className='truncate'>{item.name}</span>
			</Link>
		</div>
	)
}
