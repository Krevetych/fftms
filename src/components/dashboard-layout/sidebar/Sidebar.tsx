'use client'

import { ChevronLeft, ChevronRight, Download } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import Loader from '@/components/Loader'

import { PAGES } from '@/config/url.config'

import { useProfile } from '@/hooks/useProfile'

import { Unload } from '../Unload'

import { LogoutButton } from './LogoutButton'
import { MenuItem } from './MenuItem'
import { Profile } from './Profile'
import { MENU } from './menu.data'

interface ISidebar {
	collapsed: boolean
	toggleCollapsed: () => void
	setCollapsed: React.Dispatch<React.SetStateAction<boolean>>
}

export function Sidebar({
	collapsed,
	toggleCollapsed,
	setCollapsed
}: ISidebar) {
	const { data, isLoading } = useProfile()
	const [modal, setModal] = useState(false)

	useEffect(() => {
		const savedState = localStorage.getItem('sidebarCollapsed')
		if (savedState) {
			setCollapsed(JSON.parse(savedState))
		}
	}, [])

	useEffect(() => {
		localStorage.setItem('sidebarCollapsed', JSON.stringify(collapsed))
	}, [collapsed])

	const handleModal = () => {
		setModal(!modal)
	}

	const login = data?.login

	const year = new Date().getFullYear()

	return (
		<aside className='bg-card relative rounded-2xl p-4 h-full flex flex-col justify-between'>
			{collapsed ? (
				<div className='text-center'>
					<LogoutButton />
				</div>
			) : isLoading ? (
				<Loader />
			) : (
				<div className='flex items-center justify-between'>
					<Profile login={login} />
					<LogoutButton />
				</div>
			)}
			<div>
				{MENU.filter(item => data?.isAdmin || item.access.includes('user')).map(
					item => (
						<MenuItem
							collapsed={collapsed}
							item={item}
							key={item.link}
						/>
					)
				)}
				{collapsed ? (
					<p
						className='flex items-center gap-2 my-3 transition-colors cursor-pointer hover:text-primary'
						onClick={handleModal}
					>
						<Download />
					</p>
				) : (
					<div
						className='flex gap-2 cursor-pointer items-center py-2 mt-1 px-5 transition-colors hover:text-primary'
						onClick={handleModal}
					>
						<Download size={24} />
						<span className='truncate'>Выгрузить данные</span>
					</div>
				)}
			</div>
			{collapsed ? (
				<div
					onClick={toggleCollapsed}
					className='text-center transition-colors hover:text-primary'
				>
					<ChevronRight />
				</div>
			) : (
				<>
					<div
						onClick={toggleCollapsed}
						className='absolute bottom-5 right-5 z-10 transition-colors cursor-pointer hover:text-primary'
					>
						<ChevronLeft />
					</div>
					<footer className='text-xs opacity-40 font-normal text-center p-5'>
						<Link
							href={PAGES.DOCS}
							className='transition-colors cursor-pointer hover:text-primary hover:underline'
						>
							Документация к приложению
						</Link>
						<p>{year} &copy; Все права защищены</p>
						<p>v.1.0</p>
					</footer>
				</>
			)}
			{modal && <Unload setModal={setModal} />}
		</aside>
	)
}
