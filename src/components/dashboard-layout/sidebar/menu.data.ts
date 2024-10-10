import {
	BookUser,
	Captions,
	LayoutDashboard,
	LibraryBig,
	NotebookText,
	School,
	Users
} from 'lucide-react'

import { PAGES } from '@/config/url.config'

import { IMenuItem } from './menu.interface'

export const MENU: IMenuItem[] = [
	{
		icon: LayoutDashboard,
		name: 'Главная',
		link: PAGES.HOME
	},
	{
		icon: NotebookText,
		name: 'Учебные планы',
		link: PAGES.PLANS
	},
	{
		icon: Captions,
		name: 'Вычитанные часы',
		link: PAGES.SUBJECTS
	},
	{
		icon: BookUser,
		name: 'Группы',
		link: PAGES.GROUPS
	},
	{
		icon: LibraryBig,
		name: 'Предметы',
		link: PAGES.OBJECTS
	},
	{
		icon: School,
		name: 'Преподаватели',
		link: PAGES.TEACHERS
	},
	{
		icon: Users,
		name: 'Пользователи',
		link: PAGES.USERS
	}
]
