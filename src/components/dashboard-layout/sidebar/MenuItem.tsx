import Link from 'next/link'

import { IMenuItem } from './menu.interface'

export function MenuItem({
	item,
	collapsed
}: {
	item: IMenuItem
	collapsed: boolean
}) {
	return (
		<div>
			{collapsed ? (
				<Link
					href={item.link}
					className='flex items-center gap-2 my-3 transition-colors hover:text-primary'
				>
					<item.icon size={24} />
				</Link>
			) : (
				<Link
					href={item.link}
					className='flex gap-2 items-center py-2 mt-1 px-5 transition-colors hover:text-primary'
				>
					<item.icon size={24} />
					<span className='truncate'>{item.name}</span>
				</Link>
			)}
		</div>
	)
}
