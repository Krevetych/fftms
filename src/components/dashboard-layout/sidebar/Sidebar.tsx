import Loader from '@/components/Loader'

import { useProfile } from '@/hooks/useProfile'

import { LogoutButton } from './LogoutButton'
import { MenuItem } from './MenuItem'
import { MENU } from './menu.data'

export function Sidebar() {
	const { data, isLoading } = useProfile()

	return (
		<aside className='bg-card rounded-2xl p-4 h-full flex flex-col justify-between'>
			<div className='flex items-center justify-between'>
				{isLoading ? (
					<Loader />
				) : (
					<p className='text-xl font-semibold capitalize'>{data?.login}</p>
				)}
				<LogoutButton />
			</div>
			<div>
				{MENU.map(item => (
					<MenuItem
						item={item}
						key={item.link}
					/>
				))}
			</div>
			<footer className='text-xs opacity-40 font-normal text-center p-5'>
				2024 &copy; Все права защищены
			</footer>
		</aside>
	)
}
