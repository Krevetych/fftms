import Loader from '@/components/Loader'

import { useProfile } from '@/hooks/useProfile'

import { LogoutButton } from './LogoutButton'
import { MenuItem } from './MenuItem'
import { Profile } from './Profile'
import { MENU } from './menu.data'

export function Sidebar() {
	const { data, isLoading } = useProfile()

	const login = data?.login

	return (
		<aside className='bg-card rounded-2xl p-4 h-full flex flex-col justify-between'>
			<div className='flex items-center justify-between'>
				{isLoading ? <Loader /> : <Profile login={login} />}
				<LogoutButton />
			</div>
			<div>
				{MENU.filter(item => data?.isAdmin || item.access.includes('user')).map(
					item => (
						<MenuItem
							item={item}
							key={item.link}
						/>
					)
				)}
			</div>
			<footer className='text-xs opacity-40 font-normal text-center p-5'>
				2024 &copy; Все права защищены
			</footer>
		</aside>
	)
}
