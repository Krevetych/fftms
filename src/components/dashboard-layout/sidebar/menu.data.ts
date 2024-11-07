import {
	Archive,
	BookUser,
	Captions,
	Hourglass,
	LayoutDashboard,
	LibraryBig,
	NotebookText,
	School
} from 'lucide-react'

import { PAGES } from '@/config/url.config'

import { IMenuItem } from './menu.interface'

export const MENU: IMenuItem[] = [
	{
		icon: LayoutDashboard,
		name: 'Занесение часов преподавателей',
		link: PAGES.HOME,
		access: ['admin']
	},
	{
		icon: NotebookText,
		name: 'Учебные планы',
		link: PAGES.PLANS,
		access: ['admin']
	},
	{
		icon: Hourglass,
		name: 'Вычитанные часы (Час)',
		link: PAGES.SUBJECTS_H,
		access: ['admin', 'user']
	},
	{
		icon: Captions,
		name: 'Вычитанные часы (Тариф)',
		link: PAGES.SUBJECTS_T,
		access: ['admin', 'user']
	},
	{
		icon: BookUser,
		name: 'Группы',
		link: PAGES.GROUPS,
		access: ['admin']
	},
	{
		icon: LibraryBig,
		name: 'Предметы',
		link: PAGES.OBJECTS,
		access: ['admin']
	},
	{
		icon: School,
		name: 'Преподаватели',
		link: PAGES.TEACHERS,
		access: ['admin']
	},
	{
		icon: Archive,
		name: 'Архив',
		link: PAGES.ARCHIVE,
		access: ['admin']
	}
]
