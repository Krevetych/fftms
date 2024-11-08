'use client'

import { Download } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

import Loader from '@/components/Loader'

import { PAGES } from '@/config/url.config'

import { useProfile } from '@/hooks/useProfile'

import { Unload } from '../Unload'

import { LogoutButton } from './LogoutButton'
import { MenuItem } from './MenuItem'
import { Profile } from './Profile'
import { MENU } from './menu.data'

export function Sidebar() {
	const { data, isLoading } = useProfile()
	const [modal, setModal] = useState(false)

	const handleModal = () => {
		setModal(!modal)
	}

	const login = data?.login

	const year = new Date().getFullYear()

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
				<div
					className='flex gap-2 items-center py-2 mt-2 px-5 transition-colors hover:bg-primary rounded-lg'
					onClick={handleModal}
				>
					<Download />
					<span className='truncate'>
						<span>Выгрузить данные</span>
					</span>
				</div>
			</div>
			<footer className='text-xs opacity-40 font-normal text-center p-5'>
				<Link
					href={PAGES.DOCS}
					className='transition-colors cursor-pointer hover:text-primary hover:underline'
				>
					Документация к приложению
				</Link>
				<p>{year} &copy; Все права защищены</p>
				<p>v.{process.env.NEXT_PUBLIC_VERSION}</p>
			</footer>
			{modal && <Unload setModal={setModal} />}
		</aside>
	)
}
